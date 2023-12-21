var express = require('express');
var router = express.Router();
const UserProfile= require('../models/usersProfile'); 
const UserLogin = require('../models/usersLogin');
const uniqid = require('uniqid');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

 
 // GET gamer profile
 router.get('/profile/:gamer', (req, res) => {
    // Search the user ID via his username
    UserLogin.findOne({username: req.params.gamer}) 
    .then(user => { 
        // Search userProfile ID via his userLogin ID 
        UserProfile.findOne({user: user._id}).populate('user') 
        .then (gamer =>{
        console.log(gamer)
        res.json({result:true, profile: gamer})
        })
    }) 
  })

  //Create a PUT /profile route to update the coach informations
router.put("/profile/:gamer", (req, res) => {
  // Search the user ID via his username
  UserLogin.findOne({ username: req.params.gamer })
  .then((user) => {
    if (!user) {
      res.json({ result: false, message: "User not found" });
      return;
    }

    // Update the gamer profile by user ID
    UserProfile.updateOne(
      { user: user._id },
      {
        $set: {
          lastname: req.body.lastname,
          firstname: req.body.firstname,
          email: req.body.email,
          photo: req.body.photo,
        },
      },
      { new: true }
    )
      .populate("user")
      .then((updatedProfile) => {
        if (!updatedProfile) {
          // Profile not found, send a 404 response
          res.json({ result: false, message: "Coach profile not found" });
        } else {
          // Profile was successfully updated, send the updated profile
          res.json({ result: true, profile: updatedProfile });
        }
      });
  });
});

router.put("/profile/:gamer/photo", async (req, res) => {
  console.log(req.files.photoFromFront)
   try {
     // Search the user ID via his username
     const user = await UserLogin.findOne({ username: req.params.gamer });
 
     if (!user) {
       res.json({ result: false, message: "User not found" });
       return;
     }
     const photoPath = `./tmp/${uniqid()}.png`;
     const photo = await req.files.photoFromFront.mv(photoPath)
    
     // Upload the photo to Cloudinary
     if (!photo) {
     const cloudinaryResponse = await cloudinary.uploader.upload(photoPath);
     fs.unlinkSync(photoPath);
     
     //Update the coach profile with the Cloudinary photo URL
     const updatedProfile = await UserProfile.updateOne(
       { user: user._id },
       {
         $set: {photo: cloudinaryResponse.secure_url}
       },
       { new: true }
     ).populate("user");
      
     if (!updatedProfile) {
     
       return res.json({ result: false, message: "Gamer profile not found" });
     }
    
     //Profile was successfully updated, send the updated profile
     res.json({ result: true, profile: cloudinaryResponse.secure_url });}
   } catch (error) {
     console.error('Error uploading photo:', error);
     res.status(500).json({ result: false, message: "Internal server error", error: error.message });
   }
 });
  
  module.exports = router;