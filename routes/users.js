var express = require("express");
var router = express.Router();

require("../models/connection");
const UserLogin = require("../models/usersLogin");
const UserProfile = require("../models/usersProfile");
const CoachProfile = require("../models/coachesProfile");
const Token = require("../models/resetToken")

const { checkBody } = require("../modules/checkBody");
const uid2 = require("uid2");
const bcrypt = require("bcrypt");

router.post("/signup/gamer", (req, res) => {
  const usernameLowerCase = req.body.username.toLowerCase();
  const emailLowerCase = req.body.email.toLowerCase();
  const mailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (
    !checkBody(req.body, [
      "lastname",
      "firstname",
      "email",
      "username",
      "password",
    ])
  ) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  // Check if the user has not already been registered
  UserLogin.findOne({ username: usernameLowerCase })
    .then((existingUser) => {
      if (existingUser) {
        return res.json({
          result: false,
          error: "This username is already used",
        });
      }

      UserProfile.findOne({ email: emailLowerCase }).then((existingEmail) => {
        if (existingEmail) {
          return res.json({
            result: false,
            error: "This email is already used",
          });
        }

        if (!mailRegex.test(req.body.email)) {
          return res.json({
            result: false,
            error: "Invalid email format",
          });
        }

        const hash = bcrypt.hashSync(req.body.password, 10);
        const newUserLogin = new UserLogin({
          username: req.body.username,
          password: hash,
          token: uid2(32),
          isCoach: false,
        });

        newUserLogin.save().then((savedUser) => {
          const newUserProfile = new UserProfile({
            lastname: req.body.lastname,
            firstname: req.body.firstname,
            email: req.body.email,
            photo: req.body.photo,
            user: savedUser._id,
          });

          newUserProfile.save().then(() => {
            res.json({
              result: true,
              username: savedUser.username,
              token: savedUser.token,
              isCoach: savedUser.isCoach,
            });
          });
        });
      });
    })
    .catch((error) => res.json({ result: false, error }));
});

// Check if the user has not already been registered
router.post("/signup/coach", (req, res) => {
  const usernameLowerCase = req.body.username.toLowerCase();
  const emailLowerCase = req.body.email.toLowerCase();
  const mailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (
    !checkBody(req.body, [
      "lastname",
      "firstname",
      "email",
      "username",
      "password",
    ])
  ) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  UserLogin.findOne({ username: usernameLowerCase })
    .then((existingUser) => {
      if (existingUser) {
        return res.json({
          result: false,
          error: "This username is already used",
        });
      }

      if (!mailRegex.test(req.body.email)) {
        return res.json({
          result: false,
          error: "Invalid email format",
        });
      }

      CoachProfile.findOne({ email: emailLowerCase }).then((existingEmail) => {
        if (existingEmail) {
          return res.json({
            result: false,
            error: "This email is already used",
          });
        }

        const hash = bcrypt.hashSync(req.body.password, 10);
        const newUserLogin = new UserLogin({
          username: req.body.username,
          password: hash,
          token: uid2(32),
          isCoach: true,
        });

        newUserLogin.save().then((savedUser) => {
          const newCoachProfile = new CoachProfile({
            lastname: req.body.lastname,
            firstname: req.body.firstname,
            email: req.body.email,
            photo: req.body.photo,
            games: req.body.games,
            price: req.body.price,
            socials: req.body.socials,
            about: req.body.about,
            experience: req.body.experience,
            rating: req.body.rating,
            language: req.body.language,
            user: savedUser._id,
          });

          newCoachProfile.save().then(() => {
            res.json({
              result: true,
              username: savedUser.username,
              token: savedUser.token,
              isCoach: savedUser.isCoach,
            });
          });
        });
      });
    })
    .catch((error) => res.json({ result: false, error }));
});

router.post("/signin", (req, res) => {
  if (!checkBody(req.body, ["username", "password"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  UserLogin.findOne({ username: req.body.username }).then((data) => {
    if (data && bcrypt.compareSync(req.body.password, data.password)) {
      res.json({
        result: true,
        username: data.username,
        token: data.token,
        isCoach: data.isCoach,
      });
    } else {
      res.json({ result: false, error: "User not found or wrong password" });
    }
  });
});

router.put('/updatepassword', async (req, res) => {
  try {
    const user = await UserLogin.findOne({ username: req.body.username });
    const token = await Token.findOne({ userId: user._id });

    //Compare plain token from link to crypted token in DB before allowing password to be updated
    if (bcrypt.compareSync(req.body.token, token.token)) {
      const hash = bcrypt.hashSync(req.body.newpassword, 10);
      await UserLogin.updateOne({ username: req.body.username }, { $set: { password: hash } });
      res.json({ message: "Password updated" });
    } else {
      res.json({ message: "Token invalid or expired" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
