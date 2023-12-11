var express = require('express');
var router = express.Router();
const CoachProfile = require('../models/coachesProfile'); 

/*dans le fichier coaches.js, créer une route POST /profile 
qui ajoute un nouveau document à la collection Coach Profile*/
router.post('/profile', (req,res) => {
   
      // Créez une nouvelle instance du modèle CoachProfile
      const newProfile = new CoachProfile({
        lastname: req.body.lastname,
        firstname: req.body.firstname,
        email: req.body.email,
        photo: req.body.photo,
        user: req.body.user,
        games: req.body.games,
        bookings: req.body.bookings,
        socials: {
            twitch: req.body.socials.twitch,
            instagram: req.body.socials.instagram,
            youtube: req.body.socials.youtube,
            discord: req.body.socials.discord,
        },
        about: req.body.about,
        reviews: req.body.reviews,
    });
    newProfile.save()
    .then(data => {
      // Répondez avec le profil enregistré
      res.json(data);
    });})
    
 
  
  
// Route to get a user marker via his nickname
router.get('/places/:nickname', (req, res) => {
    Marker.find({nickname: req.params.nickname})
    .then(data => {
        if (data) {
            res.json ({result: true, places: data});
        } else {
          res.json ({result: false, error: 'Marker not found'});
        }
    })
})

// Route to delete marker via user's nickname and name
router.delete('/places', (req, res) => {
    const { nickname, name } = req.body;
  
    Marker.deleteOne({ nickname, name })
      .then(() => {
          res.json({ result: true });
        })
      })
  
 

module.exports = router;
