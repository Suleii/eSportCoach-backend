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
 

  module.exports = router;