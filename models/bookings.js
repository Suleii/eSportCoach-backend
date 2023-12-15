const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema({
    date: Date,
    username: {type:mongoose.Schema.Types.ObjectId, ref: 'usersprofile'},
    coach: {type:mongoose.Schema.Types.ObjectId, ref: 'coachesprofile'},
    game: String,
});

const Booking = mongoose.model('bookings', bookingSchema);

module.exports = Booking;