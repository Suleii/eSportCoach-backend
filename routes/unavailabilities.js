var express = require('express');
var router = express.Router();

const Unavailability = require('../models/unavailabilities')

router.post('/', (req, res) => {
  const newUnavailability = new Unavailability ({
    date: req.body.date,
    coach: req.body.coach,
    game: req.body.game,
    username: req.body.username,
  })
  newUnavailability.save()
  .then(data => {
    res.json(data)
  })
});

router.delete('/', (req, res) => {
    Unavailability.deleteOne( 
      { date: Date,
        username: String,
        coach: String,
        game: String,})
      .then(data => {
        if (!data) {
          res.json({result: false, message: 'no unavailability found'})
        } else {
          res.json({result: true, message:'Unavailability succesfully deleted'})
        }
      })  
    })

router.get('/:coach', (req, res) => {
    UserLogin.findOne({username: req.params.coach}) 
    .then(user => {
        Unavailability.find({coachUsername:user._id}).populate('username').populate('coachUsername')
        .then(data => {
            if(!data){
                res.json({unavailabilities : []})
            }else{
                res.json({unavailabilities : data})
            }
        })
    })
})
    
module.exports = router;