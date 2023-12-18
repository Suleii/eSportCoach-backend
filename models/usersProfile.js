const mongoose = require('mongoose');

const userProfileSchema = mongoose.Schema({
	lastname: String,
    firstname: String,
    email: String,
    photo: String,
    user: {type:mongoose.Schema.Types.ObjectId, ref: 'userslogins'},
    
});

const UserProfile = mongoose.model('usersprofile', userProfileSchema);

module.exports = UserProfile; 