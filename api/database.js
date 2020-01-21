const mongoose = require('mongoose');

const URI = 'mongodb://localhost/registrationDB';

mongoose.connect(URI, {useUnifiedTopology: true, useNewUrlParser: true})
    .then(db => console.log('DB is connected'))
    .catch(err => console.error(err));

module.exports = mongoose;    