const express = require('express');
const router = express.Router();
const authController = require('../Controllers/auth-controller');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/user', authController.getUser); // Add this line for getting user details

module.exports = router;