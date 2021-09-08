# Passo a passo para rodar o Jira-metrics

1. Rode na linha de comando o npm i
2. Crie um spreadsheet novo na sua conta para armazenar suas métricas
3. Gere as credentials no google para poder gerar o spreadsheet. https://console.cloud.google.com/apis/credentials para mais detalhes acesse a documentação do componente NPM https://www.npmjs.com/package/google-spreadsheet
4. Substituir os valores no arquivo de configuração do google
5. Gerar uma KEY para o seu usuário no Jira https://id.atlassian.com/manage-profile/security/api-tokens
6. Substitua os valores no arquivo de configuração config.json no campo jira-credentials-token com as keys que pegou
7. Substitua os valores no arquivo de configuração config.json no campo jira-projects para os códigos dos seus projetos
8. Npm start e sucesso
