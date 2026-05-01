const express = require('express');
const router = express.Router();
const jobController = require('./job.controller');

// Obtener el ranking de candidatos de una empresa por vacante
router.get('/empresa/ranking/:job_id', jobController.getJobRanking);

// Dashboard integral de una empresa
router.get('/empresa/:company_id/dashboard', jobController.getCompanyDashboard);

// Obtener las vacantes de una empresa
router.get('/empresa/:company_id/jobs', jobController.getCompanyJobs);

// Crear una oferta laboral de una empresa
router.post('/empresa/:company_id/jobs', jobController.createCompanyJob);

// Obtener postulantes de una vacante validando pertenencia a la empresa
router.get('/empresa/jobs/:job_id/applicants', jobController.getJobApplicants);

module.exports = router;
