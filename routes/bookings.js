var express = require('express');
var router = express.Router();

const Booking = require('../models/bookings')

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

router.get('/:coach', (req, res) => {
  UserLogin.findOne({username: req.params.coach}) 
  .then(user => {
      Booking.find({coachUsername:user._id}).populate('username').populate('coachUsername')
      .then(data => {
          if(!data){
              res.json({bookings : []})
          }else{
              res.json({bookings : data})
          }
      })
  })
})

module.exports = router;