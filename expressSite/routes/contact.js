var express = require('express');
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');

var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

//'/' here is the root of the about. If below was inside index.js we'd put /about here
router.get('/', function(req, res, next) {

  console.log('HS get called');

  res.render('contact',{title: 'Contact'});
});


/*post requests by this page
 * and we want them to go to contact/sent route
 * node that since the router we are in is registerd at /contact, 
 * /send in this file means /contact/send  
*/
router.post('/send',function(req, res, next) {
//router.get('/send',function(req,res,next) {
console.log('HS post called');

console.log(req.body.Name);
console.log(req.body.Email);
console.log(req.body.Message);

	var transporter = nodemailer.createTransport({
                host: 'smtp-mail.outlook.com',
                secureConnection: false,
                port: 587,
                tls: {
                        ciphers: 'SSLv3'
                }, 
		auth: {
			user: 'expertscatch@outlook.com',
			pass: 'sheff1eld'}
                });



/*	var transporter = nodemailer.createTransport("SMTP", {
 	   	service: "hotmail",
   		 auth: {
        		user: "houman_sh2001@hotmail.com",
        		pass: "2545570hooman"
   		 }
	});
*/
	var mailOptions = {
		from: '<expertscatch@outlook.com>',
		to: 'houman_sh2001@hotmail.com',
		subject: 'bulshit subbmission',
		text: 'You have a new submission with details... Name: '+req.body.Name+ ' Email: '+req.body.Email+ ' Message: '+req.body.Message 
	};

//console.log(mailOptions);

	transporter.sendMail(mailOptions, function(error, info) {
		if(error){
			console.log(error);
			res.redirect('/');
		} else {
			console.log('Message Sent' + info.response);
 			res.redirect('/');

		}
	});
});


module.exports = router;
