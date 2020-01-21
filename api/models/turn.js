const mongoose = require('mongoose');
const { Schema } = mongoose;

const TurnSchema = new Schema({
    name: { type: String, required: true, unique: true},
    start: { 
        start: {type: String, required: true},
        end : { type: String, required: true}
    },
    end: { 
        start: {type: String, required: true},
        end : { type: String, required: true}
    }   
});

module.exports = mongoose.model('turn', TurnSchema);