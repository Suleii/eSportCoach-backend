var express = require('express');
var router = express.Router();

const Booking = require('../models/bookings')
const UserLogin = require('../models/usersLogin')
const CoachProfile = require('../models/coachesProfile')



router.post('/', (req, res) => {
  const newBooking = new Booking ({
    game: req.body.game,
    username: req.body.username,
    coachUsername: req.body.coachUsername,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
  })
  newBooking.save()
  .then(data => {
    res.json(data)
  })
});

router.delete('/', (req, res) => {
Booking.deleteOne( 
  {game: req.body.game, 
  username: req.body.username,
  coachUsername: req.body.coachUsername,
  startDate: req.body.startDate,
  endDate: req.body.endDate})
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