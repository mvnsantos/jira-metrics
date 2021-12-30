const fetch = require('node-fetch');
const globalConfig = require("../config/config.json");
const jiraObjectBuilder = require("./jira-object-builder");

module.exports = {

    async buildJiraObjects() {

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

            return factoryJiraObj(jiraData);

        }

    }
}

async function retrieveJiraData(project, startAt) {

    var url = `https://${globalConfig['jira-domain']}/rest/api/2/search?jql=project=${project}&fields=key,issuetype,created,status,summary,project,resolutiondate&expand=changelog&properties=items&maxResults=100&startAt=${startAt}`;

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

async function factoryJiraObj(obj) {
    var leadTimeObj = await jiraObjectBuilder.buildJiraObj(obj, globalConfig['jira-projects']);

    //removendo os rejeitados
    leadTimeObj = leadTimeObj.filter(item => { return item.status.toLowerCase() != "rejected" });

    var issuesAge = jiraObjectBuilder.buildWipAgeFormatter(leadTimeObj);

    return { leadTimeObj, issuesAge };

}