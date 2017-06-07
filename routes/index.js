var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');

router.get('/', (req, res) => {
    res.render('index');
});

// Post form
router.post('/', (req, res) => {
    // Store the values
    var name = req.body.name;
    var email = req.body.email;
    var message = req.body.message;
    
    // Validation & checking if the fiels are empty or not
    req.checkBody('name', 'Name is required!').notEmpty();
    req.checkBody('email', 'Email is required!').notEmpty();
    req.checkBody('email', 'Email is not vaid!').isEmail();
    req.checkBody('message', 'Message is required!').notEmpty();

    // Storing the validation errors in a var
    var errors = req.validationErrors();

    // Check if there are errors & if there are display them
    if (errors) {
        res.render('index', {
            errors:errors
        });
    } else {
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'jarnobog@gmail.com',
                clientId: '746646116379-q5veigghihadjbfb3f2km93h0vfhnd6f.apps.googleusercontent.com',
                clientSecret: 'T4VA6amvFh1CrMfWqTReCVg6',
                // refreshToken: '',
                pass: '04121999'
            }
        });

        // setup email data with unicode symbols
        let mailOptions = {
            from: req.body.email, // sender address
            to: 'jarnobog@gmail.com', // list of receivers
            subject: 'Contact form jarnobogaert.com ✔', // Subject line
            text: 'Hello world ?', // plain text body
            html: "<h2>Email:</h2>" + req.body.email + "<br><br>" + "<h2>Name:</h2>" + req.body.name + "<br><br>" + "<h2>Message</h2>" + req.body.message // html body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {

            } else {
                // Messaging that the email is succesfuly sent
                req.flash('success_msg', 'Email is sent!');
                console.log('Message %s sent: %s', info.messageId, info.response);
                // Redirecting to the main route
                res.redirect('/');
            }
                
            
        });
    }


    
});

module.exports = router;