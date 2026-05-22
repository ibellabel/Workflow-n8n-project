const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');

// Login de usuario (Candidato/Empresa/Admin)
router.post('/auth/login', authController.login);
router.post('/auth/register/candidate', authController.registerCandidate);
router.post('/auth/register/company', authController.registerCompany);
router.get('/auth/session/:userId', authController.getSessionProfile);

module.exports = router;
