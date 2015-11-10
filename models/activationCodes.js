var mongoose = require('mongoose');

var ActivationSchema = new mongoose.Schema({
	username:String,
	code:String
});

mongoose.model('activationCodes',ActivationSchema);