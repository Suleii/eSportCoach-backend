var express = require('express');
var router = express.Router();
const UserProfile= require('../models/usersProfile'); 
const UserLogin = require('../models/usersLogin');


 
 // GET gamer profile
 router.get('/profile/:gamer', (req, res) => {
    // Search the user ID via his username
    UserLogin.findOne({username: req.params.gamer}) 
    .then(user => { 
        // Search userProfile ID via his userLogin ID 
        UserProfile.findOne({user: user._id}).populate('user') 
        .then (gamer =>{
        console.log(gamer)
        res.json({result:true, profile: gamer})
        })
    }) 
  })
  
  module.exports = router;