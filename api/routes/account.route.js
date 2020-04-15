var express = require('express');
var router = express.Router();
const Account = require('../models/account');


/* GET users listing. */
router.get('/', async (req, res, next) => {
    const accounts = await Account.find();
    res.header('Access-Control-Expose-Headers', 'Content-Range');
    res.setHeader('X-Total-Count', accounts.length);
    res.setHeader('Content-Range', 'accounts 0-5/5');
    res.send(accounts);
});

/* POST para registrar una petición de cuenta*/
router.post('/', async (req, res, next) => {
    const { email, description, date} = req.body;
    const account = new Account({email, description, date});
    await account.save();
    res.json(account)
});

module.exports = router;