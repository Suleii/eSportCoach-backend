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
      .then(existingUser => {
        if (existingUser) {
          return res.json({ result: false, error: 'This username is already used' });
        }
  
        UserProfile.findOne({ email: req.body.email })
          .then(existingEmail => {
            if (existingEmail) {
              return res.json({ result: false, error: 'This email is already used' });
            }
  
            const hash = bcrypt.hashSync(req.body.password, 10);
            const newUserLogin = new UserLogin({
              username: req.body.username,
              password: hash,
              token: uid2(32),
              isCoach: false
            });
  
            newUserLogin.save()
              .then(savedUser => {
                const newUserProfile = new UserProfile({
                  lastname: req.body.lastname,
                  firstname: req.body.firstname,
                  email: req.body.email,
                  user: savedUser._id
                });
  
                newUserProfile.save()
                  .then(() => {
                    res.json({ result: true, username: savedUser.username, token: savedUser.token, isCoach: savedUser.isCoach });
                  });
              });
          });
      })
      .catch(error => res.json({ result: false, error }));
  });
  

  // Check if the user has not already been registered
  router.post('/signup/coach', (req, res) => {
    UserLogin.findOne({ username: req.body.username })
      .then(existingUser => {
        if (existingUser) {
          return res.json({ result: false, error: 'This username is already used' });
        }
  
        CoachProfile.findOne({ email: req.body.email })
          .then(existingEmail => {
            if (existingEmail) {
              return res.json({ result: false, error: 'This email is already used' });
            }
  
            const hash = bcrypt.hashSync(req.body.password, 10);
            const newUserLogin = new UserLogin({
              username: req.body.username,
              password: hash,
              token: uid2(32),
              isCoach: true
            });
  
            newUserLogin.save()
              .then(savedUser => {
                const newCoachProfile = new CoachProfile({
                  lastname: req.body.lastname,
                  firstname: req.body.firstname,
                  email: req.body.email,
                  user: savedUser._id
                });
  
                newCoachProfile.save()
                  .then(() => {
                    res.json({ result: true, username: savedUser.username, token: savedUser.token, isCoach: savedUser.isCoach });
                  });
              });
          });
      })
      .catch(error => res.json({ result: false, error }));
  });
  
  
  





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



