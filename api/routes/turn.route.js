var express = require('express');
var router = express.Router();
const Turn = require('../models/turn');


/* GET turn listing. */
router.get('/', async (req, res, next) => {
    const turns = await Turn.find();
    console.log(turns);
    res.json(turns);
});

/* POST para registrar un turno*/
router.post('/', async (req, res, next) => {
    const { name, start, end } = req.body;
    const turn = new Turn({name, start, end});
    await turn.save();
    console.log(turn);
    res.json(turn);
});

module.exports = router;