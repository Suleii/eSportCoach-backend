const mongoose = require('mongoose');

const unavailabilitySchema = mongoose.Schema({
    date: Date,
    username: String,
    coach: String,
    game: String,
});

const Unavailability = mongoose.model('unavailabilities', unavailabilitySchema);

module.exports = Unavailability;