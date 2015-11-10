var crypto = require('crypto');
var mongoose = require('mongoose');
var AC = require('./activationCodes_controller.js');
	User = mongoose.model('User');
	Post = mongoose.model('Post');
function hashPW(pwd){
	return crypto.createHash('sha256').update(pwd).digest('base64').toString();
}
exports.signup = function(req,res){
	if(req.body.username.length<5){
		res.render('notices',{message:"Usernames must be at least 5 characters",sendback:"true",adr:"/signup"});
	}else if(req.body.password.length<5){
		res.render('notices',{message:"Passwords must be at least 5 characters",sendback:"true",adr:"/signup"});
	}else if(req.body.email.length<1){
		res.render('notices',{message:"Please ensure you provide a valid email address",sendback:"true",adr:"/signup"});
	}else{
		User.findOne({username:req.body.username}).exec(function(err,usr){
			if(err){res.redirect('/signup');}
			if(!usr){
				createUser();
			}else{
				res.render("notices",{message:"Sorry that username already exists",sendback:"true",adr:"/signup"});
			}
		});
		function createUser(){
			var user = new User({username:req.body.username.toLowerCase()});	
			user.set('hashed_password',hashPW(req.body.password));
			user.set('emailVerified',false);
			user.set('favouritePosts',[]);
			user.set('email',req.body.email);
			//here we want to send an email with a special link that activates the account.
			user.save(function(err){
				if(err) {
					res.redirect('/signup');
				}else{
					var code = AC.createCodeWithoutReqRes(user.username);
				}
					console.log("CODE===="+code);	
					res.redirect('/sendMail/register/'+user.username+'/'+code);
				
			});
		}
	}
};

exports.login = function(req,res){
	User.findOne({username:req.body.username.toLowerCase()}).exec(function(err,user){
		if(!user){
			res.render('notices',{message:'There is no account under that user name',sendback:'true',adr:'/login'});
		}else if(!user.emailVerified){
			res.render('notices',{message:"Please click the link in the email that was sent to you to verify your email address",sendback:"false",adr:'/login'});
		}else if(user.hashed_password===hashPW(req.body.password.toString())){
			req.session.regenerate(function(){
				req.session.user = user.id;
				req.session.username = user.username;
				if(user.tagline){req.session.tagline = user.tagline;}
				req.session.msg = 'Authenticated as '+user.username;
				console.log("user logged in is: "+req.session.user);
				res.redirect('/timeline');
			});
		}else{
			res.render('notices',{message:'Please be sure to enter the correct password',sendback:"true",adr:"/login"});
		}
		if(err){
			req.session.regenerate(function(){
				req.session.msg=err;
				res.redirect('/login');
			});
		}
	});
};

exports.getUserProfile = function(req,res){
	User.findOne({_id:req.session.user}).exec(function(err,user){
		if(!user){
			res.json(404,{err: 'User not found'});
		}else{
			res.json(user);
		}
	});
};

exports.updateUser = function(req,res){
	User.findOne({_id:req.session.user}).exec(function(err,user){
		user.set('email',req.body.email);
		user.save(function(err){
			if(err){
				res.sessor.error = err;
			}else{
				req.session.msg='User Updated';
			}
			res.redirect('/user');
		});
	});
};

exports.findAllUsers = function(req,res){
	//find all users where id does not equal logged in user's id (so we can't follow ourselves)
	User.find({_id:{'$ne':req.session.user}}).exec(function(err,users){
		res.json(users);
	});
};

exports.followUser = function(req,res){
	User.findById(req.session.user,function(err,u){
		//check if the followed user is already in the followed list, if not add them.
		
		if(u.FollowList.indexOf(req.params.ptf)==-1){
			User.update({_id:req.session.user},
				{$push: { FollowList : req.params.ptf }},{upsert:true}, function(err, data) {
					res.redirect('/timeline');	
				}
			);
		}else{
			console.log("sorry can't follow that user they already exist!'")
			res.redirect('/');
		}
		
		console.log("now following user "+req.params.ptf);
	});
};

exports.unfollowUser = function(req,res){
	console.log("now unfollowing "+req.params.u);
		//check if the followed user is already in the followed list, if not add them.
		User.update({_id:req.session.user},
		{ $pull: { FollowList: req.params.u}}, function(err,d){
			res.redirect('/timeline');
		});
}

exports.findUserFollows = function(req,res){
	User.findOne({_id:req.session.user}).exec(function(err,user){
		if(user.FollowList){
			console.log("ok so we are looking through the follow list which has the following users");
			console.log("the list is of type: "+typeof(user.FollowList));
			console.log("and length: "+user.FollowList.length);
			console.log(user.FollowList);
			for(var i=0 ; i<user.FollowList.length ; i++){
				var name = user.FollowList[i];
				console.log("now looking for username: "+name);
				User.findOne({username:name}).exec(function(err,fuser){
					if(!fuser){
						User.update({_id:req.session.user},
							{ $pull: { FollowList: name}}, function(err,d){
						});
					}
				})
			}
			res.json(user.FollowList);
		}else{
			res.json("");
		}
	});
};

exports.checkFollowButton = function(req,res){
	if(req.param('id')==req.session.username){
		res.send("match");
	}else{
		//if we get here it means that the user is not the session user
		//now we need to check if the user appears in the session users' followlist
		//req.params.id = the username of the user
		console.log("req.params.id: "+req.param('id'));
		//find the session user's follow list
		User.findOne({_id:req.session.user}).exec(function(err,user){
			var followList = user.FollowList;
			//check if the req.param('id') user is in the followList
			if(followList.indexOf(req.param('id'))==-1){
				res.send("false");
			}else{
				res.send("match");
			}
		});
	}
};

exports.changePassword = function(req,res){
	console.log("the req.body.oldPassword is: "+req.body.oldPassword);
	//now we check the old password to make sure it is the right one
	User.findOne({_id:req.session.user}).exec(function(err,user){		
		if(user.hashed_password===hashPW(req.body.oldPassword)){
			//if the oldPassword is correct then check the new password and the re-typed new password match
			if(req.body.newPassword === req.body.confirmedPassword){
				console.log("oldPassword is correct and the new passwords match");
				//if the new passwords match then change the user's password to the new password
				user.set('hashed_password',hashPW(req.body.newPassword));
				user.save(function(err){
					if(err){
						res.sessor.error = err;
						res.redirect('/settings');
					}else{
						req.session.msg='User Updated';
						res.render('notices',{message:"You have successfully changed your password, please log back in using the new one",sendback:"true",adr:"/logout"});
					}
				});
			}else{
				console.log("oldPassword is correct but the new passwords do not match");
				res.render('notices',{message:"The new passwords you entered did not match",sendback:"true",adr:'/changePassword'});
			}
		}else{
			console.log("oldPassword is not correct");
			res.render('notices',{message:"The password you entered was not correct",sendback:"true",adr:'/changePassword'});
		}
	});
};
exports.changeEmail = function(req,res){
	User.findOne({_id:req.session.user}).exec(function(err,user){		
		user.set('email',req.body.email);
		user.save(function(err){
			if(err){
				res.sessor.error = err;
				res.redirect('/settings');
			}else{
				req.session.msg='User Updated';
				console.log("user email successfully updated");
				res.redirect('/settings');
			}
		});
	});
};

exports.changeTagline = function(req,res){
	User.findOne({_id:req.session.user}).exec(function(err,user){
		user.set('tagline',req.body.tagline);
		user.save(function(err){
			if(err){
				res.sessor.error = err;
				res.redirect('/settings');
				console.log("There was a problem updating the user tagline`");
			}else{
				console.log("user tagline successfully updated");
				req.session.tagline = user.tagline;
				res.redirect('/settings');
			}
		});
	});
};

exports.getTagline = function(req,res){
	User.findOne({_id:req.session.user}).exec(function(err,user){
		res.send(user.tagline);
	});
};

exports.deleteUser = function(req,res){
	User.findOne({_id:req.session.user}).exec(function(err,user){
		if(user){
			user.remove(function(err){
				if(err){
					console.log("There was an error trying to delete user");
					res.send("There was an error trying to delete this user");
				}
				Post.find({username:req.session.username}).exec(function(err,posts){
					console.log("found the following posts: ");
						console.log("they are type: "+typeof(posts));
						console.log(posts);
						for(i in posts){
							posts[i].remove(function(err){	
								if(err){res.render('notices',{message:"Could not delete user",sendback:"false",adr:''});}
							});
						}
				});
				req.session.destroy(function(){
					res.render('notices',{message:"Your account has been deleted",sendback:"false",adr:''});
				});
			});
		}else{
			req.session.destroy(function(){
				res.redirect('/login');
			});
		}
	});
};

exports.searchUser = function(req,res){
	if(req.params.sch.toLowerCase()!=req.session.username.toLowerCase()){
		User.find({username:req.params.sch.toLowerCase()}).exec(function(err,user){
			res.json(user);
		});	
	}
};

exports.favouritePost = function(req,res){
	console.log("adding post favourite number: "+req.params.ptf);
	User.update({_id:req.session.user},
		{$push: { favouritePosts : req.params.ptf }},{upsert:true}, function(err, data) {
			User.find({_id:req.session.user}).exec(function(err,user){
				console.log("the current user's favourite list is thus: "+user.favouritePosts);
				res.redirect('/timeline');	
			});
			
		}
	);
	
	
};

