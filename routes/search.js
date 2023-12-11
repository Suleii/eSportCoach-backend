var express = require('express');
var router = express.Router();

const CoachProfile = require("../models/coachesProfile")
const UserLogin = require('../models/usersLogin')

// GET route for search by username or game

router.get('/globalSearch', (req, res) => {
    const searchString = req.query.search;
    let searchQuery = new RegExp(searchString, 'i'); // Regex for insensitive case

    UserLogin.findOne({ username: { $regex: searchQuery } }) // Regex for flexible match
    .then(user => {
        console.log("user found", user)
        if (user) {
            // If user found, search coach profile
            CoachProfile.findOne({ user: user._id })
            .populate('usersLogin')
            .then(coach => {
                console.log("coach found", coach)
                if (coach) {
                    res.json({ result: true, coachData: coach });
                } else {
                    res.json({ result: false, message: "Coach not found" });
                }
            });
        } else {
            // If no user found, search by game
            CoachProfile.find({ games: { $regex: searchQuery } })
            .then(games => {
                console.log("game found", games)
                if (games.length > 0) {
                    res.json({ result: true, gameData: games });
                } else {
                    res.json({ result: false, message: "Coach or Game not found" });
                }
            });
        }
    })
    .catch(err => {
        res.status(500).json({ message: err.message });
    });
});


router.get("/getname/:username", (req, res) => {
    UserLogin.findOne({username : req.params.username})
    .then(user => {
        console.log(user)
        if(user){
            res.json({result : true, })
        }
        else {
            res.json({result: false})
        }

    })
})

module.exports = router;