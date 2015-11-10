var mongoose = require('mongoose');
	AC = mongoose.model('activationCodes');
	User = mongoose.model('User');

exports.createCode = function(req,res){
	var coded = Math.random().toString(36).replace(/[^a-z]+/g, '');
	var code = new AC({username:req.params.username.toLowerCase(),code:coded});
	code.save(function(err){
		if(err) {
			res.session.error = err;
			res.render('notices',{message:"There was an error",sendback:"false",adr:""});
		}else{
			
			res.redirect('/sendMail/register/'+req.params.username.toLowerCase()+'/'+coded);
		}
	});
};

exports.activateWithCode = function(req,res){
	AC.findOne({username:req.params.u}).exec(function(err,code){
		if(!code){
			res.render('notices',{message:"Sorry this link has expired",sendback:"false",adr:""});
		}else{
			if(code.code==req.params.c){
				User.findOne({username:code.username}).exec(function(err,user){
					user.set('emailVerified',true);
					user.save(function(err){
						if(err){
							res.send("Please try again");
						}
					});
					req.session.user = user.id;
					req.session.username = user.username;
				});
			}else{
				res.send("Sorry this link has expired");
			}
			code.remove();
			res.render('notices',{message:"Thank you for verifying your email",sendback:"false",adr:""});;
		}
	});
};

exports.createCodeWithoutReqRes = function(username){
	var coded = Math.random().toString(36).replace(/[^a-z]+/g, '');
	var code = new AC({username:username,code:coded});
	code.save(function(err){
		if(err) {
			console.log("there was an error");
		}else{
			console.log("THIS IS THE CODE: "+coded);
		}
	});
	return coded;
}