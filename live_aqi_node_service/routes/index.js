const express = require('express');
const { sayHello, sayHiAmey, getRedisData } = require('../controllers/miscController');

const router = express.Router();

router.get('/', sayHello);
router.get('/hiamey', sayHiAmey);
router.get('/redis-data', getRedisData);

module.exports = router;
