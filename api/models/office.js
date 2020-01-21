const mongoose = require('mongoose');
const { Schema } = mongoose;

const OfficeSchema = new Schema({
    name: { type: String, required: true, unique: true},
    city: { type: String, required: true},
    address: { type: String, required: true},
    coordinates: { type: String, required: true}
});

module.exports = mongoose.model('Office', OfficeSchema);