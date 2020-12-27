const express = require('express');
const router = express.Router();
const DashboardController = require('../controller/dashboard.controller');

router.get('/', DashboardController);

module.exports = router;
