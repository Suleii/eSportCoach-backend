const mongoose = require('mongoose');

const tokenSchema = mongoose.Schema({
    creation: {type: Date, default: Date.now, expires: 3600,},
    userId: {type:mongoose.Schema.Types.ObjectId, ref: 'userslogins'},
    token: String,
});

const Token = mongoose.model('Token', tokenSchema);

module.exports = Token;