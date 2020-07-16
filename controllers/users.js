var mongoose = require('mongoose');
var User = mongoose.model('User');
var UserSettings = mongoose.model('User_Settings');
var passport = require('passport');
const md5 = require('md5');
var user = {};
const encodeMD5 = string => md5(string);
var AssignedPublishers = mongoose.model('Assigned_Publisher');
var nodemailer = require('nodemailer');
var Buyer = mongoose.model('Buyer');
var generator = require('generate-password');
var Smtp = mongoose.model('Smtp');
var dataa= {};
	
var transporter = nodemailer.createTransport({
	
  service: 'gmail',
  auth: {
    user: 'no-reply@alivepbx.com',
    pass: 'Denver$1!2'
  }
});

user.uniquePublisher = (req, res, next) => {
	User.find({
		email: req.body.email,
		status: 'active'
	}).then(function (data) {
		if(!data){
			return res.sendStatus(422);
		}
		return res.json({
			statusCode: "200",
			status: 'success',
			message: 'Unique Publisher Check',
			user: data
		});
	}).catch(next);
}

user.getPublishers = (req, res, next) => {
	
	User.find({
        //role: 'publisher',
		role: { $in: ['publisher', 'admin'] },
        status: {
            $ne: 'deleted'
        }
    }).then(function (data) {
        if (!data) {
            return res.sendStatus(422);
        }
		//console.log(data);
        return res.json({
			statusCode: "200",
			status: 'success',
			message: 'Get Publishers',
            user: data
        });
    }).catch(next);

}

user.addPublisher = (req,res,next) => {
	User.find({
		email: req.body.email,
		status: ''
	}).then(function (data) {
		if(data[0]){
			return res.json({
				statusCode: "401",
				status: 'Error',
				message: 'Email Already Exists',
				
			});
		}
		else{
			let user = new User();
			user.username = req.body.email, //req.body.email.split('@')[0]+'@alivepbx.com',
			user.fullname = req.body.fullname,
			user.email = req.body.email,
			user.contact = req.body.contact,
			user.password = encodeMD5(req.body.password),
			user.created_at = Date.now(),
			user.role = req.body.role,
			user.status = "active",
			user.price_per_tfn = req.body.price_per_tfn
			
			user.save().then(data => {
				let userSettings = new UserSettings();
				userSettings.pub_id = data.uid;
				userSettings.save().then(usersettings => { 
				var mailOptions = {
				  from: 'no-reply@alivepbx.com',
				  to: req.body.email,
				  subject: 'Alive Portal Credentials',
				  html: `<!doctype html>
<html lang="en">
  <head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
    <title>Registration Success</title>

<style type="text/css">
  body {
    background-color: #eaffff7d;
  }
  .title {
    background-color: #00304f;
    padding: 20px 15px;
    text-align: center;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    margin-top: 4em;
  }
  .title h3 {
    color: #ffffff;
    font-size: 22px;
  }
  .r_success {
    border: 1px solid #00304f;
    padding: 40px 50px;
    text-align: center;
    background-color: #ffffff;
    box-shadow: 0px 0px 10px #0000004f;
    border-bottom-right-radius: 5px;
    border-bottom-left-radius: 5px;
  }
  .r_success p {
    color: #8a8a8a;
    font-size: 20px;
    font-weight: 400;
    margin-bottom: 2em;
  }
  .r_success img {
    margin-bottom: 3em;
  }
  a.continue {
    background-color: #00304f;
    color: #ffffff;
    padding: 8px 15px;
    font-size: 20px;
    display: block;
    text-decoration: none;
    border-radius: 50px;
  }
</style>

  </head>
  <body>

    <section class="register_success">
      <div class="container">
        <div class="row">
          <div class="col-md-4 offset-md-4">
            <div class="title"><h3>Registration Successfully</h3></div>
            <div class="r_success">
              <p>Your Account has been created</p>
              <img src="https://i.pinimg.com/originals/a1/05/7d/a1057dcb644d8729f4f76b2032f21743.gif" width="100px">
              <br>
              <a href="#" class="continue">Continue</a>
            </div>
          </div>
        </div>
      </div>
    </section>

  </body>
</html>`
				  //text: 'Username: '+req.body.email +'\n'+ 'Password: '+ req.body.password
				};

				transporter.sendMail(mailOptions, function(error, info){
				  if (error) {
					console.log(error);
				  } else {
					console.log('Email sent: ' + info.response);
				  }
				});
					return res.json({
						statusCode: "200",
						status: 'success',
						message: 'User is added successfully',
						data: data
						});

				});
			}).catch(next);
		}
	}).catch(next);
}




user.deletePublisher = (req,res,next) => {
	if(req.params){
		let query ={
			uid: req.params.uid
		},
		update = {
			status: 'deleted',
			isDeleted: true 
		},
		options = {
			upsert: false,
			new: false
		};

		User.findOneAndUpdate(query, update, options).then((data) => {
			return res.json({
				statusCode: "200",
				status: 'success',
				message: 'Role is deleted successfully',
				user: data
			})
		}).catch(next);
		
	}
	else{
		return res.json({
			success: 'NOK'
		});
	}
}

user.getPublisher = (req, res, next) => {
	User.findOne({
		uid: req.params.uid
	}).then(function(data){
		if(!data){
			return res.sendStatus(422);
		}
		return res.json({
			statusCode: "200",
			status: 'success',
			message: 'Publisher Details',
			user: data
		});
	}).catch(next);
}

user.editPublisher = (req, res, next) => {
	if(req.params){
		User.findOne({
			uid: req.params.uid
		}).then(function(user){
			let query = {
				uid: req.params.uid
			},
			update = {
				fullname: req.body.fullname,
				email: req.body.email,
				username: req.body.email,
				password: encodeMD5(req.body.password),
				role: req.body.role,
				contact: req.body.contact,
				price_per_tfn: req.body.price_per_tfn,
				status: req.body.status
			},
			options = {
				upsert: false,
				new: false,
				overwrite: false,
			};
			User.findOneAndUpdate(query, update, options).then(data => {
				return res.json({
					statusCode: "200",
					status: 'success',
					message: 'Publisher is updated successfully',
					user:data
				})
			}).catch(next);
		})
	}
}

user.updatePassword = (req, res, next) => {
	let query = {
		uid: req.params.uid,
		password: encodeMD5(req.body.old_passwd)
	},
	update = {
		password: encodeMD5(req.body.passwd),
	},
	options = {
		upsert: false,
		new: false
	};User.findOneAndUpdate(query,update,options).then((data)=>{
		if(!data){
			return res.json({
				success: 'NOK',
				message: 'Old password is incorrect.'
			});
		}
		console.log(data);
		return res.json({
			//success: 'OK',
			statusCode: "200",
			status: 'success',
			message: 'Password is updated successfully',
			user: data
		});
		
	}).catch(next);
	
}

/*Get publisher's settings*/
user.getPublisherSettings  = (req, res, next) => {
	UserSettings.findOne({
		pub_id: req.params.uid
	}).then(function(data){
		if(!data){
			return res.sendStatus(422);
		}
		return res.json({
			statusCode: "200",
			status: 'success',
			message: 'Publisher Settings Details',
			user: data
		});
	}).catch(next);
}
/* Edit Publisher's Settings */
user.editPublisherSettings = (req, res, next) => {
	if(req.params){
		UserSettings.findOne({
			pub_id: req.params.uid
		}).then(user => {
			if(!user){
				let userSettings = new UserSettings();
				userSettings.pub_id = req.params.uid;
				userSettings.enabled_record = req.body.enabled_record;
				userSettings.daily_tfns = req.body.daily_tfns;
				userSettings.monthly_tfns = req.body.monthly_tfns;
				userSettings.display_cnum = req.body.display_cnum;
				userSettings.display_wallet = req.body.display_wallet;
				userSettings.phone_system = req.body.phone_system;
				userSettings.call_reducer = req.body.call_reducer;
				userSettings.enable_inside_route = req.body.enable_inside_route;
				userSettings.enable_outside_route = req.body.enable_outside_route;
				userSettings.buyer_limit = req.body.buyer_limit;
				userSettings.usage_module = req.body.usage_module;
				userSettings.filtered = req.body.filtered;
				userSettings.number_to_ivr = req.body.number_to_ivr;
				userSettings.show_buyer_no = req.body.show_buyer_no;
				userSettings.hide_campaign = req.body.hide_campaign;
				userSettings.charge_per_minute = req.body.charge_per_minute;
				userSettings.buyer_capping = req.body.buyer_capping;
				userSettings.buyernumber_cdr = req.body.buyernumber_cdr;
				userSettings.save().then(usersettings => {
					return res.json({settings: usersettings});
				})
			}else{
				let query = {
					pub_id: req.params.uid
				},
				update = {
					enabled_record: req.body.enabled_record,
					daily_tfns: req.body.daily_tfns,
					monthly_tfns: req.body.monthly_tfns,
					display_cnum: req.body.display_cnum,
					display_wallet: req.body.display_wallet,
					phone_system: req.body.phone_system,
					call_reducer: req.body.call_reducer,
					enable_inside_route: req.body.enable_inside_route,
					enable_outside_route: req.body.enable_outside_route,
					buyer_limit: req.body.buyer_limit,
					usage_module: req.body.usage_module,
					filtered: req.body.filtered,
					number_to_ivr: req.body.number_to_ivr,
					show_buyer_no: req.body.show_buyer_no,
					hide_campaign: req.body.hide_campaign,
					charge_per_minute: req.body.charge_per_minute,
					buyer_capping: req.body.buyer_capping,
					buyernumber_cdr: req.body.buyernumber_cdr
				},
				options = {
					upsert: false,
					new: true
				};
				UserSettings.findOneAndUpdate(query, update, options).then(data => {
                    return res.json({
						statusCode: "200",
						status: 'success',
						message: 'Publisher Settings updated successfully',
                        settings: data
                    });
                }).catch(next);
				
			}
		})
	}
}
user.getAuditers = (req, res, next) => {

    User.find({
        role: 'audit_profile',
        status: {
            $ne: 'deleted'
        }
    }).then(data => {
        if (!data) {
            return res.sendStatus(422);
        }

        return res.json({
			statusCode: "200",
			status: 'success',
			message: 'Auditors Details',
            user: data
        });
    }).catch(next);
}

user.deleteAuditer = (req, res, next) => {
    if (req.params) {
        User.findOne({
            uid: req.params.uid,
            role: 'audit_profile'
        }).then(user => {
            if (!user) {
                return res.json({
                    profile: req.profile.toProfileJSONFor(false)
                });
            } else {
                AssignedPublishers.deleteMany({
                    audit_profile_id: req.params.uid
                }).then(data => {
                    if (data) {
                        user.remove();
                        res.json({
							statusCode: "200",
							status: 'success',
							message: 'Audit profile deleted successfully.',
                        });
                    }
                }).catch(next);
            }
        }).catch(next);
    } else {
        return res.json({
            profile: req.profile.toProfileJSONFor(false)
        });
    }
}
user.addAssignedPublisher = (req, res, next) => {

    let arr = [];
    AssignedPublishers.remove({
        audit_profile_id: req.body.audit_profile_id
    }).then(data2 => {

        req.body.pub_id.forEach(pubId => {
            AssignedPublishers.find({
                audit_profile_id: req.body.audit_profile_id
            }).then(data => {

                let assigned_publisher = new AssignedPublishers();
                assigned_publisher.pub_id = pubId;
                assigned_publisher.audit_profile_id = req.body.audit_profile_id;

                assigned_publisher.save().then(data => { 
                    arr.push(data);
                    if (!data) {
                        return res.sendStatus(422);
                    }

                }).catch(next);
            }).catch(next);
        });


    }).catch(err => {
        console.log(err)
    });
    res.json({
        statusCode: "200",
		status: 'success',
		message: 'Publishers Assigned successfully.',
    });
}
user.getAssignedPublishers = (req, res, next) => {

    let arr = [];

    function pushAssignedUsers(value) {

        return new Promise((resolve, reject) => {

            User.findOne({
                uid: value.pub_id
            }).then(response => {

                if (response != null) {

                    let ob = {};
                    ob.status = value.status;
                    ob.pub_id = value.pub_id;
                    ob.audit_profile_id = value.audit_profile_id;
                    ob.fullname = response.fullname;
                    resolve(ob);
                }
            }).catch(err => {
                reject(err);
            });
        });


    };
    AssignedPublishers.find({
        audit_profile_id: req.params.audit_profile_id
    }).then(async data => {

        if (!data) {
            return res.sendStatus(422);
        }

        for (let i = 0; i < data.length; i++) {
            const newObj = await pushAssignedUsers(data[i]);
            arr.push(newObj);

        }
        return res.json({
	        statusCode: "200",
			status: 'success',
			message: 'Assigned Publishers to Audit Profile',
            user: arr
        });
    }).catch(next);
}

user.inactivePublisher = (req, res, next) => {
	if(req.params){
		User.findOne({
			uid: req.params.uid
		}).then(function(user){
			let query = {
				uid: req.params.uid
			},
			update = {
				status: req.body.status
			},
			options = {
				upsert: false,
				new: false,
				overwrite: false,
			};
			User.findOneAndUpdate(query, update, options).then(data => {
				return res.json({
					statusCode: "200",
					status: 'success',
					message: 'Publisher is updated successfully',
					user:data
				})
			}).catch(next);
		})
	}
}
user.forgotPassword = (req, res, next) => {
		console.log(req.body);
		if(req.body.role == 'publisher' || req.body.role == 'admin'){
			let query = {
			email: req.body.email,
			role: req.body.role
		},
		update = {
			password: encodeMD5(req.body.passwd),
		},
		options = {
			upsert: false,
			new: false
		};
		User.findOneAndUpdate(query,update,options).then((data)=>{
			if(!data){
				return res.json({
					success: 'NOK',
					message: 'Email is not correct'
				});
			}
			if(data){
				
				var mailOptions = {
					  from: 'no-reply@alivepbx.com',
					  to: req.body.email,
					  subject: 'Alive Portal Credentials',
					  text: 'Username: '+req.body.email +'\n'+ 'Password: '+ req.body.passwd
				};

				transporter.sendMail(mailOptions, function(error, info){
					  if (error) {
						console.log(error);
					  } else {
						console.log('Email sent: ' + info.response);
					  }
				});
			}
			return res.json({
				
				//success: 'OK',
				statusCode: "200",
				status: 'success',
				message: 'Password is updated successfully'
			//	user: data
			});
			
		}).catch(next);
	}
	else if(req.body.role == 'buyer'){
		let query = {
			email: req.body.email,
			role: req.body.role
		},
		update = {
			password: encodeMD5(req.body.passwd),
		},
		options = {
			upsert: false,
			new: false
		};
		Buyer.findOneAndUpdate(query,update,options).then((data)=>{
			if(!data){
				return res.json({
					success: 'NOK',
					message: 'Old password is incorrect.'
				});
			}
			if(data){
				var mailOptions = {
					  from: 'no-reply@alivepbx.com',
					  to: req.body.email,
					  subject: 'Alive Portal Credentials',
					  text: 'Username: '+req.body.email +'\n'+ 'Password: '+ req.body.passwd
				};

				transporter.sendMail(mailOptions, function(error, info){
					  if (error) {
						console.log(error);
					  } else {
						console.log('Email sent: ' + info.response);
					  }
				});
			}
			return res.json({
				//success: 'OK',
				statusCode: "200",
				status: 'success',
				message: 'Password is updated successfully'
				//user: data
			});
			
		}).catch(next);
	}
}

user.recoveryPassword = (req, res, next) => {
		var passwd = generator.generate({
			length: 10,
			numbers: true
		});
		console.log(req.body);
		
		if(req.body.role == 'publisher' || req.body.role == 'admin'){
			let query = {
			email: req.body.email,
			role: req.body.role
		},
		update = {
			password: encodeMD5(passwd),
		},
		options = {
			upsert: false,
			new: false
		};
		User.findOneAndUpdate(query,update,options).then((data)=>{
			if(!data){
				return res.json({
					success: 'NOK',
					message: 'Email is not correct'
				});
			}
			if(data){
				
				var mailOptions = {
					  from: 'no-reply@alivepbx.com',
					  to: req.body.email,
					  subject: 'Alive Portal Recovery Password',
					  html: `<!doctype html>
<html lang="en">
  <head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
    
<style type="text/css">
  body {
    background-color: #eaffff7d;
  }
  .title {
    background-color: #00304f;
    padding: 20px 15px;
    text-align: center;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    margin-top: 4em;
  }
  .title h3 {
    color: #ffffff;
    font-size: 22px;
  }
  .r_success {
    border: 1px solid #00304f;
    padding: 40px 50px;
    text-align: center;
    background-color: #ffffff;
    box-shadow: 0px 0px 10px #0000004f;
    border-bottom-right-radius: 5px;
    border-bottom-left-radius: 5px;
  }
  .r_success p {
    color: #8a8a8a;
    font-size: 20px;
    font-weight: 400;
    margin-bottom: 2em;
  }
  .r_success img {
    margin-bottom: 3em;
  }
  a.continue {
    background-color: #00304f;
    color: #ffffff;
    padding: 8px 15px;
    font-size: 20px;
    display: block;
    text-decoration: none;
    border-radius: 50px;
  }
</style>

  </head>
  <body>

    <section class="register_success">
      <div class="container">
        <div class="row">
          <div class="col-md-4 offset-md-4">
            <div class="title"><h3>Password Updated Successfully</h3></div>
            <div class="r_success">
              <p>Your Password has been updated</p>
              <img src="https://i.pinimg.com/originals/a1/05/7d/a1057dcb644d8729f4f76b2032f21743.gif" width="100px">
              <br>
              <b>Username: `+req.body.email+`</b>
			  <br />
			  <b>Password: `+passwd+`</b>
            </div>
          </div>
        </div>
      </div>
    </section>

  </body>
</html>`
					  //text: 'Username: '+req.body.email +'\n'+ 'Password: '+ passwd
				};

				transporter.sendMail(mailOptions, function(error, info){
					  if (error) {
						console.log(error);
					  } else {
						console.log('Email sent: ' + info.response);
					  }
				});
			}
			return res.json({
				
				//success: 'OK',
				statusCode: "200",
				status: 'success',
				message: 'Password is updated successfully'
			//	user: data
			});
			
		}).catch(next);
	}
	else if(req.body.role == 'buyer'){
		let query = {
			email: req.body.email,
			role: req.body.role
		},
		update = {
			password: encodeMD5(passwd),
		},
		options = {
			upsert: false,
			new: false
		};
		Buyer.findOneAndUpdate(query,update,options).then((data)=>{
			if(!data){
				return res.json({
					success: 'NOK',
					message: 'Old password is incorrect.'
				});
			}
			if(data){
				var mailOptions = {
					  from: 'no-reply@alivepbx.com',
					  to: req.body.email,
					  subject: 'Alive Portal Recovery Password',
					  html: `<!doctype html>
<html lang="en">
  <head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
    

<style type="text/css">
  body {
    background-color: #eaffff7d;
  }
  .title {
    background-color: #00304f;
    padding: 20px 15px;
    text-align: center;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    margin-top: 4em;
  }
  .title h3 {
    color: #ffffff;
    font-size: 22px;
  }
  .r_success {
    border: 1px solid #00304f;
    padding: 40px 50px;
    text-align: center;
    background-color: #ffffff;
    box-shadow: 0px 0px 10px #0000004f;
    border-bottom-right-radius: 5px;
    border-bottom-left-radius: 5px;
  }
  .r_success p {
    color: #8a8a8a;
    font-size: 20px;
    font-weight: 400;
    margin-bottom: 2em;
  }
  .r_success img {
    margin-bottom: 3em;
  }
  a.continue {
    background-color: #00304f;
    color: #ffffff;
    padding: 8px 15px;
    font-size: 20px;
    display: block;
    text-decoration: none;
    border-radius: 50px;
  }
</style>

  </head>
  <body>

    <section class="register_success">
      <div class="container">
        <div class="row">
          <div class="col-md-4 offset-md-4">
            <div class="title"><h3>Password Recovered Successfully</h3></div>
            <div class="r_success">
              <p>Your Password has been updated</p>
              <img src="https://i.pinimg.com/originals/a1/05/7d/a1057dcb644d8729f4f76b2032f21743.gif" width="100px">
              <br>
              <b>Username: `+req.body.email+`</b>
			  <br />
			  <b>Password: `+passwd+`</b>
            </div>
          </div>
        </div>
      </div>
    </section>

  </body>
</html>`
					  //text: 'Username: '+req.body.email +'\n'+ 'Password: '+ passwd
				};

				transporter.sendMail(mailOptions, function(error, info){
					  if (error) {
						console.log(error);
					  } else {
						console.log('Email sent: ' + info.response);
					  }
				});
			}
			return res.json({
				//success: 'OK',
				statusCode: "200",
				status: 'success',
				message: 'Password is updated successfully'
				//user: data
			});
			
		}).catch(next);
	}
}
module.exports = user;