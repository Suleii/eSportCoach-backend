const mongoose = require('mongoose');

const userProfileSchema = mongoose.Schema({
	lastname: String,
    firstname: String,
    email: String,
    photo: String,
    user: {type:mongoose.Schema.Types.ObjectId, ref: 'userslogins'},
    coaches: [{type:mongoose.Schema.Types.ObjectId, ref: 'bookings'}],
    bookings: [{type:mongoose.Schema.Types.ObjectId, ref: 'bookings'}],
    reviews: [{type:mongoose.Schema.Types.ObjectId, ref: 'reviews'}],
});

const UserProfile = mongoose.model('usersprofiles', userProfileSchema);

module.exports = UserProfile;