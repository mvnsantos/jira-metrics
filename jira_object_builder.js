const { calculateDiffDateInDays, monthDiff, stringDate } = require("./utils");
const doneState = 'concluído';

module.exports = {
    //Constroi um objeto Jira
    buildJiraObj(json) {

        //Busco issue a issue
        return json.map((issue) => {

            var history_itens = [];
            const createdDate = new Date(issue.fields.created);
            var returnObj = { issue_id: issue.id, transitions: null, leadtime: null, key: issue.key, issueType: issue.fields.issuetype.name, created: new Date(issue.fields.created), status: issue.fields.status.name, doneDate: null, title: issue.fields.summary, timeInStatus: null,  project: issue.fields.project.name };

            //Se tiver changelog para eu navegar
            if (issue.changelog.histories != null && issue.changelog.histories.length > 0) {

                //Itero nas mudanças
                issue.changelog.histories.filter((history) => {

                    //Pego apenas os changelogs de mudança de status
                    var itens = history.items.filter((item) => {

                        if (item.field === 'status')
                            return item;

                    });

                    //Se tiver mudanças em relação a status ai gero a lista de mudanças dessa issue
                    if (itens.length > 0) {
                        history_itens.push({ date: new Date(history.created), from: itens[0].fromString, to: itens[0].toString });
                    }

                });

                //Ordeno o algoritmo de acordo com a data de criação do status de menor para maior
                const historyItensSorted = history_itens.sort((a, b) => a.date - b.date);

                //Avalio se aquela demanda está finalizada
                const isDone = issue.fields.status.name.toLowerCase() === doneState.toLowerCase();

                //Se tiver mudanças de status e estiver finalizado eu pego a ultima mudança da lista ordenado que eu tenho se não eu pego a data de hoje
                const lastChange = history_itens.length > 0 && isDone ? historyItensSorted[history_itens.length - 1].date : new Date();

                //Calculo de customer leadtime
                const diffDate = calculateDiffDateInDays(createdDate, lastChange);

                returnObj.leadtime = diffDate;
                returnObj.doneDate = isDone ? stringDate(historyItensSorted[history_itens.length - 1].date) : null;
                returnObj.transitions = historyItensSorted;
                returnObj.timeInStatus = this.timeInStatus(returnObj.transitions, returnObj.created, returnObj.status);

            }
            else {
                const diffDate = calculateDiffDateInDays(createdDate, new Date());
                returnObj.leadtime = diffDate;
            }

            return returnObj;

        });

    },

    //Gera um json contendo para uma issue o tempo onde ficou parada em cada status
    timeInStatus(transitions, created, status) {
        var i = 0;
        var ageStatus = [];

        //Se não tem nenhuma mudança de status eu calculo para o status atual considerando a data de criação e hoje
        if (transitions == null || transitions.length == 0) {
            ageStatus.push({ name: status, time: calculateDiffDateInDays(Date.now(), created), transitionDate: created });
        }
        else {
            //Se tiver modificações de status eu vou calcular
            transitions.filter(async trans => {

                //Se for a primeira vez preciso usar a data de criação com a mudança de estado do primeiro para o destino
                if (i == 0) {

                    //Gero a primeira mudança considerando o primeiro estado
                    ageStatus.push({ name: trans.from, time: calculateDiffDateInDays(trans.date, created), transitionDate: created });

                    //Se tiver apenas um registro ai calculo o lead time considerando a data de hoje desde que ele não esteja já finalizado
                    //Ex: Tem apenas 1 transição e já finalizado, eu já calculei o lead time e inseri no array acima
                    if (transitions.length == 1 && trans.to.toLowerCase() !== doneState.toLowerCase()) {
                        var lastObj = ageStatus.filter(q => q.name == trans.to)[0];
                        var lastIndex = ageStatus.findIndex(q => q.name == trans.to);
                        var lastDiffDays = calculateDiffDateInDays(Date.now(), trans.date);

                        if (lastObj == null) {
                            ageStatus.push({ name: trans.to, time: lastDiffDays, transitionDate: trans.date });
                        }
                        else {
                            ageStatus[lastIndex].time = lastDiffDays + lastObj.time;
                        }
                    }

                }
                else {

                    //Vejo se já tenho um registro com o nome do estado que estou iterando.
                    var obj = ageStatus.filter(q => q.name == trans.from)[0];
                    var index = ageStatus.findIndex(q => q.name == trans.from);
                    var diffDays = calculateDiffDateInDays(trans.date, transitions[i - 1].date);

                    //Se o objeto já existir não tem pq criar outro estado e sim adicionar mais tempo.
                    if (obj == null) {
                        ageStatus.push({ name: trans.from, time: diffDays, transitionDate: transitions[i - 1].date });
                    }
                    else {
                        ageStatus[index].time = diffDays + obj.time;
                    }

                    //Se for o último elemento e não tiver terminado pq não faz sentido eu contabilizar no done
                    if (i + 1 == transitions.length && trans.to.toLowerCase() !== doneState.toLowerCase()) {

                        var lastObj = ageStatus.filter(q => q.name == trans.to)[0];
                        var lastIndex = ageStatus.findIndex(q => q.name == trans.to);
                        var lastDiffDays = calculateDiffDateInDays(Date.now(), trans.date);

                        if (lastObj == null) {
                            ageStatus.push({ name: trans.to, time: lastDiffDays, transitionDate: trans.date });
                        }
                        else {
                            ageStatus[lastIndex].time = lastDiffDays + lastObj.time;
                        }

                    }

                }

                i++;

            });
        }

        return ageStatus;

    },
    buildWipAgeFormatter(issues_formated) {
        var issues_wip = [];

        //Pego o objeto do lead time
        issues_formated.filter((issue) => {

            if (issue != null) {
                
                //Vejo se aquela issue teve transições
                if (issue.timeInStatus != null && issue.timeInStatus.length > 0) {
                    //Se tiver desmembro as transições em linha
                    issue.timeInStatus.filter((age) => {
                        issues_wip.push({ key: issue.key, title: issue.title, issueType: issue.issueType, status: age.name, time: age.time, created: issue.created, transitionDate: stringDate(age.transitionDate), issue_id: issue.issue_id, project: issue.project });
                    });
                }
                //Se a issue não teve transicões eu considero a data de hoje para contabilizar no tempo de ciclo
                else {
                    issues_wip.push({ key: issue.key, title: issue.title, issueType: issue.issueType, status: issue.status, time: calculateDiffDateInDays(Date.now(), issue.created), created: issue.created, transitionDate: stringDate(issue.created), issue_id: issue.issue_id, project: issue.project });
                }
            }

        });

        return issues_wip;

    },
    buildBurnup(issues, jiraProjects) {
        var results = [];
        const initialDate = new Date(2021, 04);
        var accumulatedIssuesCreated = 0;
        var accumulatedIssuesCompleted = 0;

        for (var i = 1; i <= monthDiff(initialDate, new Date()) + 1; i++) {
            const dateBurnup = new Date(initialDate.getUTCFullYear(), initialDate.getMonth() + (i - 1), 1);
            const date = initialDate.getUTCMonth() + i + "/" + initialDate.getUTCFullYear();
           
            jiraProjects.filter((project) => {

                const projectKey = project['jira-id'].toLowerCase();
                var projectName = "";
                var issuesCreated = issues.filter(issue => {
                    const key = issue.key.split('-')[0].toLowerCase();
                    const dateCreated = issue.created.getUTCMonth() + 1 + "/" + issue.created.getUTCFullYear();
                    if (key == projectKey)
                        projectName = issue.project;
                    return dateCreated == date && key == projectKey;
                }).length;


                var issuesCompleted = issues.filter(issue => {
                    if (issue.doneDate != null) {
                        const key = issue.key.split('-')[0].toLowerCase();
                        const dateDone = parseInt(issue.doneDate.substring(0, 2)) + "/" + issue.doneDate.substring(6, 10);
                        if (key == projectKey)
                            projectName = issue.project;
                        return dateDone == date && key == projectKey;
                    }
                }).length;

                accumulatedIssuesCreated += issuesCreated;
                accumulatedIssuesCompleted += issuesCompleted;

                results.push({ date: dateBurnup, issuesCreated, issuesCompleted, accumulatedIssuesCreated, accumulatedIssuesCompleted, projectName });

            })
        }

        return results;

    }
};

