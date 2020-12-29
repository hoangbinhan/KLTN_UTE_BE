const express = require('express');
const router = express.Router();
const DashboardController = require('../controller/dashboard.controller');

router.get('/get-chart', DashboardController.getNewFeedChart);
router.get('/get-gold-customer', DashboardController.getGoldCustomer);

module.exports = router;
