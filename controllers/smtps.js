var mongoose = require('mongoose');
var Smtp = mongoose.model('Smtp');
var smtp = {};
const md5 = require('md5');
const encodeMD5 = string => md5(string);
var nodemailer = require('nodemailer');

smtp.updateSmtp = (req, res, next) => {
    if (req.params) {
        Smtp.findOne({ smtpid: req.params.smtpid }).then(smtp => {
			let query = {
				smtpid: req.params.smtpid
			},
				update = {
					driver: req.body.driver,
					host: req.body.host,
					port: req.body.port,
					username: req.body.username,
					password: req.body.password,
					db_time: req.body.db_time
				},
				options = {
					upsert: false,
					new: true
				};
		   

			Smtp.findOneAndUpdate(query, update, options).then(data => {

				return res.json({ 
				statusCode: "200",
				status: 'success',
				message: 'Smtp Settings Updated Successfully',
				smtp: data
				});

			}).catch(next);
        });
    } 
}

smtp.getSmtp = (req, res, next) => {

    Smtp.find({}).then(data => {
        if (!data) { return res.sendStatus(422); }

        return res.json({ 
		statusCode: "200",
		status: 'success',
		message: 'SMTP Detail',		
		smtp: data[0]!== 'undefined'?data[0]:data
		});
    }).catch(next);
}
module.exports = smtp;
