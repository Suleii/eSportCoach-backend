const mongoose = require('mongoose');

const unavailabilitySchema = mongoose.Schema({
    date: Date,
    username: {type:mongoose.Schema.Types.ObjectId, ref: 'usersprofile'},
    coachUsername: {type:mongoose.Schema.Types.ObjectId, ref: 'coachesprofile'},
    game: String,
});

const Unavailability = mongoose.model('unavailabilities', unavailabilitySchema);

module.exports = Unavailability;