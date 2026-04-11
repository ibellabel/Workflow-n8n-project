// Servidor MVP Profile Manager - Arquitectura Limpia/Modular

require('dotenv').config();

const app = require('./src/app');
const PORT = process.env.PORT || 3001;

// Iniciando Listeners
const server = app.listen(PORT, () => {
    console.log(`🚀 Main Backend de Magneto arrancado en local: http://localhost:${PORT}`);
    console.log(`⚡ Esperando peticiones REST en JSON...`);
});

// Control proactivo de caídas para liberar el puerto
process.on('SIGTERM', () => {
    console.log('Cerrando servidor graceful...');
    server.close(() => {
        console.log('Servidor apagado.');
        process.exit(0);
    });
});
