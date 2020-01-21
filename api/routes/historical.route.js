var express = require('express');
var router = express.Router();
const Historical = require('../models/historical');


/* GET historical listing. */
router.get('/', async (req, res, next) => {
    const historicals = await Historical.find();
    console.log(historicals);
    res.json(historicals);
});

/* POST para registrar un inicio/fin de jornada*/
router.post('/', async (req, res, next) => {

    //TODO chequear si ya se iniciado el fin/inicio de la jornada, para no dejar registrar 2 veces
    const { isInit,  user} = req.body;
    const historical = new Historical({isInit, user});
    await historical.save();
    console.log(historical);
    res.json(historical);
});

module.exports = router;