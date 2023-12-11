var express = require('express');
var router = express.Router();

const Review = require('../models/reviews');
const UserLogin = require('../models/usersLogin');

// //GET /reviews/:coach : récupération de toutes les reviews d’un coach en fonction du username du coach (via req.params)
router.get('/:coach', (req, res) => {
    UserLogin.findOne({username: req.params.coach})
    .then(user => {
        Review.find({coach:user.id}).populate('coach')
            .then(data =>{
                if(data){
                    res.json({result:true, reviews: data})
                } else {
                    res.json({result:false, reviews: "No review for this coach yet"})
                }
            })
        })
    })
 

  module.exports = router;