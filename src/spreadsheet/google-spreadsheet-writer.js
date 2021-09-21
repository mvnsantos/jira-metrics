const { GoogleSpreadsheet } = require('google-spreadsheet');
const creds = require('../config/credentials-google.json');

module.exports = {
    async writeInGoogleSpreadsheet(issuesAge, issuesLead) {

        //Removendo itens desnecessários para o spreadsheet
        issuesLead.forEach(function (v) { delete v.transitions; delete v.timeInStatus; });

        //https://developers.google.com/sheets/api/guides/authorizing
        //https://console.cloud.google.com/apis/credentials?project=crafty-circlet-315718&folder=&organizationId=
        const doc = new GoogleSpreadsheet(creds["sheet_id"]);
        await doc.useServiceAccountAuth(creds);

        await doc.loadInfo();

        if(await doc.sheetCount < 2)
            await doc.addSheet();
        
        const sheetLeadtime = doc.sheetsByIndex[0];
        
        await sheetLeadtime.clear();
        await sheetLeadtime.setHeaderRow(["issue_id", "leadtime", "key", "issueType", "created", "status", "doneDate", "title", "project", "systemLeadTime"]);
        await sheetLeadtime.addRows(issuesLead);

        const sheetIssueAge = doc.sheetsByIndex[1];
        
        await sheetIssueAge.clear();
        await sheetIssueAge.setHeaderRow(["key", "title", "issueType", "status", "time", "created", "transitionDate", "issue_id", "project"]);
        await sheetIssueAge.addRows(issuesAge);
    }
}