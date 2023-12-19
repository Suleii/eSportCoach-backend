var express = require('express');
var router = express.Router();
  
let nodemailer = require('nodemailer')
const pw = process.env.GMAIL_PASSWORD;


router.post('/contact', (req, res) =>{
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'experience.lacapsule@gmail.com',
            pass: pw
        }
    });

    var mailOptions = {
        from: 'experience.lacapsule@gmail.com',
        to: 'experience.lacapsule@gmail.com',
        subject: req.body.title,
        html: `Message from ${req.body.name} (${req.body.email}) : ${req.body.message}`,
        
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            res.json({error});   
        } else {
            res.json({sent: info.response});
            
        }
        
    });
    
});

router.post('/signup', (req, res) =>{
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'experience.lacapsule@gmail.com',
            pass: pw
        }
    });

    var mailOptions = {
        from: 'experience.lacapsule@gmail.com',
        to: req.body.email,
        subject: "Welcome to Experience",
        html: `Thank you for signing up ${req.body.name}! You can now enjoy our services.`,
        
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            res.json({error});   
        } else {
            res.json({sent: info.response});
            
        }
        
    });
    
});

module.exports = router;