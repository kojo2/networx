var crypto = require('crypto');
var express = require('express');
module.exports = function(app){
	var users = require('./controllers/users_controller');
	var posts = require('./controllers/posts_controller');
	app.use('/static',express.static('./static')).
		use('/lib',express.static('../lib'));
		
	app.get('/landing',function(req,res){
		res.render('landing');
	});
			
	app.get('/user',function(req,res){
		if(req.session.user){
			res.render('user',{msg:req.session.msg});
		}else{
			req.session.msg = 'Access denied!';
			res.redirect('/login');
		}
	});
	app.get('/signup',function(req,res){
		if(req.session.user){
			res.redirect('/');
		}
		res.render('signup',{msg:req.session.msg});
	});
	app.get('/login',function(req,res){
		if(req.session.user){
			res.redirect('/');
		}
		res.render('login',{msg:req.session.msg});
	});
	app.get('/logout',function(req,res){
		req.session.destroy(function(){
			res.redirect('/login');
		});
	});
	
	app.get('/timeline',function(req,res){
		if(req.session.user){ 
			res.render('timeline',{user:req.session.username,tagline:req.session.tagline});
		}else{
			res.redirect('/login');
		}
	});
	
	app.get('/myPosts',function(req,res){
		if(req.session.user){ 
			res.render('myPosts',{user:req.session.username,tagline:req.session.tagline});
		}else{
			res.redirect('/login');
		}
	});
	
	app.get('/profiles/:user',function(req,res){
		res.render('myPosts',{user:req.params.user,tagline:''});
	});
	
	app.get('/settings',function(req,res){
		if(req.session.user){ 
			res.render('settings',{user:req.session.user});
		}else{
			res.redirect('/login');
		}
	});
	
	app.get('/newPost',function(req,res){
		if(req.session.user){
			res.render('newPost');
		}else{
			res.redirect('/login');
		}
	});
	
	app.get('/findPtf',function(req,res){
		if(req.session.user){
			res.render('findPtf');
		}else{
			res.redirect('/login');
		}
	});
	
	//test routes
	app.get('/showAllPosts',function(req,res){
		res.render('test-showAllPosts');
	})
	
	app.get('/getLoggedInUser',function(req,res){
		res.json(req.session.username);
	});
	
	app.get('/deletePost/:ptd',posts.deletePost);
	app.get('/editPostPage/:pst',function(req,res){
		res.render('editPost',{p:req.params.pst});
	});
	app.post('/editPost/:pte',posts.editPost);
	
	app.get('/findSinglePostPage/:sp',function(req,res){
		res.render('singlePost',{p:req.params.sp});
	});
	
	app.get('/checkDeleteButton',function(req,res){
		if(req.param('id')==req.session.username){
			res.send("match");
		}else{
			res.send("false");
		}
	});
	
	app.get('/checkFollowButton',users.checkFollowButton);
	
	app.get('/favourite/:ptf',users.favouritePost);
	
	app.get('/changePassword',function(req,res){
		res.render('changePassword',{username:req.session.username});
	});	
	
	app.get('/changeEmail',function(req,res){
		res.render('changeEmail',{username:req.session.username});
	});
	
	app.get('/changeTagline',function(req,res){
		res.render('changeTagline',{username:req.session.username});
	});
	
	app.get('/getTagline',users.getTagline);
	
	app.get('/deleteAccount',function(req,res){
		res.render('deleteAccount');
	});
	
	app.get('/deleteUser',users.deleteUser);
	
	app.post('/changePassword',users.changePassword);
	
	app.post('/changeEmail',users.changeEmail);
	
	app.post('/changeTagline',users.changeTagline);
	
	app.get('/findSinglePost',posts.findSinglePost);
	
	app.get('/unfollowUser/:u',users.unfollowUser);
	
	app.get('/findAllPostsForAllUsers',posts.findAllPostsForAllUsers);
	
	app.get('/followUser/:ptf',users.followUser);
	app.get('/findUsersFollows',users.findUserFollows);
	
	app.get('/findAllPosts',posts.findAllPosts);
	app.get('/findAllPostsForUser/:user',posts.findAllPostsForUser);
	app.get('/findAllUsers',users.findAllUsers);

	app.post('/signup',users.signup);
	app.post('/user/update',users.updateUser);
	app.post('/login',users.login);
	app.post('/newPost',posts.createPost);
	app.post('/search/:sch',users.searchUser);
	
	app.get('/user/profile',users.getUserProfile);
	app.get('/',function(req,res){
		if(req.session.user){
			res.redirect('/timeline');
		}else{
			//req.session.msg = 'Access denied!';
			//res.redirect('/landing');
			res.render('landing');
		}
	});
	
	var activationCodes = require('./controllers/activationCodes_controller.js');
	
	app.get('/setActivationCode/:username',activationCodes.createCode);

	var email = require('./controllers/email_controller.js');
	app.get('/sendMail/:s/:p/:c',email.sendMail);
	var codeActivation = require('./controllers/activationCodes_controller');
	app.get('/confirmEmail/:u/:c',codeActivation.activateWithCode);
	
	
	

}
