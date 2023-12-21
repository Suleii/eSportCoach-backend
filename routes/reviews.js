var express = require("express");
var router = express.Router();

const Review = require("../models/reviews");
const UserLogin = require("../models/usersLogin");
const CoachProfile = require("../models/coachesProfile");
const UserProfile = require("../models/usersProfile");

//GET /reviews/:coach : get all reviews of a coach according to the username (via req.params)
router.get("/:coach", (req, res) => {
  UserLogin.findOne({ username: req.params.coach }) //finds the user id by requiring the username
    .then((user) => {
      CoachProfile.findOne({ user: user._id })
        .populate("user") //finds coach id via his user id
        .then((coach) => {
          Review.find({ coach: coach._id })
            .populate("coach")
            .populate({ path: "username", populate: { path: "user" } }) //finds coach's reviews via his coach id
            .then((data) => {
              if (data.length > 0) {
                res.json({ result: true, reviews: data });
              } else {
                res.json({ result: false, reviews: data });
              }
            });
        });
    });
});

//GET /reviews/:gamer : get all reviews of a coach according to the username (via req.params)
router.get("/gamer/:gamer", (req, res) => {
  UserLogin.findOne({ username: req.params.gamer }) //finds the user id by requiring the username
    .then((user) => {
      UserProfile.findOne({ user: user._id })
        .populate("user") //finds coach id via his user id
        .then((gamerProfile) => {
          Review.find({ username: gamerProfile._id })
            .populate({ path: "coach", populate: { path: "user" } }) //finds user's reviews via his coach id
            .then((data) => {
              if (data.length > 0) {
                res.json({ result: true, reviews: data });
              } else {
                res.json({ result: false, reviews: data });
              }
            });
        });
    });
});

// Coach rating update
router.put("/coachRating/:coachUsername", (req, res) => {
  // Find user by username
  UserLogin.findOne({ username: req.params.coachUsername }).then((user) =>
    CoachProfile.findOne({ user: user._id }).then((coach) => {
      Review.find({ coach: coach._id }).then((reviews) => {
        if (reviews.length === 0) {
          return res.json({ message: "No reviews", reviews: reviews });
        }
        const averageRating =
          reviews.reduce((acc, review) => acc + review.rating, 0) /
          reviews.length;
        CoachProfile.updateOne(
          { user: user._id },
          { $set: { rating: Number(averageRating) } }
        ).then((data) => res.json({ message: "average rating updated" }));
      });
    })
  );
});

router.post("/", (req, res) => {
  UserLogin.findOne({ username: req.body.username }).then((user) => {
    UserProfile.findOne({ user: user._id }).then((userProfile) => {
      UserLogin.findOne({ username: req.body.coachUsername }).then((coach) => {
        CoachProfile.findOne({ user: coach._id }).then((coachProfile) => {
          const newReview = new Review({
            game: req.body.game,
            username: userProfile._id,
            coach: coachProfile._id,
            content: req.body.content,
            rating: req.body.rating,
          });
          newReview.save().then((data) => {
            res.json({ result: true, message: "Thanks for your review!" });
          });
        });
      });
    });
  });
});

module.exports = router;
