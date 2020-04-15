const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AccountSchema = new Schema({
    email: { type: String, required: true, unique: true},
    description: { type: String, required: true},
    date: {type: Date, default: Date.now},
});

module.exports = mongoose.model('Account', AccountSchema);