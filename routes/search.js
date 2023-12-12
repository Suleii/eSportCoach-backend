var express = require('express');
var router = express.Router();

const CoachProfile = require("../models/coachesProfile")
const UserLogin = require('../models/usersLogin')

// GET route for search by username or game

router.get('/globalSearch', (req, res) => {
    const searchString = req.query.search;

    let searchQuery = new RegExp(searchString, 'i'); // Regex for insensitive case
    

    // Make the research of user according to username
    UserLogin.findOne({ username: { $regex: searchQuery } }) // Regex for flexible match
    .then(user => {
        if (user) {
            // If user found, search coach profile 
            CoachProfile.findOne({ user: user._id}) 
            .populate('user')
            .then(coach => {
                if (coach) {
                    res.json({ result: true, coachData: coach });
                } else {
                    res.json({ result: false, message: "Coach not found" });
                }
            });
        } else {
            // If no user found, search by game
            CoachProfile.find({ games: { $regex: searchQuery }}) 
            .populate('user')
            .then(coaches => {
                if (coaches.length > 0) {
                    res.json({ result: true, gameData: coaches});
                } else {
                    res.json({ result: false, message: "No coaches or games found " });
                }
            });
        }
    })
});



module.exports = router;