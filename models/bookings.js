const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema({
    game: String,
    username: {type:mongoose.Schema.Types.ObjectId, ref: 'usersProfile'},
    coachUsername: {type:mongoose.Schema.Types.ObjectId, ref: 'coachProfile'},
    startDate: Date,
    endDate: Date,
});

const Booking = mongoose.model('bookings', bookingSchema);

module.exports = Booking;