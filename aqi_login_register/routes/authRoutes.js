const express = require('express');
const router = express.Router();
const authcontroller = require('../controllers/authController');
const {protect} = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/rolebaseMiddleware');

router.post('/register', authcontroller.register);
router.get('/verify/:token', authcontroller.verifyEmail);
router.post('/login', authcontroller.login);

router.get('/superadmin',protect,authorizeRoles('SuperAdmin'), (req,res)=>{
    res.json({message:"Welcome SuperAdmin!"});
});
router.get('/admin',protect,authorizeRoles('Admin','SuperAdmin'), authcontroller.adminRoute);
router.get('/customer',protect,authorizeRoles('Customer','Admin','SuperAdmin'), (req,res)=>{
    res.json({message:"Welcome Customer!"});
});

module.exports = router;
