var express = require("express");
var router = express.Router();

let nodemailer = require("nodemailer");
const pw = process.env.GMAIL_PASSWORD;

const CoachProfile = require("../models/coachesProfile");
const UserProfile = require("../models/usersProfile");
const UserLogin = require("../models/usersLogin");
const Booking = require("../models/bookings");
const Token = require("../models/resetToken");
const uid2 = require("uid2");
const bcrypt = require("bcrypt");

router.post("/contact", (req, res) => {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "experience.lacapsule@gmail.com",
      pass: pw,
    },
  });

  var mailOptions = {
    from: "experience.lacapsule@gmail.com",
    to: "experience.lacapsule@gmail.com",
    subject: req.body.title,
    html: `Message from ${req.body.name} (${req.body.email}) : ${req.body.message}`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      res.json({ error });
    } else {
      res.json({ sent: info.response });
    }
  });
});

router.post("/signup", (req, res) => {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "experience.lacapsule@gmail.com",
      pass: pw,
    },
  });

  var mailOptions = {
    from: "experience.lacapsule@gmail.com",
    to: req.body.email,
    subject: "Welcome to Experience",
    html: `Thank you for signing up ${req.body.name}! You can now enjoy our services.`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      res.json({ error });
    } else {
      res.json({ sent: info.response });
    }
  });
});

router.post("/bookingConfirmation", (req, res) => {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "experience.lacapsule@gmail.com",
      pass: pw,
    },
  });

  var mailOptions = {
    from: "experience.lacapsule@gmail.com",
    to: req.body.email,
    subject: "Booking confirmed !",
    html: ` We are please to announce that your booking with ${req.body.coachName} at ${req.body.date} is confirmed ! You can now prepare your session.`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      res.json({ error });
    } else {
      res.json({ sent: info.response });
    }
  });
});

router.post("/forgottenpassword", (req, res) => {
  let token = uid2(32);
  const hash = bcrypt.hashSync(token, 10);

  //Find userlogin ID from email and create a new document in Token (DB) + send email with link containing username and plain token
  UserProfile.findOne({ email: req.body.email }).then((gamer) => {
    if (!gamer) {
      CoachProfile.findOne({ email: req.body.email }).then((coach) => {
        if (!coach) {
          res.json({ message: "This email does not belong to any user" });
        } else {
          UserLogin.findOne({ _id: coach.user }).then((user) => {
            const username = user.username;
            const newToken = new Token({
              userId: user._id,
              token: hash,
              creation: Date.now(),
            });
            newToken.save();
            sendEmail(username);
          });
        }
      });
    } else {
      UserLogin.findOne({ _id: gamer.user }).then((user) => {
        const username = user.username;
        const newToken = new Token({
          userId: user._id,
          token: hash,
          creation: Date.now(),
        });
        newToken.save();
        sendEmail(username);
      });
    }
  });

  function sendEmail(username) {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "experience.lacapsule@gmail.com",
        pass: pw,
      },
    });

    var mailOptions = {
      from: "experience.lacapsule@gmail.com",
      to: req.body.email,
      subject: "Reset your password",
      html: `<p>Hi ${username},</p>
        <p>You requested to reset your password.</p>
        <p> Please, click the link below to reset your password</p>
        <a href="http://localhost:3001/reset-password/${username}/${token}">Reset Password</a>`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        res.json({ error });
      } else {
        res.json({ sent: info.response });
      }
    });
  }
});

router.post("/bookingCancellation", (req, res) => {
  // Collect booking data
  Booking.findById(req.body.bookingId)
    .populate("username")
    .populate("coachUsername")
    .then((booking) => {
      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }

      var transporter = nodemailer.createTransport({});

      var mailOptions = {
        from: "experience.lacapsule@gmail.com",
        to: [booking.username.email, booking.coachUsername.email],
        subject: "Booking cancelled !",
        html: `The session scheduled for ${req.body.date}, has been cancelled. You can book a new session on our website.`,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          res.json({ error });
        } else {
          res.json({ sent: info.response });
        }
      });
    });
});

module.exports = router;
