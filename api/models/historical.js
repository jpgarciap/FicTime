const mongoose = require('mongoose');
const { Schema } = mongoose;

const HistoricalSchema = new Schema({
    date : { type: Date, required: true, default: Date.now},
    isInit: { type: Boolean, required: true },
    user: {type: mongoose.Schema.ObjectId, ref: "User" }
});

module.exports = mongoose.model('historical', HistoricalSchema);