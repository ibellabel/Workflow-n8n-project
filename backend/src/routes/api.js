const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile.controller');
const jobController = require('../controllers/job.controller');

// n8n Webhook consumirá este endpoint (Flujo 1 de Onboarding Inteligente)
router.post('/score-profile', profileController.scoreProfile);

// n8n Event consumirá este endpoint (Flujo 2 de Match proactivo)
router.post('/match-jobs', jobController.matchJobs);

// --- Nuevos Endpoints (Fase 2) ---

// HU15: Obtener resumen del Top 5 de matches para un candidato
router.get('/top-matches', profileController.getTopMatches);

// HU18: Obtener estadísticas de aplicación de un candidato
router.get('/stats', profileController.getStats);

// HU16: Obtener el ranking de candidatos de una empresa por vacante
router.get('/empresa/ranking/:job_id', jobController.getJobRanking);

// Endpoint de confirmación (Health check)
router.get('/health', (req, res) => res.json({ status: '✅ API de Magneto V2 en funcionamiento bajo Clean Architecture' }));

module.exports = router;
