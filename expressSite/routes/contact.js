var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');

//'/' here is the root of the about. If below was inside index.js we'd put /about here
router.get('/', function(req, res, next) {
  res.render('contact',{title: 'Contact'});
});


/*post requests by this page
 * and we want them to go to contact/sent route
 * below basically says go to the given directoy and run the give nfunctions
*/
router.post('/contact', function(req, res, next) {
	var transporter = nodemailer.createTransport({
		auth: {
			user: 'xpertscatch@gmail.com',
			pass: 'sheff1eld'}
	});

	var mailOptions = {
		from: 'xperts cathc <xpertscatch@gmail.com',
		to: 'houman_sh2001@hotmail',
		subject: 'bulshit subbmission',
		text: 'You have a new submission with details... Name: '+req.body.name+ ' Email: '+req.body.email+ ' Message: '+req.body.message 
	};

	transporter.sendMail(mailOptions, function(error, info) {
		console.log('hs here2');
		if(error){
			console.log(error);
			res.redirect('/index');
		} else {
			console.log('Message Sent' + info.response);
 			res.redirect('/index');

		}
	});
});


module.exports = router;
