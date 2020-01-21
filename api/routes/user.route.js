var express = require('express');
var router = express.Router();
const User = require('../models/user');


/* GET users listing. */
router.get('/', async (req, res, next) => {
    const users = await User.find();
    console.log(users);
    res.json(users);
});

/* POST para registrar una usuario*/
router.post('/', async (req, res, next) => {
    const { mail, name, surnames, dni, isAdmin, phone, office, turn} = req.body;
    const user = new User({mail, name, surnames, dni, isAdmin, phone, office, turn});
    await user.save();
    console.log(user);
    res.json(user)
});

module.exports = router;