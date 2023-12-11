const mongoose = require('mongoose');

const userLoginSchema = mongoose.Schema({
	username: String,
    password: String,
    token: String,
    // canBook: Boolean,
    // canEdit: Boolean,
    isCoach: Boolean,
    
});

const UserLogin = mongoose.model('usersLogin', userLoginSchema);

module.exports = UserLogin;