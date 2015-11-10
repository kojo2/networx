var crypto = require('crypto');
var mongoose = require('mongoose');
	Post = mongoose.model('Post');
function hashPW(pwd){
	return crypto.createHash('sha256').update(pwd).digest('base64').toString();
}
exports.createPost = function(req,res){
	if(req.body.message.length>140){
		res.render('notices',{message:"Posts can be a maximum of 140 characters",sendback:"true",adr:"/timeline"});
	}else if(req.body.message.length<1){
		res.redirect('/timeline');
	}else{
		var atposition = req.body.message.search("@");
		if(atposition>-1){
			//tag the post to be picked up by the targetted user
			var strName = req.body.message.split("@");
			console.log("strName is: "+strName[1]);
			var strName1 = strName[1].split(" ");
			console.log("strName1[0]: "+strName1[0]);
			var name = strName1[0].toLowerCase();
			if(atposition==0){
				console.log("this post contains an @ at the beginning of the post");
				var privatePost = 1;
			}else{
				console.log("this post contains an @ somewhere in the middle");
				var privatePost=0;
			}
		}else{
			var privatePost=0;
		}
			
		var post = new Post({username:req.session.username,message:req.body.message,DateTime:Date(),privatePost:privatePost,targettedUser:name});
		post.save(function(err){
			if(err) {
				res.redirect('/');
			}else{
				req.session.msg = 'Created post ';
				res.redirect('/');
			}
		});
	}
};

exports.editPost = function(req,res){
	Post.findById(req.params.pte, function (err, doc) {
		if(err) console.log(err);
		if(req.session.username==doc.username){
			doc.message = req.body.message;
			doc.save();
			res.redirect("/timeline");
		}else{
			res.render('notices',{message:"Nice try hax0r but you can't edit other people's posts!",sendback:"false",adr:""});
		}
	});
}

exports.deletePost = function(req,res){
	Post.findOne({'_id' : req.params.ptd}).exec(function(err,p){
		if(req.session.username==p.username){
			p.remove();
			res.redirect('/');
		}else{
			res.render('notices',{message:"Nice try hax0r but you can't delete other people's posts!",sendback:"false",adr:""});
		}
	});
	//Post.findOneAndRemove({'_id' : req.params.ptd}, function (err,doc){
	//	res.redirect("/timeline");
    //});
};

exports.findSinglePost = function(req,res){
	Post.find({_id:req.param('sp')}).exec(function(err,p){
		res.json(p);
	});
}

exports.findAllPosts = function(req,res){
	Post.find({username:req.session.username}).exec(function(err,posts){
		Post.find({targettedUser:req.session.username},function(err,pos){
			posts = posts.concat(pos);
			res.json(posts);
		});
	});
};

exports.findAllPostsForUser = function(req,res){
	Post.find({username:req.params.user}).exec(function(err,posts){
		res.json(posts);
	});
};

exports.findAllPostsForAllUsers = function(req,res){
	
	var followLis = req.param('r').toString();
	var followList = followLis.split(",");
	var pp = false;
	var counter=0;
	var pss = [];
	
	for(var i=0 ; i<followList.length+1 ; i++){
		Post.find({username:followList[i]}).exec(function(err,ps){
			callback(ps);
		});
	}
	function callback(ps){
		pss = pss.concat(ps);
		counter++;
		if(counter==followList.length){
			//go through array of posts and look for any that are private, if they are private remove them from the array
			for(each in pss){
				var psseach = pss[each];
				var strpsseach = JSON.stringify(psseach);
				var searchstring = ('true');
				if(strpsseach.search(searchstring)>-1){
					var index = pss.indexOf(psseach);
					pss.splice(index,1);
				}
			}
			end();
		}
	}
	function end(){
		//find user's posts and add them to the posts from the followed users
		Post.find({username:req.session.username},function(err,p){
			pss = pss.concat(p);
			//and find any posts where this user is mentioned
			Post.find({targettedUser:req.session.username},function(err,pos){
				pss = pss.concat(pos);
				//finally send it all to the client
				//now we want to loop through all posts and add in hyperlink code anytime an @name is found
				
				res.json(pss);
			});
		});
	}
};


