const express = require('express');
const router = express.Router();
const authcontroller = require('../controllers/authController');
const {protect} = require('../middleware/authMiddleware');

router.post('/register', authcontroller.register);
router.get('/verify/:token', authcontroller.verifyEmail);
router.post('/login', authcontroller.login);
router.get('/admin', protect, authcontroller.adminRoute);

module.exports = router;
