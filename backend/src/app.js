const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

// Enrutadores de Módulos (Serán implementados paso a paso)
const authRoutes = require('./modules/auth/auth.routes');
const profileRoutes = require('./modules/profile/profile.routes');
const jobRoutes = require('./modules/job/job.routes');
const matchRoutes = require('./modules/match/match.routes');

const app = express();

// Middleware y Seguridad
app.use(cors());
app.use(bodyParser.json());

// Main Root Path Route V1
// La distribución a los distintos routers de negocio ocurre aquí
app.use('/api', authRoutes);
app.use('/api', profileRoutes);
app.use('/api', jobRoutes);
app.use('/api', matchRoutes);

// Endpoint de confirmación (Health check)
app.get('/api/health', (req, res) => {
    res.json({ status: '✅ API de Magneto V2 refactorizada (Arquitectura Modular MCSR) en funcionamiento' });
});

// Fallback genérico para 404
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint no encontrado. Revisa la ruta.' });
});

module.exports = app;
