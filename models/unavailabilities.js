const mongoose = require('mongoose');

const unavailabilitySchema = mongoose.Schema({
    game: String,
    username: {type:mongoose.Schema.Types.ObjectId, ref: 'usersProfile'},
    coachUsername: {type:mongoose.Schema.Types.ObjectId, ref: 'coachProfile'},
    startDate: Date,
    endDate: Date,
});

const Unavailability = mongoose.model('unavailabilities', unavailabilitySchema);

module.exports = Unavailability;