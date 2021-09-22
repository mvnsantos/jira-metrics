const jiraExtract = require("./src/jira/jira-extract");
const spreadsheetWriter = require("./src/spreadsheet/google-spreadsheet-writer");

const promiseJiraObjects = jiraExtract.buildJiraObjects();

Promise.resolve(promiseJiraObjects).then((jiraObj) => {

   if (jiraObj != null && "issuesAge" in jiraObj && "leadTimeObj" in jiraObj) {
      spreadsheetWriter.writeInGoogleSpreadsheet(jiraObj.issuesAge, jiraObj.leadTimeObj);
   }

});