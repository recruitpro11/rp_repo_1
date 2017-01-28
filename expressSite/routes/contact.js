var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');

//'/' here is the root of the about. If below was inside index.js we'd put /about here
router.get('/', function(req, res, next) {

  console.log('HS get called');

  res.render('contact',{title: 'Contact'});
});


/*post requests by this page
 * and we want them to go to contact/sent route
 * below basically says go to the given directoy and run the give nfunctions
*/
//router.post('/',function(req, res, next) {
router.get('/send',function(req,res,next) {
console.log('HS post called');

	var transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
		auth: {
			user: 'recruitpro11@gmail.com',
			pass: 'MahdiMashhadHooman'}
	});

	var mailOptions = {
		from: 'xperts cathc <recruitpro11@gmail.com>',
		to: 'houman_sh2001@hotmail.com',
		subject: 'bulshit subbmission',
		text: 'You have a new submission with details... Name: '+req.body.name+ ' Email: '+req.body.email+ ' Message: '+req.body.message 
	};

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
