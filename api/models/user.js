const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    mail: { type: String, required: true, unique: true},
    name: { type: String, required: true},
    surnames: { type: String, required: true},
    dni: { type: String, required: true, unique: true},
    isAdmin: { type: Boolean, required: true, default: false},
    phone: { type: Number},
    date: {type: Date, default: Date.now},
    office: {type: Schema.ObjectId, ref: "Office"},
    turn: {type: Schema.ObjectId, ref: "Turn"}
});

module.exports = mongoose.model('User', UserSchema);