var mongoose = require('mongoose');
var BuyerNumber = mongoose.model('Buyer_Number');
var buyerNumbers = {};

buyerNumbers.addBuyerNumber = async (req, res, next) => {
    function checkNumber(number) {
        return new Promise((resolve, reject) => {
            BuyerNumber.find({ number: number }, (err, d) => {
                if (err) { reject(err); }
                resolve(d.length);
            });
        });
    }
    if (req.body) {
        const t = await checkNumber(req.body.number);
		
        if (t) {
           // return res.json({ success: 'NOK', message: 'Number already exists.' });
		   return res.json({statusCode:100,status: 'error',message: 'Number already exists.'})
        } else {
            let buyerNumber = new BuyerNumber();
            buyerNumber.buyer_id = req.body.buyer_id;
            buyerNumber.number = req.body.number;
			buyerNumber.capping = req.body.capping;
            buyerNumber.save().then(data => { 

                if (!data) {
                    return res.sendStatus(422)
                }
                return res.json({
					statusCode: "200",
					status: 'success',
					message: 'Buyer Number Added Successfully',
                    buyerNumber: data
                });

            }).catch(next);
        }
    }
}

buyerNumbers.getAllBuyerNumbers = (req, res, next) => {

    let query = {};

    if (req.params.buyerId) {

        query = {
            buyer_id: req.params.buyerId
        };
    } else {
        query = {};
    }

    BuyerNumber.find(query).then(data => {

        if (!data) {
            return res.sendStatus(422);
        }

        return res.json({
			statusCode: "200",
			status: 'success',
			message: 'Buyer Numbers',
            buyerNumber: data
        });
    }).catch(next);

}

buyerNumbers.deleteBuyerNumber = (req, res, next) => {

    BuyerNumber.findByIdAndRemove({
        _id: mongoose.Types.ObjectId(req.params.id)
    }).then(data => {
        if (!data) {
            return res.sendStatus(422);
        }

        return res.json({
            //success: 'OK',
			statusCode: "200",
			status: 'success',
            message: 'Buyer Number removed successfully'
        });

    }).catch(next);

}

buyerNumbers.updateBuyerNumber = (req, res, next) => {

    let updateObj = {};

    if (req.body.status) {
        updateObj.status = req.body.status;
    }
    const query = {
        _id: mongoose.Types.ObjectId(req.params.id)
    },
        update = {
            $set: updateObj
        },
        options = {
            new: true,
            upsert: false
        }

    BuyerNumber.findByIdAndUpdate(query, update, options).then(data => {

        if (!data) {
            return res.sendStatus(422);
        }

        return res.json({
			statusCode: "200",
			status: 'success',
			message: 'Buyer Number Updated Successfully',	
            data: data
        });
    }).catch(next);

}
buyerNumbers.getBuyerDetails = (req, res, next) => {

    let paramsObj = {};

    if (req.query.number) {
        paramsObj.number = req.query.number;
    }
	
	console.log(paramsObj);
    BuyerNumber.aggregate([
        {

            $match: paramsObj

        },
        {
            $lookup: {
                from: 'buyers',
                localField: 'buyer_id',
                foreignField: 'buyer_id',
                as: 'buyerdata'
            }
        },
        {
            $unwind: "$buyerdata"
        },
        {
            $project: {
                "buyer_id": 1,
                "status": 1,
                "limit": 1,
                "buyer_finance": 1,
                "capping": 1,
                "cdr": 1,
                "monitoring": 1,
                "dups": 1,
                "start": 1,
                "end": 1,
                "queue": 1,
                "realtime": 1,
                "name": "$buyerdata.name",
                "password": "$buyerdata.password",
                "email": "$buyerdata.email",
                "contact": "$buyerdata.contact",
                "address": "$buyerdata.address",
                "price_per_call": "$buyerdata.price_per_call",
                "status": "$buyerdata.status",
                "created_at": "$buyerdata.created_at",
                "buffer_time": "$buyerdata.buffer_time",
                "pub_id": "$buyerdata.pub_id"

            }
        }
    ]).then(data => {

        if (!data) { return res.sendStatus(422); }

        return res.json({ buyer: data });
    }).catch(next);
}

module.exports = buyerNumbers;