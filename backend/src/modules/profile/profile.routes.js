const express = require('express');
const router = express.Router();
const profileController = require('./profile.controller');
const multer = require('multer');

// Configuración básica de Multer para recibir archivos en memoria
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // Max 5MB
});

// Obtener perfil completo del candidato
router.get('/profile/:id', profileController.getProfile);

// Obtener todas las postulaciones de un candidato
router.get('/applications/:id', profileController.getApplications);

// Subida de CV desde el Frontend
router.post('/upload-cv', upload.single('cv'), profileController.uploadCV);

// n8n Webhook consumirá este endpoint (Flujo 1 de Onboarding Inteligente)
router.post('/score-profile', profileController.scoreProfile);

module.exports = router;
