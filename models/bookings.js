const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema({
    game: String,
    username: {type:mongoose.Schema.Types.ObjectId, ref: 'usersprofile'},
    coachUsername: {type:mongoose.Schema.Types.ObjectId, ref: 'coachesprofile'},
    date: Date, 
});

const Booking = mongoose.model('bookings', bookingSchema);

module.exports = Booking;