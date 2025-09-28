const express = require('express');
const { addBusData, updateBusData, getBusData, getAllBuses } = require('../controllers/busController');

const router = express.Router();

router.post('/postdata', addBusData);
router.put('/update-data', updateBusData);
router.get('/:busid/all', getBusData);
router.get('/all-buses', getAllBuses);

module.exports = router;
