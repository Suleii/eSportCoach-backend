var express = require('express');
var router = express.Router();

const Unavailability = require('../models/unavailabilities')
const UserLogin = require ('../models/usersLogin')
const CoachProfile = require('../models/coachesProfile'); 


router.post('/', (req, res) => {
  const newUnavailability = new Unavailability ({
    date: req.body.date,
    coachUsername: req.body.coachUsername,
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
      { date: req.body.date,
        coachUsername: req.body.coachUsername,
        //game: req.body.game,
        //username: req.body.username,
      })
      .then((data) => {
        if (data.deletedCount ===0) {
          res.json({result: false, message: 'no unavailability found'})
          console.log("pas de suppression")
        } else {
          res.json({result: true, message:'Unavailability successfully deleted'})
          console.log("suppression")
        }
      })  
    })

router.get('/:coach', (req, res) => {
    UserLogin.findOne({username: req.params.coach}) 
    .then(user => {
      CoachProfile.findOne({user:user._id})
      .then(coach => {
        Unavailability.find({coachUsername:coach._id}).populate('username').populate('coachUsername')
        .then(data => {
            if(!data){
                res.json({unavailabilities : []})
            }else{
                res.json({unavailabilities : data})
            }
      })
        
        })
    })
})
    
module.exports = router;