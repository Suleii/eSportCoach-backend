const mongoose = require('mongoose');

const userLoginSchema = mongoose.Schema({
	username: String,
    password: String,
    token: String,
    isCoach: Boolean,
    
});

const UserLogin = mongoose.model('userslogins', userLoginSchema);

module.exports = UserLogin;