var express=require('express');
var app=express();
var bodyParser=require('body-parser');
var session=require('express-session');
var mongoose=require('mongoose');
const mongodb= require('./config/mongodb');
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/User');
var User = mongoose.model('User');
var Buyer = require('./models/Buyer');
var Buyer = mongoose.model('Buyer');
var Smtp = require('./models/Smtp');
var Smtp = mongoose.model('Smtp');
var Queue = require('./models/Queue');
var Queue = mongoose.model('Queue');
var Cappings = require('./models/Cappings');
var Cappings = mongoose.model('Cc_Capping');
var ActiveHours = require('./models/ActiveHours');
var ActiveHours = mongoose.model('Active_Hour');
var Cdr = require('./models/Cdr');
var Cdr = mongoose.model('Cdr');
var BuyerActiveHours = require('./models/BuyerActiveHours');
var BuyerActiveHours = mongoose.model('BuyerActive_Hour');
var cors = require('cors');
const md5 = require('md5');
const encodeMD5 = string => md5(string);
var https = require('https');
const fs = require('fs');
var moment = require('moment-timezone');
app.use(cors())

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname+'/public'));


passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
}, function (req, username, password, done) {
 //console.log(req.body.role);
  User.findOne({ username: username, password: encodeMD5(password), role: req.body.role, status: { $in: ['Active', 'active'] } }).then(function (user) {
    if (user) {
      return done(null, user);      
    }else {
		if(req.body.role == 'monitor'){
			//console.log({ email: username,password:password, status: { $in: ['Active', 'active'] } });
			Queue.findOne({ email: username,password:password, status: { $in: ['Active', 'active'] } }).then(function (queue) {      
			if (!queue) {
			  return done(null, false, { success: 'NOK', errors: { 'username or password': 'is invalid' } });
			}
			return done(null, queue);
		  });
		}else{
		  Buyer.findOne({ email: username,password:encodeMD5(password), role: req.body.role, status: { $in: ['Active', 'active'] } }).then(function (buyer) {      
			if (!buyer) {
			  return done(null, false, { success: 'NOK', errors: { 'username or password': 'is invalid' } });
			}
			return done(null, buyer);
		  });
		}
    }  
    
  }).catch(done);
}));


mongoose.connect(mongodb.url, { useNewUrlParser: true });
/*models*/
require('./models/User');
require('./models/UserSettings');
require('./models/Tfn');
require('./models/Buyer');
require('./models/Smtp');
require('./models/Campaign');
require('./models/CampPubTfn');
require('./models/CampBuyerTfn');
require('./models/Cdr');
require('./models/Role');
require('./models/BuyerNumbers');
require('./models/Queue');
require('./models/QueueNumbers');
require('./models/AssignedPublishers');
require('./models/Cappings');
require('./models/ActiveHours');
require('./models/BuyerActiveHours');
/*routes*/
require('./routes/api/buyers')(app);
require('./routes/api/smtp')(app);
require('./routes/api/users')(app);
require('./routes/api/tfns')(app);
require('./routes/api/campaigns')(app);
require('./routes/api/cdrs')(app);
require('./routes/api/roles')(app);
require('./routes/api/buyernumbers')(app);
require('./routes/api/queues')(app);
require('./routes/api/queuenumbers')(app);
require('./routes/api/cappings')(app);
require('./routes/api/activehours')(app);

var key = fs.readFileSync('/etc/letsencrypt/live/portal.alivepbx.com/privkey.pem');
//var cert = fs.readFileSync('/etc/letsencrypt/live/portal.alivepbx.com/cert.pem');
var cert = fs.readFileSync('/etc/letsencrypt/live/portal.alivepbx.com/fullchain.pem');
var options = {
  key: key,
  cert: cert
};

var server = https.createServer(options, app);

server.listen(process.env.PORT || 3000, function(){
    console.log('Listening on port ' + server.address().port);
});



/*const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};

https.createServer(options, function (req, res) {
  res.writeHead(200);
  res.end("hello world\n");
}).listen(8000);*/


/*var server = app.listen(process.env.PORT || 3000, function () {
  console.log('Listening on port ' + server.address().port);
});*/
