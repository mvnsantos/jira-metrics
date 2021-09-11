# O que é o Jira Metrics?
É uma aplicação que extrair dados dos projetos do Jira e armazena no Google spreadsheet para poder montar visões em cima desses dados. Basicamente a aplicação bate numa API do Jira coletando informações sobre as issues e armazena em um Google Spreadsheet configurado.

# Motivação
As visualizações padrões do Jira são um pouco ruins quando pensamos em métricas de fluxo. Existem muitas opções hoje no marketplace que dão visões muito interessantes como o Actionable agile mas grande parte delas são pagas. Por isso, decidi criar uma aplicação que gerasse esses dados e com esses dados montasse gráficos em qualquer ferramenta de visão de dados como o Data Studio. Tudo isso de forma gratuita.

# Exemplos de visões criadas a partir disso

![image](https://user-images.githubusercontent.com/8289330/132953078-49bf200e-8d43-42e0-836e-a424834a9fe5.png)

![image](https://user-images.githubusercontent.com/8289330/132953260-734331ab-008c-4cb2-a93a-2180cb07eaf4.png)

![image](https://user-images.githubusercontent.com/8289330/132953291-e47276ea-c439-4ec3-8255-564bc3ff762c.png)

![image](https://user-images.githubusercontent.com/8289330/132953365-f6d70893-24a0-434e-b9c8-f71ba99d75a6.png)

![image](https://user-images.githubusercontent.com/8289330/132953639-e9cde7b5-a061-4a1f-b40f-2d9ea37f1b89.png)

# Plotagem de dados
Caso queira dar uma olhada no que podemos fazer com os dados você pode encontrar nesse link aqui: https://datastudio.google.com/reporting/fc1fa7f0-01b6-4c8c-951b-7bd10de73623

# Passo a passo para rodar o Jira Metrics

1. Rode na linha de comando o npm i
2. Crie um spreadsheet novo na sua conta para armazenar suas métricas
3. Gere as credentials no google para poder gerar o spreadsheet. https://console.cloud.google.com/apis/credentials para mais detalhes acesse a documentação do componente NPM https://www.npmjs.com/package/google-spreadsheet
4. Substituir os valores no arquivo de configuração do google
5. Gerar uma KEY para o seu usuário no Jira https://id.atlassian.com/manage-profile/security/api-tokens
6. Substitua os valores no arquivo de configuração config.json no campo jira-credentials-token com as keys que pegou
7. Substitua os valores no arquivo de configuração config.json no campo jira-projects para os códigos dos seus projetos
8. Npm start e sucesso
