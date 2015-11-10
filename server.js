var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');	
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var mongoStore = require('connect-mongo')({session:expressSession});
var nodemailer = require('nodemailer');

var conn = mongoose.connect('mongodb://localhost/socialnetwork2');

require('./models/users_model.js');
require('./models/posts_model.js');
require('./models/activationCodes.js');

app.engine('.html',require('ejs').__express);
app.set('views',__dirname+'/views');
app.set('view engine','html');
app.use(express.static('views'));
app.use(bodyParser());

app.use(function (req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next()
});

app.use(expressSession({store: new mongoStore({ mongooseConnection: mongoose.connection}),secret:'dsjfaq3iojrmfsa',cookie : {maxAge:60*60*1000}}));

require('./routes')(app);


app.listen(80);
console.log("now listening on port 80");
