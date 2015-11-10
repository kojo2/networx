var mongoose = require('mongoose');
	Schema = mongoose.Schema;

var UserSchema = new Schema({
	username:{type:String,unique:true},
	tagline: String,
	email:String,
	hashed_password:String,
	FollowList:[],
	emailVerified:Boolean
});

mongoose.model('User',UserSchema);