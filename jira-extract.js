const fetch = require('node-fetch');
const globalConfig = require("./config.json");
const jiraObjectBuilder = require("./jira_object_builder");

start();

async function start() {

    var jiraData = [];

    if (globalConfig['jira-projects'].length >= 1) {
        const promises = globalConfig['jira-projects'].map(async (project) => {

            var jiraTopObject = await retrieveJiraData(project['jira-id'], 0);
            jiraData = jiraData.concat(jiraTopObject.issues);

            const paginationNumber = jiraTopObject.total / jiraTopObject.maxResults;

            if (paginationNumber > 1) {

                for (var pageNumber = 1; pageNumber <= paginationNumber; pageNumber++) {
                    var jiraArrayIteration = await retrieveJiraData(project['jira-id'], jiraTopObject.maxResults * pageNumber);
                    jiraData = jiraData.concat(jiraArrayIteration.issues);
                }

            }

        });

        await Promise.all(promises);

        var obj = await factoryMasterObj(jiraData);
        writeData(obj.issuesAge, obj.leadTimeObj, obj.burnupObj);
    }

}

async function retrieveJiraData(project, startAt) {

    var url = `https://${globalConfig['jira-domain']}/rest/api/2/search?jql=project=${project}&fields=key,issuetype,created,status,summary,project&expand=changelog&properties=items&maxResults=100&startAt=${startAt}`;

    return await fetch(url,
        {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${Buffer.from(globalConfig['jira-credentials-token']).toString('base64')}`,
                'Accept': 'application/json'
            }
        })
        .then(res => res.json());
}


function writeData(issuesAge, lead, burnupObj) {
    writeInGoogleSpreadsheet(issuesAge, lead, burnupObj);
}

async function factoryMasterObj(obj) {
    var leadTimeObj = await jiraObjectBuilder.buildJiraObj(obj);

    //removendo os rejeitados
    leadTimeObj = leadTimeObj.filter(item => { return item.status.toLowerCase() != "rejected" });

    var issuesAge = jiraObjectBuilder.buildWipAgeFormatter(leadTimeObj);

    leadTimeObj.forEach(function (v) { delete v.transitions; delete v.timeInStatus; });

    var burnupObj = jiraObjectBuilder.buildBurnup(leadTimeObj, globalConfig['jira-projects']);

    return { leadTimeObj, issuesAge, burnupObj };

}

async function writeInGoogleSpreadsheet(issuesAge, issuesLead, burnup) {

    //https://developers.google.com/sheets/api/guides/authorizing
    //https://console.cloud.google.com/apis/credentials?project=crafty-circlet-315718&folder=&organizationId=
    const { GoogleSpreadsheet } = require('google-spreadsheet');

    const creds = require('./credentials-google.json'); // the file saved above
    const doc = new GoogleSpreadsheet(creds["sheet_id"]);
    await doc.useServiceAccountAuth(creds);

    await doc.loadInfo();

    const sheetLeadtime = doc.sheetsByIndex[0];
    await sheetLeadtime.clear();
    await sheetLeadtime.setHeaderRow(["issue_id", "leadtime", "key", "issueType", "created", "status", "doneDate", "title", "project"]);
    await sheetLeadtime.addRows(issuesLead);

    const sheetIssueAge = doc.sheetsByIndex[1];
    await sheetIssueAge.clear();
    await sheetIssueAge.setHeaderRow(["key", "title", "issueType", "status", "time", "created", "transitionDate", "issue_id", "project"]);
    await sheetIssueAge.addRows(issuesAge);

    const sheetBurnup = doc.sheetsByIndex[2];
    await sheetBurnup.clear();
    await sheetBurnup.setHeaderRow(["date", "issuesCreated", "issuesCompleted", "accumulatedIssuesCreated", "accumulatedIssuesCompleted", "projectName"]);
    await sheetBurnup.addRows(burnup);
}