var express = require('express');
var router = express.Router();

require('../models/connection');
const UserLogin = require('../models/usersLogin');
const UserProfile = require('../models/usersProfile');
const CoachProfile = require('../models/coachesProfile');


const { checkBody } = require('../modules/checkBody');
const uid2 = require('uid2');
const bcrypt = require('bcrypt');

router.post('/signup/gamer', (req, res) => {
  if (!checkBody(req.body, ['lastname', 'firstname', 'email', 'username', 'password'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  // Check if the user has not already been registered
  UserLogin.findOne({ username: req.body.username })
  .then(data => {
    if (data === null) {
      UserProfile.findOne({email: req.body.email})
        .then(data => {
          if(data ===null) {
            const newUserProfile = new UserProfile ({
              lastname: req.body.lastname,
              firstname: req.body.firstname,
              email: req.body.email,
            });
            newUserProfile.save()
          }else {
            res.json({result:false , error : "This email has already been used"})
          }
        })
          
      const hash = bcrypt.hashSync(req.body.password, 10);
      const newUserLogin = new UserLogin ({
          username: req.body.username,
          password: hash,
          token: uid2(32),
          isCoach : false,
            });
          newUserLogin.save()
      .then(newDoc => {
        res.json({ result: true, username: newDoc.username ,token: newDoc.token, isCoach: false })
      })
        }else {
      // User already exists in database
      res.json({ result: false, error: 'This username already exists' });
           }
})
})

router.post('/signup/coach', (req, res) => {
  if (!checkBody(req.body, ['lastname', 'firstname', 'email', 'username', 'password'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  // Check if the user has not already been registered
  UserLogin.findOne({ username: req.body.username })
  .then(data => {
    if (data === null) {
      CoachProfile.findOne({email: req.body.email})
        .then(data => {
          if(data ===null) {
            const newCoachProfile = new CoachProfile ({
              lastname: req.body.lastname,
              firstname: req.body.firstname,
              email: req.body.email,
            });
            newCoachProfile.save()
          }else {
            res.json({result:false , error : "This email has already been used"})
          }
        })
          
      const hash = bcrypt.hashSync(req.body.password, 10);
      const newUserLogin = new UserLogin ({
          username: req.body.username,
          password: hash,
          token: uid2(32),
          isCoach : true,
            });
          newUserLogin.save()
      .then(newDoc => {
        res.json({ result: true, username: newDoc.username ,token: newDoc.token, isCoach: true })
      })
        }else {
      // User already exists in database
      res.json({ result: false, error: 'This username already exists' });
           }
})
})
  





router.post('/signin', (req, res) => {
  if (!checkBody(req.body, ['username', 'password'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  UserLogin.findOne({ username: req.body.username }).then(data => {
    if (data && bcrypt.compareSync(req.body.password, data.password)) {
      res.json({ result: true, username: data.username, token: data.token, isCoach: data.isCoach });
    } else {
      res.json({ result: false, error: 'User not found or wrong password' });
    }
  });
});



module.exports = router;



