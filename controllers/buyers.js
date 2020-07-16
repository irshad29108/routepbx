var mongoose = require('mongoose');
var Buyer = mongoose.model('Buyer');
var buyer = {};
const md5 = require('md5');
const encodeMD5 = string => md5(string);
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'alivenet001@gmail.com',
    pass: '@alivenet001Irshad'
  }
});

buyer.getBuyerrs = (req, res, next) => {

    let queryObj = {};

    if (req.params.pub_id) {
        queryObj = { pub_id: req.params.pub_id }
    }


    Buyer.find(queryObj).then(function (data) {
        if (!data) { return res.sendStatus(422); }

        return res.json({
		statusCode: "200",
		status: 'success',
		message: 'Buyers',			
		buyer: data
		});
    }).catch(next);
}

buyer.getBuyers = (req, res, next) => {
		let query = {};
	if(req.params.pub_id){
		query = {
			pub_id: parseInt(req.params.pub_id),			
		}
	}
	let aggregateData = [{
		$match: query
	},
	{
		$lookup: {
			from: "users",
			localField: "pub_id",
			foreignField: "uid",
			as: "userdata"
		}
	},
	{
		$project: {
			name: 1,
            contact: 1,
            price_per_call: 1,
            status: 1,
            role: 1,
            buffer_time: 1,
            pub_id: 1,
            created_at: 1,
            address: 1,
            email: 1,
            password: 1,
            buyer_id: 1,
			publisherName: {
				$arrayElemAt: ["$userdata.fullname", 0]
			}
		}
	}
	];
	Buyer.aggregate(aggregateData)
	.then(data => {
		if(!data){
			//return res.sendStatus(422);
			return res.json({statusCode:100,status: 'error',message: 'Error Occurred'});
		}
		return res.json({
			//success: "OK",
			statusCode: "200",
			status: 'success',
			message: 'Get All Buyers',	
			buyers: data
		});
	})
	.catch(next);
};

buyer.getBuyer = (req, res, next) => {

    Buyer.findOne({ buyer_id: req.params.buyerid }).then(data => {
        if (!data) { return res.sendStatus(422); }

        return res.json({ 
		statusCode: "200",
		status: 'success',
		message: 'Buyer Detail',		
		buyer: data
		});
    }).catch(next);
}
buyer.addBuyer = (req, res, next) => {

    /*let buyer = new Buyer();

		buyer.pub_id = req.body.pub_id,
        buyer.address = req.body.address,
        buyer.name = req.body.name,
        buyer.email = req.body.email,
        buyer.contact = req.body.contact,
        buyer.password = encodeMD5(req.body.password),
        buyer.created_at = Date.now(),
        buyer.status = "active",
        buyer.role = "buyer",
        buyer.price_per_call = req.body.price_per_call,
        buyer.buffer_time = req.body.buffer_time
    buyer.save().then(data => { 

        return res.json({
			statusCode: "200",
			status: 'success',
			message: 'Buyer Added Successfully',
			buyer: data
			});
    }).catch(next);*/
	Buyer.find({
			email: req.body.email
		}).then(function (data) {
			
			if(data[0]){
				
				return res.json({
				statusCode: "401",
				status: 'Error',
				message: 'Buyer Already Exists',
				
			});
			}
			else{
				let buyer = new Buyer();
				buyer.pub_id = req.body.pub_id,
				buyer.address = req.body.address,
				buyer.name = req.body.name,
				buyer.email = req.body.email,
				buyer.contact = req.body.contact,
				buyer.password = encodeMD5(req.body.password),
				buyer.created_at = Date.now(),
				buyer.status = "active",
				buyer.role = "buyer",
				buyer.price_per_call = req.body.price_per_call,
				buyer.buffer_time = req.body.buffer_time
				buyer.save().then(data => { 
				var mailOptions = {
				  from: 'alivenet001@gmail.com',
				  to: req.body.email,//'alivenet001@gmail.com',
				  subject: 'Alive Portal Credentials',
				  text: 'Username: '+req.body.email +'\n'+ 'Password: '+ req.body.password
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
						message: 'Buyer Added Successfully',
						buyer: data
						});
				}).catch(next);	
			}
	
		}).catch(next);
}

buyer.editBuyer = (req, res, next) => {
    if (req.params) {
        Buyer.findOne({ buyer_id: req.params.buyerid }).then(buyer => {
            if (!buyer) {
                return res.json({ profile: req.profile.toProfileJSONFor(false) });

            } else {

                let query = {
                    buyer_id: req.params.buyerid
                },
                    update = {
                        pub_id: req.body.pub_id,
                        name: req.body.name,
                        email: req.body.email,
                        contact: req.body.contact,
                        price_per_call: req.body.price_per_call,
						role: 'buyer',
						password: encodeMD5(req.body.password),
                        buffer_time: req.body.buffer_time,
                        address: req.body.address
                    },
                    options = {
                        upsert: false,
                        new: true
                    };
               /* if (req.body.password) {
                    update.password = encodeMD5(req.body.password);
                }*/

                Buyer.findOneAndUpdate(query, update, options).then(data => {

                    return res.json({ 
					statusCode: "200",
					status: 'success',
					message: 'Buyer Updated Successfully',
					buyer: data
					});

                }).catch(next);
            }
        });
    } else {
        return res.json({ profile: req.profile.toProfileJSONFor(false) });
    }
}
buyer.inactiveBuyer = (req, res, next) => {
    if (req.params) {
        Buyer.findOne({ buyer_id: req.params.buyerid }).then(buyer => {
            if (!buyer) {
                return res.json({ profile: req.profile.toProfileJSONFor(false) });

            } else {

                let query = {
                    buyer_id: req.params.buyerid
                },
                    update = {
                        status: req.body.status
                    },
                    options = {
                        upsert: false,
                        new: true
                    };
                Buyer.findOneAndUpdate(query, update, options).then(data => {

                    return res.json({ 
					statusCode: "200",
					status: 'success',
					message: 'Buyer Updated Successfully',
					buyer: data
					});

                }).catch(next);
            }
        });
    } else {
        return res.json({ profile: req.profile.toProfileJSONFor(false) });
    }
}
buyer.deleteBuyer = (req, res, next) => {

    Buyer.deleteOne({ buyer_id: req.params.buyerid }).then(data => {

        if (!data) { return res.sendStatus(422); }

        return res.json({ 
		//statusCode: 200, 
		statusCode: "200",
		status: 'success',
		message: "Buyer deleted successfully!"
		});

    }).catch(next);
}
buyer.updatePassword = (req, res, next) => {
	let query = {
		buyer_id: req.params.bid,
		password: encodeMD5(req.body.old_passwd)
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
		return res.json({
			//success: 'OK',
			statusCode: "200",
			status: 'success',
			message: 'Password is updated successfully',
			user: data
		});
		
	}).catch(next);
	
}
module.exports = buyer;
