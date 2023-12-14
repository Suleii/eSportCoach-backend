const mongoose = require('mongoose');

const userLoginSchema = mongoose.Schema({
	username: String,
    password: String,
    token: String,
    email: String,
    lastname: String,
    firstname: String,
    // canBook: Boolean,
    // canEdit: Boolean,
    isCoach: Boolean,
    
});

const UserLogin = mongoose.model('userslogins', userLoginSchema);

module.exports = UserLogin;