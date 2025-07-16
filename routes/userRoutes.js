const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
router.post('/users', userController.registerUser);
router.get('/users',userController.getUserProfile)
router.post('/login', userController.loginUser);


module.exports = router;
