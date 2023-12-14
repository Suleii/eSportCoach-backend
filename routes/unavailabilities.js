var express = require('express');
var router = express.Router();

const Unavailability = require('../models/unavailabilities')

router.post('/', (req, res) => {
  const newUnavailability = new Unavailability ({
    game: req.body.game,
    username: req.body.username,
    coachUsername: req.body.coachUsername,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
  })
  newUnavailability.save()
  .then(data => {
    res.json(data)
  })
});

router.delete('/', (req, res) => {
    Unavailability.deleteOne( 
      {game: req.body.game, 
      username: req.body.username,
      coachUsername: req.body.coachUsername,
      startDate: req.body.startDate,
      endDate: req.body.endDate})
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