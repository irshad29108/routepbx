var mongoose = require('mongoose');
var Tfn = mongoose.model('Tfn');
var User = mongoose.model('User');
var UserSettings = mongoose.model('User_Settings');
 
var tfn = {};

tfn.getAllTfns = (req, res, next) => {
		
    const aggregateObj = [

        {
            $match: { status: { $ne: 'inactive' } }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'pub_id',
                foreignField: 'uid',
                as: 'userdata'
            }
        },
        {
            $project:
            {

                "tfn_id": 1,
                "tfn": 1,
                "pub_id": 1,
                "status": 1,
                "price_per_tfn": 1,
                "purchase_date": 1,
                publisherName: { $arrayElemAt: ["$userdata.fullname", 0] }
            }

        }

    ];

    Tfn.aggregate(aggregateObj).then(data => {
        if (!data) {
            return res.sendStatus(422);
        }
        return res.json({ 
		statusCode: "200",
		status: 'success',
		message: 'All TFNs',
		tfn: data
		});
    }).catch(next);
	
}

tfn.addTfn = async (req, res, next) => {

    function addTfns(value, check) {
        return new Promise((resolve, reject) => {
			
            let tfn = new Tfn();
            tfn.tfn = value;
            tfn.price_per_tfn = req.body.price_per_tfn || 0;
            tfn.status = req.body.status || "available";
            tfn.pub_id = req.body.pub_id || 0;
            tfn.save().then(data => {

                if (!data) { return res.sendStatus(422); }
                if (check) {
                    console.log('call after all tfns added on both sides');
                }
                resolve(data);
            }).catch(next);

        }).catch(err => {
            reject(err);
        });

    }

    function checkTfns(value, check) {

        return new Promise((resolve, reject) => {

            Tfn.findOne({ tfn: value }).then(async response => {

                if (response == null) {

                    const newObj = await addTfns(value, check);
                    if (newObj == null) { return res.sendStatus(422); }
                    resolve(newObj);
                } else {
                    resolve(response);
                }
            }).catch(err => {
                reject(err);
            });

        });


    };
	//checkTfns(req.body.tfn, true);
    for (let i = 0; i < req.body.tfn.length; i++) {
        let check = false;
        if (i === (req.body.tfn.length - 1)) {
            check = true;
        }
        const newObj = await checkTfns(req.body.tfn[i], check);
        if (newObj == null) { return res.sendStatus(422); }

    }
    return res.json({ 
		//success: 'OK'
		statusCode: "200",
		status: 'success',
		message: 'TFNs is added successfully',
	});
}
tfn.getTfnn = async (req, res, next) => {
	let query = {};
    if (req.params.pub_id) {
        query = { pub_id: req.params.pub_id, status: { $ne: 'inactive' } };
    } else if (req.params.id) {
        query = { _id: mongoose.Types.ObjectId(req.params.id) };
    } else {
        query = { tfn: req.params.tfn, status: { $ne: 'inactive' } };
    }
	
    Tfn.find(query).then(data => {

        if (!data) { return res.sendStatus(422); }

        return res.json({ 
			statusCode: "200",
			status: 'success',
			message: 'TFN Details',
			tfn: data
		});
    }).catch(next);
}
tfn.getTfn = async (req, res, next) => {
	let query = {};
    if (req.params.pub_id) {
        query = { pub_id: req.params.pub_id, status: { $ne: 'inactive' } };
    } else if (req.params.id) {
        query = { _id: mongoose.Types.ObjectId(req.params.id) };
    } else {
        query = { tfn: req.params.tfn, status: { $ne: 'inactive' } };
    }
	const arrayToObject = (array) =>
	array.reduce((obj, item) => {
		obj[item.id] = item
		 return obj
		 console.log(obj);
		
	})
    Tfn.find(query).then(data => {

        if (!data) { return res.sendStatus(422); }

        return res.json({ 
			statusCode: "200",
			status: 'success',
			message: 'TFN Details',
			tfn: arrayToObject(data) //data
		});
    }).catch(next);
}

tfn.getAvailableTfn = (req, res, next) => {
	 Tfn.find({ status: 'available' }).then(data => {
        if (!data) { return res.sendStatus(422); }
        return res.json({ 
			statusCode: "200",
			status: 'success',
			message: 'Available TFNs',
			tfn: data
		});
    }).catch(next);
}

tfn.getPendingTfns = (req, res, next) => {
	const aggregateObj = [

        {
            $match: { status: 'pending' }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'pub_id',
                foreignField: 'uid',
                as: 'userdata'
            }
        },
        { $sort: { purchase_date: -1 } },
        {
            $project:
            {

                "tfn_id": 1,
                "tfn": 1,
                "pub_id": 1,
                "status": 1,
                "price_per_tfn": 1,
                "purchase_date": 1,
                publisherName: { $arrayElemAt: ["$userdata.fullname", 0] }
            }

        }

    ];

    Tfn.aggregate(aggregateObj).then(data => {
        if (!data) {
            return res.sendStatus(422);
        }
        return res.json({ 
			statusCode: "200",
			status: 'success',
			message: 'Pending TFNs',
			tfn: data
		});
    }).catch(next);
}

tfn.deleteTfn = (req, res, next) => {
	Tfn.findById(req.params.id).then(async (data) => {
        if (!data) { return res.sendStatus(422); }
        data.remove();
        return res.json({ 
		//success: 'OK', 
		statusCode: "200",
		status: 'success',
		message: "TFN is permanently deleted successfully!"
		});
    }).catch(next);
}


tfn.freepbxTfn = (req, res, next) => {
	
	let str =  { $or: [ { tfn: req.query.tfn }, { tfn: '+'+req.query.tfn } ] };
		
        const aggregateObj = [
            {
                $match: str
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'pub_id',
                    foreignField: 'uid',
                    as: 'userdata'
                }
            },
            {
                $lookup: {
                    from: 'camp_pub_tfns',
                    localField: 'tfn',
                    foreignField: 'tfn',
                    as: 'camp_pub_data'
                }
            },
            { '$lookup': { from: 'campaigns', localField: 'camp_pub_data.camp_id', foreignField: 'campaign_id', as: 'campaigndata' } }, 
            /*{
                $unwind: "$camp_pub_data"
            },*/
            {
                $lookup: {
                    from: 'camp_buyer_tfns',
                    localField: 'camp_pub_data.camp_id',
                    foreignField: 'camp_id',
                    as: 'camp_buyer_data'
                }
            },
            {
                $lookup: {
                    from: 'user_settings',
                    localField: 'pub_id',
                    foreignField: 'pub_id',
                    as: 'user_settings'
                }
            },
            {
                $project:
                {
                    tfn: 1,
                    pub_id: 1,
                    status: 1,
                    //"price_per_tfn": 1,
                    charge_per_minute:1,
                    publisherName: { $arrayElemAt: ["$userdata.fullname", 0] },
                    publisherSettings: { $arrayElemAt: ["$user_settings", 0] },
                    pub_price_per_tfn: { $arrayElemAt: ["$userdata.price_per_tfn", 0] },
                    camp_id: "$camp_pub_data.camp_id",
                    buyerData: "$camp_buyer_data",
                    campaigndata: { '$arrayElemAt': [ '$campaigndata', 0 ] }
                }

            }
        ];


        return Tfn.aggregate(aggregateObj).then(data => {
            if (!data) {
                return res.sendStatus(422);
            }
			//console.log(data);
			return res.json({ 
			statusCode: "200",
			status: 'success',
			message: data
			});


        }).catch((err) => {
			console.log(err);
            return { err: err };

        });
}

tfn.updateStatus = (req, res, next) => {
	req.body.tfn.forEach((tfn, index) => {
		const options = {
			new: false,
			upsert: false
		};
		const query = {
			tfn: tfn, //req.body.tfn,
			
		};
		Tfn.findOneAndUpdate(query, {
			status: req.body.status,
			
		}, options).then(data2 => {
			console.log("TFN updated successfully");
			return res.json({ 
			statusCode: "200",
			status: 'success',
			message: 'TFN status updated successfully'
			});
		}).catch(next);
	})
	
}
tfn.deleteTfns = (req, res, next) => {
	
	for (let i = 0; i < req.body.tfn.length; i++) {
		Tfn.remove({tfn: req.body.tfn[i]}).then(async (data) => {
			if (!data) { return res.sendStatus(422); }
			return res.json({ 
			//success: 'OK', 
			statusCode: "200",
			status: 'success',
			message: "TFN is permanently deleted successfully!"
			});
		}).catch(next);

    }
    
	
}
module.exports = tfn;