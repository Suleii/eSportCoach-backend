var express = require('express');
var router = express.Router();

const Booking = require('../models/bookings')
const UserLogin = require('../models/usersLogin')
const CoachProfile = require('../models/coachesProfile')
const UserProfile = require('../models/usersProfile')

//Create a new booking 
router.post('/', (req, res) => {
  UserLogin.findOne({username: req.body.username})
  .then(user => {
    UserProfile.findOne({user:user._id})
    .then(userProfile=>{
      const newBooking = new Booking ({
      date: req.body.date,
      coachUsername: req.body.coachUsername,
      game: req.body.game,
      username: userProfile._id,
  })
  newBooking.save()
  .then(data => {
    res.json(data)
  })
    })
  })
  
});

// Delete a booking using the coach username, gamer username, date and name of game
router.delete('/', (req, res) => {
  Booking.deleteOne( 
            { _id:req.body._id,})
            .then((data) => {
              if (data.deletedCount ===0) {
                res.json({result: false, message: 'no booking found'})
              } else {
                res.json({result: true, message:'booking succesfully deleted'})
              }
            })  
          })
      

// Get all the bookings of a coach with his token 
router.get('/:token', (req, res) => {
  UserLogin.findOne({token: req.params.token}) 
  .then(user => {
    CoachProfile.findOne({user:user._id})
    .then(user => {
      Booking.find({coachUsername:user._id}).populate({path:'username', populate:{path:'user'}}).populate('coachUsername')
      .then(data => {
        console.log(data)
          if(!data){
              res.json({result: false , bookings : data})
          }else{ 
              res.json({result: true, bookings : data})
          }
    })
      
      })
  })
})

//Get all the bookings of a gamer with his token
router.get('/gamer/:token', (req, res) => {
  UserLogin.findOne({token: req.params.token}) 
  .then(user => {
    UserProfile.findOne({user:user._id})
    .then(user => {
      Booking.find({username:user._id}).populate({path:'coachUsername', populate:{path:'user'}}).populate('username')
      .then(data => {
        console.log(data)
          if(!data){
              res.json({result: false , bookings : "pas de bookings"})
          }else{ 
              res.json({result: true, bookings : data})
          }
    })
      
      })
  })
})

module.exports = router;