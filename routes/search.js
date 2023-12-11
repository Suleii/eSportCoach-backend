var express = require('express');
var router = express.Router();

const CoachProfile = require("../models/coachesProfile")
const UserLogin = require('../models/usersLogin')

// GET route for search by username or game

router.get('/globalSearch', (req, res) => {
    const searchString = req.query.search;
    const minPrice = req.query.minPrice ? parseInt(req.query.minPrice) : null; 
    const maxPrice = req.query.maxPrice ? parseInt(req.query.maxPrice) : null;
    const minRating = req.query.minRating ? parseFloat(req.query.minRating) : null;
    const maxRating = req.query.maxRating ? parseFloat(req.query.maxRating) : 5; // Maximum rating

    let searchQuery = new RegExp(searchString, 'i'); // Regex for insensitive case


    // Filter by price according to session type
    let priceFilter = {};
    if (minPrice !== null && maxPrice !== null) {
        priceFilter = {
            $or: [
                { 'price.oneSession': { $gte: minPrice, $lte: maxPrice } },
                { 'price.tenSessions': { $gte: minPrice, $lte: maxPrice } },
                { 'price.oneGroupSession': { $gte: minPrice, $lte: maxPrice } },
                { 'price.tenGroupSessions': { $gte: minPrice, $lte: maxPrice } }
            ]
        };
    }

    // Filter by rating
    let ratingFilter = { rating: { $gte: minRating, $lte: maxRating } };

    // Make the research of user according to username
    UserLogin.findOne({ username: { $regex: searchQuery } }) // Regex for flexible match
    .then(user => {
        if (user) {
            // If user found, search coach profile according to price or rating if criteria given
            CoachProfile.findOne({ user: user._id, ...priceFilter, ...ratingFilter}) // Spread operator to avoid if...else by creating a new array 
            .populate('user')
            .then(coach => {
                if (coach) {
                    res.json({ result: true, coachData: coach });
                } else {
                    res.json({ result: false, message: "Coach not found" });
                }
            });
        } else {
            // If no user found, search by game according to price or rating if criteria given
            CoachProfile.find({ games: { $regex: searchQuery }, ...priceFilter, ...ratingFilter }) // Spread operator to avoid if...else by creating a new array
            .then(coaches => {
                if (coaches.length > 0) {
                    res.json({ result: true, gameData: coaches });
                } else {
                    res.json({ result: false, message: "No coaches or games found matching criteria" });
                }
            });
        }
    })
});



module.exports = router;