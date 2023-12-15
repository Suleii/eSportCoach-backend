const mongoose = require('mongoose');

const coachProfileSchema = mongoose.Schema({
	lastname: String,
    firstname: String,
    email: String,
    photo: String,
    user: {type:mongoose.Schema.Types.ObjectId, ref: 'userslogins'},
    games: [String],
    price: Number,
    socials: {
        twitch: String,
        instagram: String,
        youtube: String,
        discord: String,        
            },
    about: String,
    experience: [String],
    rating: Number,
});

const CoachProfile = mongoose.model('coachesprofile', coachProfileSchema);

module.exports = CoachProfile;