const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');

// Login de usuario (Candidato/Empresa/Admin)
router.post('/auth/login', authController.login);

module.exports = router;
