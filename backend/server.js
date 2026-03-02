// Servidor MVP Profile Manager - Arquitectura Limpia

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const apiRoutes = require('./src/routes/api');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware y Seguridad
app.use(cors());
app.use(bodyParser.json());

// Router V1 (Delegado totalmente en la capa de rutas)
app.use('/api', apiRoutes);

// Fallback genérico para 404
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint Mocks/API no encontrado. Revisa la ruta.' });
});

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
