// backend/src/server.js
const app = require('./app');
const sequelize = require('./config/database');

const PORT = process.env.PORT || 3000;

sequelize.authenticate()
  .then(() => {
    console.log('Conectado ao banco');
    app.listen(PORT, () => {
      console.log(`API rodando na porta ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Erro ao conectar ao banco:', err);
  });
