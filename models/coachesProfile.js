const mongoose = require('mongoose');

const coachProfileSchema = mongoose.Schema({
	lastname: String,
    firstname: String,
    email: String,
    photo: String,
    user: {type:mongoose.Schema.Types.ObjectId, ref: 'userslogins'},
    games: [String],
    // price: {
        
    // }
    bookings: [{type:mongoose.Schema.Types.ObjectId, ref: 'bookings'}],
    socials: {
        twitch: String,
        instagram: String,
        youtube: String,
        discord: String,        
            },
    about: String,
    reviews: [{type:mongoose.Schema.Types.ObjectId, ref: 'reviews'}],
});

const CoachProfile = mongoose.model('coachesProfile', coachProfileSchema);

module.exports = CoachProfile;