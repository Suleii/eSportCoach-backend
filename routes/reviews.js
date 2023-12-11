var express = require('express');
var router = express.Router();

const Review = require('../models/reviews');
const UserLogin = require('../models/usersLogin');
const CoachProfile = require("../models/coachesProfile") 


// //GET /reviews/:coach : récupération de toutes les reviews d’un coach en fonction du username du coach (via req.params)
router.get('/:coach', (req, res) => {
    UserLogin.findOne({username: req.params.coach}) //cherche l'id du user via le username
    .then(user => {
       
        CoachProfile.findOne({user:user._id}).populate('user') //cherche l'id du coach via son user id 
        .then (coach =>{
           
            Review.find({coach:coach._id}).populate('coach') //cherche les reviews du coach via son coach id
            .then(data =>{
                if(data.length>0){    
                    res.json({result:true, reviews: data})
                } else {
                    res.json({result:false, reviews: "No review for this coach yet"})
                }
            })   
        })
        
        })
    })
 

  module.exports = router



// Coach rating update
router.get('/coachRating/:username', (req, res) => {

        // Find user by username
        const user =  UserLogin.findOne({ username: req.params.username });
        if (!user) {
            return res.json({ message: "User not found" });
        }

        // Match coach profil according to username
        const coach =  CoachProfile.findOne({ user: user._id });
        if (!coach) {
            return res.json({ message: "Coach not found" });
        }

        // Rating average
        const reviews =  Review.find({ username: user._id });
        if (reviews.length === 0) {
            return res.json({ rating: "No ratings yet" });
        }

        const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

        // Update rating on coachProfile
        coach.rating = averageRating;
         coach.save();

        res.json({ averageRating });

});
