var express = require('express');
var router = express.Router();
const Office = require('../models/office');


/* GET office listing. */
router.get('/', async (req, res, next) => {
    const offices = await Office.find();
    console.log(offices);
    res.json(offices);
});

/* POST para registrar una oficina*/
router.post('/', async (req, res, next) => {
    const { name, city, address, coordinates } = req.body;
    const office = new Office({name, city, address, coordinates});
    await office.save();
    console.log(office);
});
module.exports = router;