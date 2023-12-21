var express = require("express");
var router = express.Router();
const uniqid = require('uniqid');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const CoachProfile = require("../models/coachesProfile");
const UserLogin = require("../models/usersLogin");

// Create a GET /profile route to collect the coach informations via his username
router.get("/profile/:coach", (req, res) => {
  // Search the user ID via his username
  UserLogin.findOne({ username: req.params.coach }).then((user) => {
    // Search coach ID via his user ID
    CoachProfile.findOne({ user: user._id })
      .populate("user")
      .then((coach) => {
        console.log(coach);
        res.json({ result: true, profile: coach });
      });
  });
});

//Create a PUT /profile route to update the gamer informations
router.put("/profile/:coach", (req, res) => {
  // Search the user ID via his username
  UserLogin.findOne({ username: req.params.coach })
  .then((user) => {
    if (!user) {
      res.json({ result: false, message: "User not found" });
      return;
    }

    // Update the coach profile by user ID
    CoachProfile.updateOne(
      { user: user._id },
      {
        $set: {
          lastname: req.body.lastname,
          firstname: req.body.firstname,
          email: req.body.email,
          photo: req.body.photo,
          about: req.body.about,
          'socials.twitch': req.body.twitch,
          'socials.instagram': req.body.instagram,
          'socials.youtube': req.body.youtube,
          'socials.discord': req.body.discord,
        },
        $set: {
          games: req.body.games,
          experience: req.body.experience,
          language: req.body.language,
        },
      },
      { new: true }
    )
      .populate("user")
      .then((updatedProfile) => {
        if (!updatedProfile) {
          // Profile not found, send a 404 response
          res.json({ result: false, message: "Gamer profile not found" });
        } else {
          // Profile was successfully updated, send the updated profile
          res.json({ result: true, profile: updatedProfile });
        }
      });
  });
});



router.put("/profile/:coach/photo", async (req, res) => {
 console.log(req.files.photoFromFront)
  try {
    // Search the user ID via his username
    const user = await UserLogin.findOne({ username: req.params.coach });

    if (!user) {
      res.json({ result: false, message: "User not found" });
      return;
    }
    const photoPath = `./tmp/${uniqid()}.png`;
    const photo = await req.files.photoFromFront.mv(photoPath)
   //const photo = await req.files.photo.mv(photoPath) 
    console.log('Received photo:', photo);

    // Upload the photo to Cloudinary
    if (!photo) {
    const cloudinaryResponse = await cloudinary.uploader.upload(photoPath);
    fs.unlinkSync(photoPath);
    console.log('Cloudinary response:', cloudinaryResponse);

    
    //Update the coach profile with the Cloudinary photo URL
    const updatedProfile = await CoachProfile.updateOne(
      { user: user._id },
      {
        $set: {photo: cloudinaryResponse.secure_url,}
      },
      { new: true }
    ).populate("user");

    if (!updatedProfile) {
    
      return res.json({ result: false, message: "Coach profile not found" });
    }
  
    //Profile was successfully updated, send the updated profile
    res.json({ result: true, profile: updatedProfile });}
  } catch (error) {
    console.error('Error uploading photo:', error);
    res.status(500).json({ result: false, message: "Internal server error", error: error.message });
  }
});


// Create a DELETE /profile route to delete the coach informations
router.delete("/profile/:coach", (req, res) => {
  // Search user ID via username
  UserLogin.deleteOne({ username: req.params.coach }).then((user) => {
    // Delete the coach profile by user ID
    CoachProfile.deleteOne({ user: user._id })
      .populate("user")
      .then((deletedProfile) => {
        if (!deletedProfile) {
          // Profile not found, send a 404 response
          res.json({ result: false, message: "Coach profile not found" });
        } else {
          // Profile was successfully deleted, send a success response
          res.json({
            result: true,
            message: "Coach profile deleted successfully",
          });
        }
      });
  });
});

//Get all available games from all coaches
router.get("/games", (req, res) => {
  CoachProfile.find().then((coaches) => {
    let availableGames = [];
    for (let coach of coaches) {
      for (let game of coach.games) {
        if (!availableGames.includes(game)) {
          availableGames.push(game);
        }
      }
    }
    res.json({ result: true, availableGames });
  });
});

// Get all available languages from all coaches
router.get("/languages", (req, res) => {
  CoachProfile.find().then((coaches) => {
    let availableLanguages = [];
    for (let coach of coaches) {
      for (let language of coach.language) {
        if (!availableLanguages.includes(language)) {
          availableLanguages.push(language);
        }
      }
    }
    res.json({ result: true, availableLanguages });
  });
});

//Get all available coaches with a rating > 4
router.get("/bestCoaches", (req, res) => {
  CoachProfile.find()
    .populate("user")
    .then((coaches) => {
      const bestCoaches = coaches.filter((coach) => coach.rating >= 4);

      if (bestCoaches.length > 0) {
        res.json({ result: true, coaches: bestCoaches });
      } else {
        res.json({
          result: false,
          message: "No coaches found with rating above 4",
        });
      }
    })
    .catch((error) => {
      console.error("Error", error);
    });
});

module.exports = router;
