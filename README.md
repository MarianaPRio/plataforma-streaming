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
- Adicionação de qualquer vídeo pesquisado a uma das playlists existentes.

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

- Para busca de vídeos a aplicação usa a API do YouTube. Você deve criar uma credencial no Google Cloud Console e disponibilizar a chave via variável de ambiente.

## Instalação e Migrações

No terminal, a partir da raiz do projeto (onde está o `docker-compose.yml`):

1. Subir containers (PostgreSQL + API):

```bash
docker-compose up -d --build
```

2.  Acessar o container da API para rodar migrações do Prisma:

```bash
docker-compose exec api npx prisma migrate deploy
```

3. Para acessar a aplicação:
- Acesse `http://localhost:8080/login` faça login/registre-se.

## Testes

Para rodar os testes automatizados com cobertura é necessário que os containers Docker estejam em execução. Isso garante que o banco de dados e a API estejam disponíveis.

## Back-end 
- Com Docker: 

```bash
docker-compose exec api npm test
```

## Front-end 
- Com Docker: 

```bash
docker-compose exec web npm test
```