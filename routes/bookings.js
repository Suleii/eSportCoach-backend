var express = require('express');
var router = express.Router();

const Booking = require('../models/bookings')
const UserLogin = require('../models/usersLogin')
const CoachProfile = require('../models/coachesProfile')
const UserProfile = require('../models/usersProfile')


 // GET gamer connected data 
router.get('/profile/:gamer', (req, res) => {
  // Search the user ID via his username
  UserLogin.findOne({username: req.params.gamer}) 
  .then(user => { 
      // Search userProfile ID via his userLogin ID 
      UserProfile.findOne({user:user._id}).populate('user') 
      .then (gamer =>{
      console.log(gamer)
      res.json({result:true, profile: gamer, userId: user._id})
      })
  }) 
})


router.post('/', (req, res) => {
  const newBooking = new Booking ({
    date: req.body.date,
    coach: req.body.coach,
    game: req.body.game,
    username: req.body.username,
  })
  newBooking.save()
  .then(data => {
    res.json(data)
  })
});

router.delete('/', (req, res) => {
Booking.deleteOne( 
  { date: Date,
    username: String,
    coach: String,
    game: String,})
  .then(data => {
    if (!data) {
      res.json({result: false, message: 'no booking found'})
    } else {
      res.json({result: true, message:'booking succesfully deleted'})
    }
  })  
})

router.get('/:token', (req, res) => {
  UserLogin.findOne({token: req.params.token}) 
  .then(user => {
    CoachProfile.findOne({user:user._id})
    .then(user => {
      Booking.find({coachUsername:user._id}).populate('username').populate('coachUsername')
      .then(data => {
        console.log(data)
          if(!data){
              res.json({bookings : []})
          }else{ 
              res.json({bookings : data})
          }
    })
      
      })
  })
})

module.exports = router;