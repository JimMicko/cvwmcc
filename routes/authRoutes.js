// routes/authRoutes.js

const express = require('express');
const { getLoginController, postLoginController } = require('../controller/authController');
const router = express.Router();

// Display the login form
router.get('/login', getLoginController);

// Handle login form submission
router.post('/login', postLoginController);


module.exports = router;
