const express = require('express');
const router = express.Router();
const matchController = require('./match.controller');

// n8n Event consumirá este endpoint (Flujo 2 de Match proactivo)
router.post('/match-jobs', matchController.matchJobs);

// HU15: Obtener resumen del Top 5 de matches para un candidato
router.get('/top-matches', matchController.getTopMatches);

// HU18: Obtener estadísticas de aplicación de un candidato
router.get('/stats', matchController.getStats);

// Postulaciones reales de un candidato
router.get('/candidate-applications', matchController.getCandidateApplications);

// Feed de Empleos Aspiracionales (Retos de Crecimiento Profesional)
router.get('/aspirational-matches', matchController.getAspirationalMatches);

module.exports = router;
