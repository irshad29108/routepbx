//var router = require('express').Router();
const users = require('../../controllers/users');
const buyers = require('../../controllers/buyers');
var passport = require('passport');
//router.get('/publisher/getPublishers', users.getPublishers);
var auth = require('../auth');

module.exports = (app) => {
	app.post('/user/login',function(req, res, next){
		var output = {success: 'NOK'};
		if(req.body.username == ''){
			output = {errors: "Username cann't be blank"};
			return res.json(output);
		}
		if(req.body.password == ''){
			output = {errors: "Password cann't be blank"};
			return res.json(output);
		}
		
		passport.authenticate('local',{session: false}, function(err, user, info){
			//console.log(err, user, info, "users");
			if(err){ return next(err); }
			if(user){
				console.log(user);
				output = {success: 'OK', user: user, login_token: user.generateJWT() };
				return res.json(output);
			} else {
				return res.json(info);
			}
		})(req, res, next);
		
		
		//authentication using node js pending 
	});
	/* Publisher's APIs */
	app.use(require('../token'));
	app.post('/uniquePublisher', users.uniquePublisher);
    app.get('/publisher/getPublishers', auth.required, users.getPublishers);
	app.post('/publisher', auth.required, users.addPublisher);
	app.post('/audituser', auth.required, users.addPublisher);
	app.delete('/publisher/deletePublisher/:uid', auth.required, users.deletePublisher);
	app.get('/publisher/getPublisher/:uid', auth.required, users.getPublisher);
	app.post('/publisher/:uid', auth.required, users.editPublisher);
	app.post('/publisher/status/:uid', auth.required, users.inactivePublisher);
	app.put('/user/updatePassword/:uid', auth.required, users.updatePassword);
	app.post('/user/forgotPassword', users.forgotPassword);
	app.post('/user/recoveryPassword', users.recoveryPassword);
	/* Publisher Settings API */
	
	app.get('/publisher/getPublisherSettings/:uid', auth.required, users.getPublisherSettings);
	app.put('/publisher/editPublisherSettings/:uid', auth.required, users.editPublisherSettings);
	/*audit profile*/
	app.get('/auditers', auth.required, users.getAuditers);
	app.get('/auditor/getAuditor/:uid', auth.required, users.getPublisher);
	app.delete('/deleteAuditer/:uid', auth.required, users.deleteAuditer);
	app.post('/assignPublisher', users.addAssignedPublisher);
	app.get('/publisher/getAssignedPublisher/:audit_profile_id', users.getAssignedPublishers);
}