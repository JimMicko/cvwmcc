// routes/homeRoutes.js

const express = require('express');
const { loginController, homeController, logoutController } = require('../controller/homeController');
const router = express.Router();

router.get('/', loginController);
router.get('/home', homeController);
router.get('/logout', logoutController);


module.exports = router;
