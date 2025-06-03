# YouList

YouList é uma aplicação de streaming de vídeos que permite aos usuários criar playlists personalizadas, adicionar vídeos do YouTube às suas playlists e reproduzir esses vídeos dentro da própria aplicação. É composta por dois módulos principais:

- **Backend**: API RESTful em Node.js/Express, utilizando Prisma como ORM e PostgreSQL como banco de dados.

- **Frontend**: React (Create React App), com Material-UI para componentes de interface e React Router para navegação.

> Containerizados via Docker Compose.

## Funcionalidades Principais

1. Autenticação de Usuário

- Cadastro e login protegidos por JWT.
- Rotas protegidas para criação, edição e remoção de playlists e vídeos.

2. Gestão de Playlists

- Criar, listar, visualizar, atualizar e deletar playlists.
- Cada playlist pertence a um usuário autenticado.
- Ao excluir uma playlist, todos os vínculos de vídeos relacionados também são removidos.

3. Gestão de Vídeos

- Busca de vídeos do YouTube (incluindo: título, thumbnail, etc.) pelo YouTubeService.
- Adicionação vídeos a playlists.
- Remoção vídeos de uma playlist e, caso o vídeo não pertença a nenhuma outra playlist, excluí ele do banco.
- Lista todos os vídeos de uma playlist, exibindo título e ID do YouTube.

4. Player de Vídeos

- Exibe o vídeo atual em um player incorporado do YouTube (iframe).
- Botão para remover o vídeo atual, avança automaticamente para o próximo da fila.
- Lista de “Próximos Vídeos” exibida abaixo, com possibilidade de seleção e exclusão individual.

5. Busca de Vídeos

- Pesquisa de vídeos do YouTube (via API) a partir do frontend.
- Exibição de resultados em cards com thumbnail e título.
- Adição de qualquer vídeo pesquisado a uma das playlists existentes.

## Tecnologias Utilizadas
- Backend
    - Node.js
    - Express
    - Prisma Client
    - PostgreSQL (via Docker)
    - JWT (jsonwebtoken) para autenticação
    - bcrypt para hash de senhas
    - dotenv para variáveis de ambiente
    - cors
    - nodemon (somente em dev)

- Frontend
    - React
    - Material-UI (MUI) para layout e componentes estilizados
    - React Router para navegação
    - Axios para chamadas da API
    - JavaScript / JSX / CSS-in-JS (via sx do MUI)

## Pré-requisitos    
1. Docker & Docker Compose

- Certifique-se de ter Docker e Docker Compose instalados, para subir o container do PostgreSQL.

2. Node.js e npm (ou yarn)

- Recomenda-se Node.js v18 LTS.
- npm ou yarn .

3. Chave de API do YouTube

- Para busca de vídeos a aplicação usa a API do YouTube. Você deve criar uma credencial no [Google Cloud Console](console.cloud.google.com/apis/credentials) e disponibilizar a chave via variável de ambiente.

## Instalação e Migrações

1. Configuração das variaveis de ambiente

- Crie uma cópia dos arquivos .env.example de ambos os módulos em suas respectivas pastas com o nome .env.,
- No arquivo .env localizado na pasta backend, preencha as levando em consideração as seguintes descrições:
    1. **DATABASE_URL**: preencha com a string de conexão utilizada no banco de dados. Por padrão, adota a string "postgres://postgres:postgres@db:5432/streaming";
    2. **JWT_SECRET**: preencha com o termo a ser utilizado com "segredo" para a geração de tokens JWT. Para fins de avaliação, é possível utilizar qualquer palavra como segredo para a geração dos mesmos;
    3. **YT_API_KEY**: preencha com uma chave de API do YouTube. Como mencionado anteriormente, se faz necessária a criação de uma credencial no Google Cloud Console e disponibilizar a chave via variável de ambiente;
- No arquivo .env localizado na pasta frontend, preencha as levando em consideração as seguintes descrições:
    1. **REACT_APP_API_URL**: preencha com o endereço para a API. Por padrão do sistema desenvolvido, utilize a URL "http://localhost:3000/".

2. Subir containers (PostgreSQL + API):

No terminal, a partir da raiz do projeto (onde está o `docker-compose.yml`):

```bash
docker-compose up -d --build
```

3.  Acessar o container da API para rodar migrações do Prisma:

```bash
docker-compose exec api npx prisma migrate dev --name init
```
> Em caso de erro na consulta ao banco de dados siga os comandos abaixo com os containers rodando:

```bash
docker-compose exec backend npx prisma migrate reset --force
docker-compose exec api npx prisma migrate dev --name init
```

4. Para acessar a aplicação:
- Acesse `http://localhost:8080` faça login/registre-se.

## Testes

Para rodar os testes automatizados com cobertura é necessário que os containers Docker estejam em execução. Isso garante que o banco de dados e a API estejam disponíveis.

### Back-end 
- Com Docker: 

```bash
docker-compose exec api npm test
```

### Front-end 
- Com Docker: 

```bash
docker-compose exec web npm test
```