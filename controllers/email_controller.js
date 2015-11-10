var nodemailer = require('nodemailer');
require('./users_controller.js');
var htmlToText = require('nodemailer-html-to-text').htmlToText;

exports.sendMail = function(req,res){
	var transporter = nodemailer.createTransport();
	transporter.use('compile', htmlToText());
	var s = req.params.s;
	if(s=="register"){
		//take the code from the link
		console.log("code for user: "+req.params.c);
		//take the username from the link
		//search the user database for the username and find the email address
		User.findOne({username:req.params.p}).exec(function(err,user){
			console.log(user);
			var htm = '<a href="http://www.nworx.co.uk/confirmEmail/'+user.username.toString()+'/'+req.params.c.toString()+'">Verify</a>';
			htm = htm.toString();
			console.log("htm was: "+htm);
			transporter.sendMail({
				from: 'noreply@nworx.co.uk',
				to: user.email,
				subject: user.username+', verify your email address!',
				text: 'click below to verify your email address:',
				html: htm
			});
			res.render('notices',{message:"Please click the link in the email that was just sent to you to verify your email address",sendback:"false",adr:""});
		});
	}
	else{
		res.render('notices',{message:"Not sure how you got here, something seems to have gone wrong",sendback:"false",adr:""});
	}
		
	
};