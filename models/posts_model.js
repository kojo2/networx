var mongoose = require('mongoose');
	pSchema = mongoose.Schema;

var PostSchema = new pSchema({
	username:String,
	message:String,
	DateTime:String,
	privatePost:Boolean,
	targettedUser:String
});

mongoose.model('Post',PostSchema);