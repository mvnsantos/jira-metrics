# O que é o jira-metrics?
É uma aplicação que extrai dados dos projetos no Jira, transforma e armazena no Google spreadsheet para que seja fácil de montar gráficos e relatórios do time.

# Motivação
As visualizações padrão do Jira são um pouco ruins quando pensamos em métricas de fluxo. Existem opções no marketplace que dão visões muito interessantes, como o Actionable agile, mas grande parte delas são pagas. Por isso, decidi criar uma aplicação que extrai e transforma os dados do Jira para que seja possível a montagem de relatórios e gráficos de forma gratuita.

# Exemplos de visões criadas a partir disso

![image](https://user-images.githubusercontent.com/8289330/132953078-49bf200e-8d43-42e0-836e-a424834a9fe5.png)

![image](https://user-images.githubusercontent.com/8289330/132953260-734331ab-008c-4cb2-a93a-2180cb07eaf4.png)

![image](https://user-images.githubusercontent.com/8289330/132953291-e47276ea-c439-4ec3-8255-564bc3ff762c.png)

![image](https://user-images.githubusercontent.com/8289330/132953365-f6d70893-24a0-434e-b9c8-f71ba99d75a6.png)

![image](https://user-images.githubusercontent.com/8289330/132953639-e9cde7b5-a061-4a1f-b40f-2d9ea37f1b89.png)

> Para mais detalhes acesse: https://datastudio.google.com/reporting/fc1fa7f0-01b6-4c8c-951b-7bd10de73623

# Passo a passo para rodar o Jira Metrics

1. Git clone do repo kkkkkkkkkk
2. Instale os módulos rodando o npm i
3. Vá até sua conta no Google e crie um novo spreadsheet, pois utilizaremos para armazenar os dados no Jira
4. No projeto abra o arquivo credentials-google.json na pasta /src/config e substitua o valor do campo sheetId pelo o que está na url da sua planilha que acabou de criar. Exemplo da imagem abaixo:
![image](https://user-images.githubusercontent.com/8289330/132967656-3cc02421-65e7-447a-bb86-c210e63bda43.png)

6. Agora vamos gerar as credentials no Google para poder alimentar o spreadsheet. https://console.cloud.google.com/apis/credentials 
![image](https://user-images.githubusercontent.com/8289330/132967453-8f6b432f-32a6-4667-85af-8de76d4231d5.png)
É só clicar no manage service accounts e depois no create service accounts e ir colocando as informações do seu serviço.

7. Agora precisamos gerar as keys, entra na edição desse serviço que acabou de criar e procurar por uma aba chamada de keys. Clica nela e depois add keys >create new keys >Json >Create. Feito isso você vai receber um arquivo JSON e ai é só copiar os valores desse JSON e substituir os XXX no arquivo de config do projeto credentials-google.json 
![image](https://user-images.githubusercontent.com/8289330/132967505-7bef38fc-80f4-4fd4-b43a-8c0aed08410f.png)
![image](https://user-images.githubusercontent.com/8289330/132967529-7631ff91-4de0-4966-b425-3d03d38b9cc7.png)

8. Por fim agora é pegar o email que foi gerado e dar um share como editor na planilha que criou
![image](https://user-images.githubusercontent.com/8289330/132967925-ebd3325a-a9ba-412b-81c0-79120f391cbb.png)
![image](https://user-images.githubusercontent.com/8289330/132967955-20bc6c2c-a506-4c71-914a-cd132cea38e4.png)

8. Se precisar de mais detalhes acesse a documentação do componente NPM https://www.npmjs.com/package/google-spreadsheet

9. Agora bora gerar a permissão para o seu usuário no Jira https://id.atlassian.com/manage-profile/security/api-tokens e para isso vamos gerar umas chaves.
10. Depois de gerar as keys é só substituir as chaves no arquivo config.json na pasta /src/config. Procure pelo campo jira-credentials-token e coloque primeiro o seu login de rede, depois : e por fim a key gerada. Ex: marcus.santos@google.com:OXxsasZALmXb473LlxcnOsA870
11. Nesse mesmo arquivo você pode adicionar quantos projetos quiser. É só ir incrementando o array jira-projects com os project key do Jira.
12. Por fim coloque também o dominio do seu Jira. ex: meudominio.atlassian.net
13. Npm start e sucesso
