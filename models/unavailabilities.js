const mongoose = require('mongoose');

const unavailabilitySchema = mongoose.Schema({
    game: String,
    username: {type:mongoose.Schema.Types.ObjectId, ref: 'usersprofile'},
    coachUsername: {type:mongoose.Schema.Types.ObjectId, ref: 'coachesprofile'},
    startDate: Date,
    endDate: Date,
});

const Unavailability = mongoose.model('unavailabilities', unavailabilitySchema);

module.exports = Unavailability;