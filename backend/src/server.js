const app = require('./app');
const prisma = require('./prismaClient'); 

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await prisma.$connect();
    console.log('Conectado');

    app.listen(PORT, () => {
      console.log(`API rodando na porta ${PORT}`);
    });
  } catch (err) {
    console.error('Erro ao inicializar ', err);
  }
})();
