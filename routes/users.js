// var express = require('express');
// var router = express.Router();

// require('../models/connection');
// const User = require('../models/usersLogin');
// const { checkBody } = require('../modules/checkBody');
// const uid2 = require('uid2');
// const bcrypt = require('bcrypt');

// router.post('/signup', (req, res) => {
//   if (!checkBody(req.body, ['firstname', 'username', 'password'])) {
//     res.json({ result: false, error: 'Missing or empty fields' });
//     return;
//   }

//   // Check if the user has not already been registered
//   User.findOne({ username: req.body.username }).then(data => {
//     if (data === null) {
//       const hash = bcrypt.hashSync(req.body.password, 10);

//       const newUser = new User({
//         firstname: req.body.firstname,
//         username: req.body.username,
//         password: hash,
//         isCoach: req.body.isCoach,
//         token: uid2(32),
//       });

//       newUser.save().then(newDoc => {
//         res.json({ result: true, token: newDoc.token });
//       });
//     } else {
//       // User already exists in database
//       res.json({ result: false, error: 'User already exists' });
//     }
//   });
// });

// router.post('/signin', (req, res) => {
//   if (!checkBody(req.body, ['username', 'password'])) {
//     res.json({ result: false, error: 'Missing or empty fields' });
//     return;
//   }

//   User.findOne({ username: req.body.username }).then(data => {
//     if (data && bcrypt.compareSync(req.body.password, data.password)) {
//       res.json({ result: true, firstname: data.firstname, token: data.token });
//     } else {
//       res.json({ result: false, error: 'User not found or wrong password' });
//     }
//   });
// });



// module.exports = router;


var express = require('express');
var router = express.Router();

require('../models/connection');
const User = require('../models/usersLogin');
const { checkBody } = require('../modules/checkBody');
const uid2 = require('uid2');
const bcrypt = require('bcrypt');

router.post('/signup', (req, res) => {
  if (!checkBody(req.body, ['lastname', 'firstname', 'email', 'username', 'password'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  // Check if the user has not already been registered
  User.findOne({ username: req.body.username }).then(data => {
    if (data === null) {
      const hash = bcrypt.hashSync(req.body.password, 10);

      const newUser = new User({
        lastname: req.body.lastname,
        firstname: req.body.firstname,
        email: req.body.email,
        username: req.body.username,
        password: hash,
        isCoach: req.body.isCoach,
        token: uid2(32),
      });

      newUser.save().then(newDoc => {
        console.log(newDoc)
        res.json({ result: true, lastname: newDoc.lastname, firstname: newDoc.firstname, email: newDoc.email, username: newDoc.username ,token: newDoc.token });
      });
      
    
    } else {
      // User already exists in database
      res.json({ result: false, error: 'User already exists' });
    }
  });
});

router.post('/signin', (req, res) => {
  if (!checkBody(req.body, ['username', 'password'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  User.findOne({ username: req.body.username }).then(data => {
    if (data && bcrypt.compareSync(req.body.password, data.password)) {
      res.json({ result: true, firstname: data.firstname, token: data.token });
    } else {
      res.json({ result: false, error: 'User not found or wrong password' });
    }
  });
});



module.exports = router;



