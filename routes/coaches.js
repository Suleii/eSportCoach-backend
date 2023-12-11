var express = require('express');
var router = express.Router();
const CoachProfile = require('../models/coachesProfile'); 
const UserLogin = require('../models/usersLogin');


/*dans le fichier coaches.js, créer une route POST /profile 
qui ajoute un nouveau document à la collection Coach Profile*/
router.post('/profile', (req, res) => {
  
    const newCoachProfile = new CoachProfile({
        lastname: req.body.lastname,
        firstname: req.body.firstname,
        email: req.body.email,
        photo: req.body.photo,
        user: req.body.user,
        games: req.body.games,
        bookings: req.body.bookings,
        socials: {
            twitch: req.body.twitch,
            instagram: req.body.instagram,
            youtube: req.body.youtube,
            discord: req.body.discord,
        },
        about: req.body.about,
        reviews: req.body.reviews,
    });

    newCoachProfile.save()
    .then(data => {
        res.json(data)
    })
});
  
router.get('/profile/:username', (req, res) => {
    UserLogin.findOne({username: req.params.coach})
    .then(user => {
    console.log(user)
    CoachProfile.findOne({user:user._id}).populate('user')
    .then (coach =>{
    console.log(coach)
    res.json({result:true, coach})
      });})})

module.exports = router;
