const express = require('express');
const router = express.Router();
const jobController = require('./job.controller');

// Obtener el ranking de candidatos de una empresa por vacante
router.get('/empresa/ranking/:job_id', jobController.getJobRanking);

// Obtener las vacantes de una empresa
router.get('/empresa/:company_id/jobs', jobController.getCompanyJobs);

module.exports = router;
