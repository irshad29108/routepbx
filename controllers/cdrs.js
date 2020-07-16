var mongoose = require('mongoose');
var Cdr = mongoose.model('Cdr');
var moment = require('moment');
var async = require('async');
var request = require('request').defaults({
    strictSSL: false,
    rejectUnauthorized: false
 });
 
var cdr = {};

cdr.getAllCdrs = (req, res, next) => {

    let str = {
        did: {
            $ne: ''
        }        
    };

    if (req.params.sdate == undefined && req.params.edate == undefined) {

        const current = new Date();
        ssdate = moment(current).format("YYYY-MM-DD 00:00:00");
        eedate = moment(current).format("YYYY-MM-DD 23:59:59");
        str.start = {
            $gte: ssdate,
            $lte: eedate
        };
    } else if (req.params.sdate == "" && req.params.edate == "") {
        const current = new Date();
        ssdate = moment(current).format("YYYY-MM-DD 00:00:00");
        eedate = moment(current).format("YYYY-MM-DD 23:59:59");
        str.start = {
            $gte: ssdate,
            $lte: eedate
        };
    } else {
        sdat = parseInt(req.params.sdate);
        sdate = new Date(sdat);
        ssdate = moment(sdate).utcOffset('+0530').format("YYYY-MM-DD 00:00:00");
        edat = parseInt(req.params.edate);
        edate = new Date(edat);
        eedate = moment(edate).utcOffset('+0530').format("YYYY-MM-DD 23:59:59");
        str.start = {
            $gte: ssdate,
            $lte: eedate
        };
    }
	if (req.query.pub_id) {
        str.pub_id = parseInt(req.query.pub_id);
    }
	if(req.query.buyerNumber){
		delete str.did;
		//str.buyer_id = req.query.buyerNumber;
		//str.dst = req.query.buyerNumber;
		str.dst = {
			$in: JSON.parse(req.query.buyerNumber)
		}
	}
    Cdr.aggregate([{
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
            from: 'buyers',
            localField: 'buyer_id',
            foreignField: 'buyer_id',
            as: 'buyerdata'
        }
    },
	{
        $lookup: {
            from: 'campaigns',
            localField: 'camp_id',
            foreignField: 'campaign_id',
            as: 'campdata'
        }
    },
    {
        $project: {
            "clid": 1,
            "src": 1,
            "dst": 1,
            "dcontext": 1,
            "channel": 1,
            "dstchannel": 1,
            "lastapp": 1,
            "lastdata": 1,
            "start": 1,
            "answer": 1,
            "end": 1,
            "duration": 1,
            "billsec": 1,
            "disposition": 1,
            "amaflags": 1,
            "accountcode": 1,
            "uniqueid": 1,
            "userfield": 1,
            "sequence": 1,
            "did": 1,
            "pub_id": 1,
            "camp_id": 1,
            "buyer_id": 1,
            "price_per_tfn": 1,
            "call_reducer": 1,
            "count": 1,
            "status": 1,
            "recordingfile": 1,
			"publisherName": 1,
			"camp_name": 1,
			"buffer_time": 1,
			"price_per_call": 1,
			/*"publisherName": {
                $arrayElemAt: ["$userdata.fullname", 0]
            },
            "camp_name": {
				$arrayElemAt: ["$campdata.camp_name", 0]
			}*/

            "buffer_time_camp": {
                $arrayElemAt: ["$campdata.buffer_time", 0]
            },
            "price_per_call_camp": {
                $arrayElemAt: ["$campdata.price_per_call", 0]
            },
            "buffer_time_buyer": {
                $arrayElemAt: ["$buyerdata.buffer_time", 0]
            },
            "price_per_call_buyer": {
                $arrayElemAt: ["$buyerdata.price_per_call", 0]
            },
            "buyer_name": {
                $arrayElemAt: ["$buyerdata.name", 0]
            }

        }
    }
    ]).then(data => {

        if (!data) {
            resolve(res.sendStatus(422))
        }
        return res.json({
			statusCode: "200",
			status: 'success',
			message: 'CDR Details',
            cdr: data,
            totalcalls: data.length
        });
    });
}
cdr.getAllCdrs1 = (req, res, next) => {

    let str = {
        did: {
            $ne: ''
        }        
    };

    if (req.params.sdate == undefined && req.params.edate == undefined) {

        const current = new Date();
        ssdate = moment(current).format("YYYY-MM-DD 00:00:00");
        eedate = moment(current).format("YYYY-MM-DD 23:59:59");
        str.start = {
            $gte: ssdate,
            $lte: eedate
        };
    } else if (req.params.sdate == "" && req.params.edate == "") {
        const current = new Date();
        ssdate = moment(current).format("YYYY-MM-DD 00:00:00");
        eedate = moment(current).format("YYYY-MM-DD 23:59:59");
        str.start = {
            $gte: ssdate,
            $lte: eedate
        };
    } else {
        sdat = parseInt(req.params.sdate);
        sdate = new Date(sdat);
        ssdate = moment(sdate).tz("America/Chicago").format("YYYY-MM-DD 00:00:00");
        edat = parseInt(req.params.edate);
        edate = new Date(edat);
        eedate = moment(edate).tz("America/Chicago").format("YYYY-MM-DD 23:59:59");
        str.start = {
            $gte: ssdate,
            $lte: eedate
        };
    }
	if (req.query.pub_id) {
        str.pub_id = parseInt(req.query.pub_id);
    }
	if(req.query.buyerNumber){
		delete str.did;
		//str.buyer_id = req.query.buyerNumber;
		//str.dst = req.query.buyerNumber;
		str.dst = {
			$in: JSON.parse(req.query.buyerNumber)
		}
	}
    Cdr.aggregate([{
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
            from: 'buyers',
            localField: 'buyerId',
            foreignField: 'buyer_id',
            as: 'buyerdata'
        }
    },
	{
        $lookup: {
            from: 'campaigns',
            localField: 'camp_id',
            foreignField: 'campaign_id',
            as: 'campdata'
        }
    },
    {
        $project: {
            "clid": 1,
            "src": 1,
            "dst": 1,
            "dcontext": 1,
            "channel": 1,
            "dstchannel": 1,
            "lastapp": 1,
            "lastdata": 1,
            "start": 1,
            "answer": 1,
            "end": 1,
            "duration": 1,
            "billsec": 1,
            "disposition": 1,
            "amaflags": 1,
            "accountcode": 1,
            "uniqueid": 1,
            "userfield": 1,
            "sequence": 1,
            "did": 1,
            "pub_id": 1,
            "camp_id": 1,
            "buyer_id": 1,
            "price_per_tfn": 1,
            "call_reducer": 1,
            "count": 1,
            "status": 1,
            "recordingfile": 1,
			"publisherName": 1,
			"camp_name": 1
			/*"publisherName": {
                $arrayElemAt: ["$userdata.fullname", 0]
            },
            "camp_name": {
				$arrayElemAt: ["$campdata.camp_name", 0]
			}*/

        }
    }
    ]).then(data => {

        if (!data) {
            resolve(res.sendStatus(422))
        }
        return res.json({
			statusCode: "200",
			status: 'success',
			message: 'CDR Details',
            cdr: data,
            totalcalls: data.length
        });
    });
}
cdr.getAllOutboundCdrs = (req, res, next) => {

    //let str = { "src": { "$exists": true }, "$expr": { "$lt": [ { "$strLenCP": "$src" }, 5 ] } , "dst": {"$ne": ""}, "dst": {"$ne": "h"}, "dst": {"$ne": "s"} } 
    let str = { "src": { "$exists": true }, "$expr": { "$lt": [ { "$strLenCP": "$src" }, 5 ] } }
	str.dst = {
		"$nin": ["*78","s","h",""]
	}
	str.src = {
		"$ne": ""
	}
    if (req.params.sdate == undefined && req.params.edate == undefined) {

        const current = new Date();
        ssdate = moment(current).format("YYYY-MM-DD 00:00:00");
        eedate = moment(current).format("YYYY-MM-DD 23:59:59");
        str.start = {
            $gte: ssdate,
            $lte: eedate
        };
    } else if (req.params.sdate == "" && req.params.edate == "") {
        const current = new Date();
        ssdate = moment(current).format("YYYY-MM-DD 00:00:00");
        eedate = moment(current).format("YYYY-MM-DD 23:59:59");
        str.start = {
            $gte: ssdate,
            $lte: eedate
        };
    } else {
        sdat = parseInt(req.params.sdate);
        sdate = new Date(sdat);
        ssdate = moment(sdate).utcOffset('+0530').format("YYYY-MM-DD 00:00:00");
        edat = parseInt(req.params.edate);
        edate = new Date(edat);
        eedate = moment(edate).utcOffset('+0530').format("YYYY-MM-DD 23:59:59");
        str.start = {
            $gte: ssdate,
            $lte: eedate
        };
    }
	if (req.query.pub_id) {
        str.pub_id = parseInt(req.query.pub_id);
    }
	if(req.query.buyerNumber){
		delete str.did;
		str.buyer_id = req.query.buyerNumber;
	}
	console.log(str);
    Cdr.aggregate([{
        $match: str
    },
    /*{
        $lookup: {
            from: 'users',
            localField: 'pub_id',
            foreignField: 'uid',
            as: 'userdata'
        }
    },
    {
        $lookup: {
            from: 'buyers',
            localField: 'buyerId',
            foreignField: 'buyer_id',
            as: 'buyerdata'
        }
    },*/
    {
        $project: {
            "clid": 1,
            "src": 1,
            "dst": 1,
            "dcontext": 1,
            "channel": 1,
            "dstchannel": 1,
            "lastapp": 1,
            "lastdata": 1,
            "start": 1,
            "answer": 1,
            "end": 1,
            "duration": 1,
            "billsec": 1,
            "disposition": 1,
            "amaflags": 1,
            "accountcode": 1,
            "uniqueid": 1,
            "userfield": 1,
            "sequence": 1,
            "did": 1,
            "pub_id": 1,
            "camp_id": 1,
            "buyer_id": 1,
            "price_per_tfn": 1,
            "call_reducer": 1,
            "count": 1,
            "status": 1,
            "recordingfile": 1,
        }
    }
    ]).then(data => {

        if (!data) {
            resolve(res.sendStatus(422))
        }
        return res.json({
			statusCode: "200",
			status: 'success',
			message: 'CDR Details',
            cdr: data,
            totalcalls: data.length
        });
    });
}
cdr.getTotalCdrs = (req, res, next) => {

    let str = {
        did: {
            $ne: ''
        }        
    };

    if (req.query.sdate == undefined && req.query.edate == undefined) {

        const current = new Date();
        ssdate = moment(current).format("YYYY-MM-DD 00:00:00");
        eedate = moment(current).format("YYYY-MM-DD 23:59:59");
        str.start = {
            $gte: ssdate,
            $lte: eedate
        };
    } else if (req.query.sdate == "" && req.query.edate == "") {
        const current = new Date();
        ssdate = moment(current).format("YYYY-MM-DD 00:00:00");
        eedate = moment(current).format("YYYY-MM-DD 23:59:59");
        str.start = {
            $gte: ssdate,
            $lte: eedate
        };
    } else {
        sdat = parseInt(req.query.sdate);
        sdate = new Date(sdat);
        ssdate = moment(sdate).utcOffset('+0530').format("YYYY-MM-DD 00:00:00");
        edat = parseInt(req.query.edate);
        edate = new Date(edat);
        eedate = moment(edate).utcOffset('+0530').format("YYYY-MM-DD 23:59:59");
        str.start = {
            $gte: ssdate,
            $lte: eedate
        };
    }
	if (req.query.pub_id) {
        str.pub_id = parseInt(req.query.pub_id);
    }
	if(req.query.buyerNumber){
		delete str.did;
		//str.buyer_id = req.query.buyerNumber;
		str.dst = {
			$in: JSON.parse(req.query.buyerNumber)
		}
	}

    Cdr.aggregate([{
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
            from: 'buyers',
            localField: 'buyerId',
            foreignField: 'buyer_id',
            as: 'buyerdata'
        }
    },
    {
        $project: {
            "clid": 1,
            "src": 1,
            "dst": 1,
            "dcontext": 1,
            "channel": 1,
            "dstchannel": 1,
            "lastapp": 1,
            "lastdata": 1,
            "start": 1,
            "answer": 1,
            "end": 1,
            "duration": 1,
            "billsec": 1,
            "disposition": 1,
            "amaflags": 1,
            "accountcode": 1,
            "uniqueid": 1,
            "userfield": 1,
            "sequence": 1,
            "did": 1,
            "pub_id": 1,
            "camp_id": 1,
            "buyer_id": 1,
            "price_per_tfn": 1,
            "call_reducer": 1,
            "count": 1,
            "status": 1,
            "recordingfile": 1,
        }
    }
    ]).then(data => {

        if (!data) {
            resolve(res.sendStatus(422))
        }
        return res.json({
			statusCode: "200",
			status: 'success',
			message: 'CDR Details',
			totalcalls: data.length
        });
    });
}

cdr.getMissedCalls = (req, res, next) => {

    let str = {
        did: {
            $ne: ''
        }        
    };
	str.disposition = 'NO ANSWER';
    if (req.query.sdate == undefined && req.query.edate == undefined) {

        const current = new Date();
        ssdate = moment(current).format("YYYY-MM-DD 00:00:00");
        eedate = moment(current).format("YYYY-MM-DD 23:59:59");
        str.start = {
            $gte: ssdate,
            $lte: eedate
        };
    } else if (req.query.sdate == "" && req.query.edate == "") {
        const current = new Date();
        ssdate = moment(current).format("YYYY-MM-DD 00:00:00");
        eedate = moment(current).format("YYYY-MM-DD 23:59:59");
        str.start = {
            $gte: ssdate,
            $lte: eedate
        };
    } else {
        sdat = parseInt(req.query.sdate);
        sdate = new Date(sdat);
        ssdate = moment(sdate).utcOffset('+0530').format("YYYY-MM-DD 00:00:00");
        edat = parseInt(req.query.edate);
        edate = new Date(edat);
        eedate = moment(edate).utcOffset('+0530').format("YYYY-MM-DD 23:59:59");
        str.start = {
            $gte: ssdate,
            $lte: eedate
        };
    }
	if (req.query.pub_id) {
        str.pub_id = parseInt(req.query.pub_id);
    }
	if(req.query.buyerNumber){
		delete str.did;
		//str.buyer_id = req.query.buyerNumber;
		str.dst = {
			$in: JSON.parse(req.query.buyerNumber)
		}
	}

    Cdr.aggregate([{
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
            from: 'buyers',
            localField: 'buyerId',
            foreignField: 'buyer_id',
            as: 'buyerdata'
        }
    },
    {
        $project: {
            "clid": 1,
            "src": 1,
            "dst": 1,
            "dcontext": 1,
            "channel": 1,
            "dstchannel": 1,
            "lastapp": 1,
            "lastdata": 1,
            "start": 1,
            "answer": 1,
            "end": 1,
            "duration": 1,
            "billsec": 1,
            "disposition": 1,
            "amaflags": 1,
            "accountcode": 1,
            "uniqueid": 1,
            "userfield": 1,
            "sequence": 1,
            "did": 1,
            "pub_id": 1,
            "camp_id": 1,
            "buyer_id": 1,
            "price_per_tfn": 1,
            "call_reducer": 1,
            "count": 1,
            "status": 1,
            "recordingfile": 1,
        }
    }
    ]).then(data => {

        if (!data) {
            resolve(res.sendStatus(422))
        }
        return res.json({
			statusCode: "200",
			status: 'success',
			message: 'CDR Details',
			totalcalls: data.length
        });
    });
}

cdr.getTotalUniqueCalls = (req, res, next) => {
	let str = {
        did: {
            $ne: ''
        }        
    };
	
    if (req.params.sdate == undefined && req.params.edate == undefined) {

        const current = new Date();
        ssdate = moment(current).format("YYYY-MM-DD 00:00:00");
        eedate = moment(current).format("YYYY-MM-DD 23:59:59");
        str.start = {
            $gte: ssdate,
            $lte: eedate
        };
    } else if (req.params.sdate == "" && req.params.edate == "") {
        const current = new Date();
        ssdate = moment(current).format("YYYY-MM-DD 00:00:00");
        eedate = moment(current).format("YYYY-MM-DD 23:59:59");
        str.start = {
            $gte: ssdate,
            $lte: eedate
        };
    } else {
        sdat = parseInt(req.params.sdate);
        sdate = new Date(sdat);
        ssdate = moment(sdate).utcOffset('+0530').format("YYYY-MM-DD 00:00:00");
        edat = parseInt(req.params.edate);
        edate = new Date(edat);
        eedate = moment(edate).utcOffset('+0530').format("YYYY-MM-DD 23:59:59");
        str.start = {
            $gte: ssdate,
            $lte: eedate
        };
		console.log(str);
    }
	if (req.query.pub_id) {
        str.pub_id = parseInt(req.query.pub_id);
    }
	if(req.query.buyerNumber){
		delete str.did;
		//str.buyer_id = req.query.buyerNumber;
		str.dst = {
			$in: JSON.parse(req.query.buyerNumber)
		}
	}

	Cdr.distinct("src", str).then(data => {
		if(!data){
			return res.sendStatus(422);
		}
		return res.json({
			statusCode: "200",
			status: 'success',
			message: 'Total Unique Calls',
			totaluniquecalls: data.length
		});
	}).catch(next);
}

cdr.getDupesCalls = (req, res, next) => {
	let str = {
        did: {
            $ne: ''
        }        
    };
	
    if (req.params.sdate == undefined && req.params.edate == undefined) {

        const current = new Date();
        ssdate = moment(current).format("YYYY-MM-DD 00:00:00");
        eedate = moment(current).format("YYYY-MM-DD 23:59:59");
        str.start = {
            $gte: ssdate,
            $lte: eedate
        };
    } else if (req.params.sdate == "" && req.params.edate == "") {
        const current = new Date();
        ssdate = moment(current).format("YYYY-MM-DD 00:00:00");
        eedate = moment(current).format("YYYY-MM-DD 23:59:59");
        str.start = {
            $gte: ssdate,
            $lte: eedate
        };
    } else {
        sdat = parseInt(req.params.sdate);
        sdate = new Date(sdat);
        ssdate = moment(sdate).utcOffset('+0530').format("YYYY-MM-DD 00:00:00");
        edat = parseInt(req.params.edate);
        edate = new Date(edat);
        eedate = moment(edate).utcOffset('+0530').format("YYYY-MM-DD 23:59:59");
        str.start = {
            $gte: ssdate,
            $lte: eedate
        };
		console.log(str);
    }
	if (req.query.pub_id) {
        str.pub_id = parseInt(req.query.pub_id);
    }
	if(req.query.buyerNumber){
		delete str.did;
		//str.buyer_id = req.query.buyerNumber;
		str.dst = {
			$in: JSON.parse(req.query.buyerNumber)
		}
	}

	Cdr.distinct("src", str).then(data => {
		if(!data){
			return res.sendStatus(422);
		}
		return res.json({
			statusCode: "200",
			status: 'success',
			message: 'Total Unique Calls',
			totaldupescalls: data
		});
	}).catch(next);
}

cdr.getTotalUniqueOutboundCalls = (req, res, next) => {
	/*let str = {
        did: {
            $ne: ''
        }        
    };*/
	let str = { "src": { "$exists": true }, "$expr": { "$lt": [ { "$strLenCP": "$src" }, 5 ] } } 
	str.dst = {
		"$nin": ["*78","s","h",""]
	}
	str.src = {
		"$ne": ""
	}
    if (req.params.sdate == undefined && req.params.edate == undefined) {

        const current = new Date();
        ssdate = moment(current).format("YYYY-MM-DD 00:00:00");
        eedate = moment(current).format("YYYY-MM-DD 23:59:59");
        str.start = {
            $gte: ssdate,
            $lte: eedate
        };
    } else if (req.params.sdate == "" && req.params.edate == "") {
        const current = new Date();
        ssdate = moment(current).format("YYYY-MM-DD 00:00:00");
        eedate = moment(current).format("YYYY-MM-DD 23:59:59");
        str.start = {
            $gte: ssdate,
            $lte: eedate
        };
    } else {
        sdat = parseInt(req.params.sdate);
        sdate = new Date(sdat);
        ssdate = moment(sdate).utcOffset('+0530').format("YYYY-MM-DD 00:00:00");
        edat = parseInt(req.params.edate);
        edate = new Date(edat);
        eedate = moment(edate).utcOffset('+0530').format("YYYY-MM-DD 23:59:59");
        str.start = {
            $gte: ssdate,
            $lte: eedate
        };
		console.log(str);
    }
	if (req.query.pub_id) {
        str.pub_id = parseInt(req.query.pub_id);
    }
	if(req.query.buyerNumber){
		delete str.did;
		str.buyer_id = req.query.buyerNumber;
	}

	Cdr.distinct("src", str).then(data => {
		if(!data){
			return res.sendStatus(422);
		}
		return res.json({
			statusCode: "200",
			status: 'success',
			message: 'Total Unique Calls',
			totaluniquecalls: data.length
		});
	}).catch(next);
}
cdr.getTotalUniqueAnsweredCalls = (req, res, next) => {
	let str = {
        did: {
            $ne: ''
        },
        disposition: {
            $eq: "ANSWERED"
        }        
    };

    if (req.params.sdate == undefined && req.params.edate == undefined) {

        const current = new Date();
        ssdate = moment(current).format("YYYY-MM-DD 00:00:00");
        eedate = moment(current).format("YYYY-MM-DD 23:59:59");
        str.start = {
            $gte: ssdate,
            $lte: eedate
        };
    } else if (req.params.sdate == "" && req.params.edate == "") {
        const current = new Date();
        ssdate = moment(current).format("YYYY-MM-DD 00:00:00");
        eedate = moment(current).format("YYYY-MM-DD 23:59:59");
        str.start = {
            $gte: ssdate,
            $lte: eedate
        };
    } else {
        sdat = parseInt(req.params.sdate);
        sdate = new Date(sdat);
        ssdate = moment(sdate).utcOffset('+0530').format("YYYY-MM-DD 00:00:00");
        edat = parseInt(req.params.edate);
        edate = new Date(edat);
        eedate = moment(edate).utcOffset('+0530').format("YYYY-MM-DD 23:59:59");
        str.start = {
            $gte: ssdate,
            $lte: eedate
        };
    }
	if(req.query.buyerNumber){
		delete str.did;
		//str.buyer_id = req.query.buyerNumber;
		str.dst = {
			$in: JSON.parse(req.query.buyerNumber)
		}
	}
	if (req.query.pub_id) {
        str.pub_id = parseInt(req.query.pub_id);
    }
	Cdr.distinct("src", str).then(data => {
		if(!data){
			return res.sendStatus(422);
		}
		return res.json({
			statusCode: "200",
			status: 'success',
			message: 'Total Unique Answered Calls',
			totaluniqueansweredcalls: data.length
		});
	}).catch(next);
}
cdr.getTotalUniqueAnsweredOutboundCalls = (req, res, next) => {
	/*let str = {
        did: {
            $ne: ''
        },
        disposition: {
            $eq: "ANSWERED"
        }        
    };*/
	let str = { "src": { "$exists": true }, "$expr": { "$lt": [ { "$strLenCP": "$src" }, 5 ] }, "disposition": "ANSWERED" } 
	str.dst = {
		"$nin": ["*78","s","h",""]
	}
	str.src = {
		"$ne": ""
	}
    if (req.params.sdate == undefined && req.params.edate == undefined) {

        const current = new Date();
        ssdate = moment(current).format("YYYY-MM-DD 00:00:00");
        eedate = moment(current).format("YYYY-MM-DD 23:59:59");
        str.start = {
            $gte: ssdate,
            $lte: eedate
        };
    } else if (req.params.sdate == "" && req.params.edate == "") {
        const current = new Date();
        ssdate = moment(current).format("YYYY-MM-DD 00:00:00");
        eedate = moment(current).format("YYYY-MM-DD 23:59:59");
        str.start = {
            $gte: ssdate,
            $lte: eedate
        };
    } else {
        sdat = parseInt(req.params.sdate);
        sdate = new Date(sdat);
        ssdate = moment(sdate).utcOffset('+0530').format("YYYY-MM-DD 00:00:00");
        edat = parseInt(req.params.edate);
        edate = new Date(edat);
        eedate = moment(edate).utcOffset('+0530').format("YYYY-MM-DD 23:59:59");
        str.start = {
            $gte: ssdate,
            $lte: eedate
        };
    }
	if(req.query.buyerNumber){
		delete str.did;
		str.buyer_id = req.query.buyerNumber;
	}
	if (req.query.pub_id) {
        str.pub_id = parseInt(req.query.pub_id);
    }
	Cdr.distinct("src", str).then(data => {
		if(!data){
			return res.sendStatus(422);
		}
		return res.json({
			statusCode: "200",
			status: 'success',
			message: 'Total Unique Answered Calls',
			totaluniqueansweredcalls: data.length
		});
	}).catch(next);
}
cdr.getAHT = (req, res, next) => {
	let str = {
		did: {
			$ne: ''
		},
		disposition: {
			$eq: 'ANSWERED'
		}
	};
	if (req.params.sdate == undefined && req.params.edate == undefined) {

        const current = new Date();
        ssdate = moment(current).format("YYYY-MM-DD 00:00:00");
        eedate = moment(current).format("YYYY-MM-DD 23:59:59");
        str.start = {
            $gte: ssdate,
            $lte: eedate
        };
    } else if (req.params.sdate == "" && req.params.edate == "") {
        const current = new Date();
        ssdate = moment(current).format("YYYY-MM-DD 00:00:00");
        eedate = moment(current).format("YYYY-MM-DD 23:59:59");
        str.start = {
            $gte: ssdate,
            $lte: eedate
        };
    } else {
        sdat = parseInt(req.params.sdate);
        sdate = new Date(sdat);
        ssdate = moment(sdate).utcOffset('+0530').format("YYYY-MM-DD 00:00:00");
        edat = parseInt(req.params.edate);
        edate = new Date(edat);
        eedate = moment(edate).utcOffset('+0530').format("YYYY-MM-DD 23:59:59");
        str.start = {
            $gte: ssdate,
            $lte: eedate
        };
    }
	if(req.query.pub_id){
		str.pub_id = parseInt(req.query.pub_id);
	}
	else{
		if(req.query.pubArr){
			str.pub_id = {
				$in: JSON.parse(req.query.pubArr)
			};
		}
	}
	if(req.query.camp_id){
		str.camp_id = parseInt(req.query.camp_id);
	}
	if(req.query.did){
		str.did = req.query.did;
	}
	if(req.query.dst){
		str.dst = req.query.dst;
	}
	if(req.query.status){
		str.status = req.query.status;
	}
	if(req.query.buyerNumber){
		delete str.did;
		//str.buyer_id = req.query.buyerNumber;
		str.dst = {
			$in: JSON.parse(req.query.buyerNumber)
		}
	}
	if(req.query.buffer_time){
		str.duration = {
			$gt: parseInt(req.query.buffer_time)
		};
	}
	console.log(str);
	const arrayToObject = (array) =>
	array.reduce((obj, item) => {
		obj[item.id] = item;
		console.log(obj);
		 return obj
		 
		
	})
	return Cdr.aggregate(
		[{
			$match: str
		},{
			$group: {
				_id: '$src',
				total: {
					$avg: "$duration"
				}
			}
		},{
			$group: {
				_id: null,
				aht: {
					$avg: '$total'
				}
			}
		}],
		function(err, result){
			console.log(result);
			if (Array.isArray(result) && result.length){
				return res.json({
				statusCode: "200",
				status: 'success',
				message: 'AHT',
				aht: arrayToObject(result)
			});
			}
			else{
				return res.json({
				statusCode: "200",
				status: 'success',
				message: 'AHT',
				aht: [{"_id":null,"aht":0}]
			});
			}
			
		});
}
cdr.getOutboundAHT = (req, res, next) => {
/*	let str = {
		did: {
			$ne: ''
		},
		disposition: {
			$eq: 'ANSWERED'
		}
	};*/
	let str = { "src": { "$exists": true }, "$expr": { "$lt": [ { "$strLenCP": "$src" }, 5 ] }, "disposition": "ANSWERED" } 
	str.dst = {
		"$nin": ["*78","s","h",""]
	}
	str.src = {
		"$ne": ""
	}
	if (req.params.sdate == undefined && req.params.edate == undefined) {

        const current = new Date();
        ssdate = moment(current).format("YYYY-MM-DD 00:00:00");
        eedate = moment(current).format("YYYY-MM-DD 23:59:59");
        str.start = {
            $gte: ssdate,
            $lte: eedate
        };
    } else if (req.params.sdate == "" && req.params.edate == "") {
        const current = new Date();
        ssdate = moment(current).format("YYYY-MM-DD 00:00:00");
        eedate = moment(current).format("YYYY-MM-DD 23:59:59");
        str.start = {
            $gte: ssdate,
            $lte: eedate
        };
    } else {
        sdat = parseInt(req.params.sdate);
        sdate = new Date(sdat);
        ssdate = moment(sdate).utcOffset('+0530').format("YYYY-MM-DD 00:00:00");
        edat = parseInt(req.params.edate);
        edate = new Date(edat);
        eedate = moment(edate).utcOffset('+0530').format("YYYY-MM-DD 23:59:59");
        str.start = {
            $gte: ssdate,
            $lte: eedate
        };
    }
	if(req.query.pub_id){
		str.pub_id = parseInt(req.query.pub_id);
	}
	else{
		if(req.query.pubArr){
			str.pub_id = {
				$in: JSON.parse(req.query.pubArr)
			};
		}
	}
	if(req.query.camp_id){
		str.camp_id = parseInt(req.query.camp_id);
	}
	if(req.query.did){
		str.did = req.query.did;
	}
	if(req.query.dst){
		str.dst = req.query.dst;
	}
	if(req.query.status){
		str.status = req.query.status;
	}
	if(req.query.buyerNumber){
		delete str.did;
		str.buyer_id = req.query.buyerNumber;
	}
	if(req.query.buffer_time){
		str.duration = {
			$gt: parseInt(req.query.buffer_time)
		};
	}
	console.log(str);
	const arrayToObject = (array) =>
	array.reduce((obj, item) => {
		obj[item.id] = item;
		console.log(obj);
		 return obj
		 
		
	})
	return Cdr.aggregate(
		[{
			$match: str
		},{
			$group: {
				_id: '$src',
				total: {
					$avg: "$duration"
				}
			}
		},{
			$group: {
				_id: null,
				aht: {
					$avg: '$total'
				}
			}
		}],
		function(err, result){
			if (Array.isArray(result) && result.length){
				return res.json({
				statusCode: "200",
				status: 'success',
				message: 'AHT',
				aht: arrayToObject(result)
			});
			}
			else{
				return res.json({
				statusCode: "200",
				status: 'success',
				message: 'AHT',
				aht: 0
			});
			}
			
		});
}
cdr.getBuyerReport = (req, res, next) => {
	let str = {
		uniqueid: {
			$ne: 0
		},
		lastapp: {
			$ne: 'Hangup'
		},
		dst: {
			$ne: 's'
		}
	};
	
    if (req.query.sdate == undefined && req.query.edate == undefined) {
        const current = new Date();
        ssdate = moment(current).format("YYYY-MM-DD 00:00:00");
        eedate = moment(current).format("YYYY-MM-DD 23:59:59");
        str.start = {
            $gte: ssdate,
            $lte: eedate
        };
    } else if (req.query.sdate == "" && req.query.edate == "") {
        const current = new Date();
        ssdate = moment(current).format("YYYY-MM-DD 00:00:00");
        eedate = moment(current).format("YYYY-MM-DD 23:59:59");
        str.start = {
            $gte: ssdate,
            $lte: eedate
        };
    } else {
        sdat = parseInt(req.query.sdate);
        sdate = new Date(sdat);
        ssdate = moment(sdate).utcOffset('+0530').format("YYYY-MM-DD 00:00:00");
        edat = parseInt(req.query.edate);
        edate = new Date(edat);
        eedate = moment(edate).utcOffset('+0530').format("YYYY-MM-DD 23:59:59");
        str.start = {
            $gte: ssdate,
            $lte: eedate
        };
    }

	
	if (req.query.buyer_id) {
        str.buyer_id = req.query.buyer_id;
    }
	if (req.query.pub_id) {
        str.pub_id = parseInt(req.query.pub_id);
    }
	if (req.query.camp_id) {
        str.camp_id = parseInt(req.query.camp_id);
    }
	if (req.query.did) {
        str.did = req.query.did;
    }
	if (req.query.dst) {
        str.dst = req.query.dst;
    }
	
	
	
	Cdr.aggregate([{
		$match: str
	},
	{
		$lookup: {
			from: 'buyer_numbers',
			localField: 'buyer_id',
			foreignField: 'number',
			as: 'buyerNumberdata'
		}
	},
	{
		$project : {
			"src": 1,
            "dst": 1,
            "start": 1,
            "answer": 1,
            "end": 1,
            "duration": 1,
            "date": {
                $dateFromString: {
                    dateString: "$start"
                }
            },
            "end": {
                $dateFromString: {
                    dateString: "$end"
                }
            },
            "disposition": 1,
            "did": 1,
            "pub_id": 1,
            "camp_id": 1,
            "buyer_id": 1,
            "status": 1,
            "recordingfile": 1,
            "buyerNumber": {
                $arrayElemAt: ["$buyerNumberdata.number", 0]
            }
			
		}
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
		$project: {

            "src": 1,
            "dst": 1,
            "start": 1,
            "answer": 1,
            "end": 1,
            "duration": 1,
            "date": {
                $dateToString: {
                    format: "%Y-%m-%d",
                    date: "$date"
                }
            },
            "callstart": {
                $dateToString: {
                    format: "%H:%M:%S",
                    date: "$date"
                }
            },
            "callend": {
                $dateToString: {
                    format: "%H:%M:%S",
                    date: "$end"
                }
            },
            "disposition": 1,
            "did": 1,
            "pub_id": 1,
            "camp_id": 1,
            "buyer_id": 1,
            "status": 1,
            recordingfile: 1,
            "publisherName": {
                $arrayElemAt: ["$userdata.fullname", 0]
            },
            // "buyerName": { $arrayElemAt: ["$buyerdata.name", 0] },
            "buyerNumber": 1
        }
	}
	]).then(data => {
		if (!data) {
            resolve(res.sendStatus(422))
        }
        return res.json({
			statusCode: "200",
			status: 'success',
			message: 'Buyer Report',
            buyerReport: data,
            totalcalls: data.length
        });
	});
}


cdr.getQueueReport = (req, res, next) => {
	let str = {
		uniqueid: {
			$ne: 0
		},
		lastapp: {
			$ne: 'Hangup'
		},
		dst: {
			$ne: 's'
		},
		did: {
			$ne: ''
		},
		dstchannel: {
			$ne: ''
		}
	};
	
    if (req.body.sdate == undefined && req.body.edate == undefined) {
        const current = new Date();
        ssdate = moment(current).format("YYYY-MM-DD 00:00:00");
        eedate = moment(current).format("YYYY-MM-DD 23:59:59");
        str.start = {
            $gte: ssdate,
            $lte: eedate
        };
    } else if (req.body.sdate == "" && req.body.edate == "") {
        const current = new Date();
        ssdate = moment(current).format("YYYY-MM-DD 00:00:00");
        eedate = moment(current).format("YYYY-MM-DD 23:59:59");
        str.start = {
            $gte: ssdate,
            $lte: eedate
        };
    } else {
        sdat = parseInt(req.body.sdate);
        sdate = new Date(sdat);
        ssdate = moment(sdate).utcOffset('+0530').format("YYYY-MM-DD 00:00:00");
        edat = parseInt(req.body.edate);
        edate = new Date(edat);
        eedate = moment(edate).utcOffset('+0530').format("YYYY-MM-DD 23:59:59");
        str.start = {
            $gte: ssdate,
            $lte: eedate
        };
    }

	
	if (req.body.queue_id) {
        str.queue_id = req.body.queue_id;
    }
	if (req.body.pub_id) {
        str.pub_id = parseInt(req.body.pub_id);
    }
	if (req.body.camp_id) {
        str.camp_id = parseInt(req.body.camp_id);
    }
	if (req.body.did) {
        str.did = req.body.did;
    }
	/*if (req.body.dst) {
        str.dst = req.body.dst;
    }*/
	if (req.body.dst) {

		str.dst = {
				$in: req.body.dst
		};
    } /*else {

            if (req.body.dstArr) {
                str.dst = {
                    $in: JSON.parse(req.body.dstArr)
            };
        }
    }
	*/
	console.log(str);
	
	Cdr.aggregate([{
		$match: str
	},
	{
		$lookup: {
			from: 'queue_numbers',
			localField: 'queue_id',
			foreignField: 'number',
			as: 'queueNumberdata'
		}
	},
	{
		$project : {
			"src": 1,
            "dst": 1,
            "dstchannel": 1,
            "start": 1,
            "answer": 1,
            "end": 1,
            "duration": 1,
            "date": {
                $dateFromString: {
                    dateString: "$start"
                }
            },
            "end": {
                $dateFromString: {
                    dateString: "$end"
                }
            },
            "disposition": 1,
            "did": 1,
            "pub_id": 1,
            "camp_id": 1,
            "buyer_id": 1,
            "status": 1,
            recordingfile: 1,
            "queueNumber": {
                $arrayElemAt: ["$queueNumberdata.number", 0]
            }
			
		}
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
		$project: {

            "src": 1,
            "dst": 1,
            "dstchannel": 1,
            "start": 1,
            "answer": 1,
            "end": 1,
            "duration": 1,
            "date": {
                $dateToString: {
                    format: "%Y-%m-%d",
                    date: "$date"
                }
            },
            "callstart": {
                $dateToString: {
                    format: "%Y-%m-%d %H:%M:%S",
                    date: "$date"
                }
            },
            "callend": {
                $dateToString: {
                    format: "%Y-%m-%d %H:%M:%S",
                    date: "$end"
                }
            },
            "disposition": 1,
            "did": 1,
            "pub_id": 1,
            "camp_id": 1,
            "buyer_id": 1,
            "status": 1,
            recordingfile: 1,
            "publisherName": {
                $arrayElemAt: ["$userdata.fullname", 0]
            },
            "queueNumber": 1
        }
	}
	]).then(data => {
		if (!data) {
            resolve(res.sendStatus(422))
        }
        return res.json({
			statusCode: "200",
			status: 'success',
			message: 'Queue Report',
            queueReport: data,
            totalcalls: data.length
        });
	});
}
/* Audit profile CDR*/
cdr.getAllAuditCdrs = (req, res, next) => {

    let str = {
        did: {
            $ne: ''
        }        
    };

    if (req.params.sdate == undefined && req.params.edate == undefined) {

        const current = new Date();
        ssdate = moment(current).format("YYYY-MM-DD 00:00:00");
        eedate = moment(current).format("YYYY-MM-DD 23:59:59");
        str.start = {
            $gte: ssdate,
            $lte: eedate
        };
    } else if (req.params.sdate == "" && req.params.edate == "") {
        const current = new Date();
        ssdate = moment(current).format("YYYY-MM-DD 00:00:00");
        eedate = moment(current).format("YYYY-MM-DD 23:59:59");
        str.start = {
            $gte: ssdate,
            $lte: eedate
        };
    } else {
        sdat = parseInt(req.params.sdate);
        sdate = new Date(sdat);
        ssdate = moment(sdate).utcOffset('+0530').format("YYYY-MM-DD 00:00:00");
        edat = parseInt(req.params.edate);
        edate = new Date(edat);
        eedate = moment(edate).utcOffset('+0530').format("YYYY-MM-DD 23:59:59");
        str.start = {
            $gte: ssdate,
            $lte: eedate
        };
    }
	if (req.query.pub_id) {

            str.pub_id = parseInt(req.query.pub_id);
    } else {

            if (req.query.pubArr) {
                str.pub_id = {
                    $in: JSON.parse(req.query.pubArr)
            };
        }
    }
//	console.log(str);
    Cdr.aggregate([{
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
            from: 'buyers',
            localField: 'buyerId',
            foreignField: 'buyer_id',
            as: 'buyerdata'
        }
    },
    {
        $project: {
            "clid": 1,
            "src": 1,
            "dst": 1,
            "dcontext": 1,
            "channel": 1,
            "dstchannel": 1,
            "lastapp": 1,
            "lastdata": 1,
            "start": 1,
            "answer": 1,
            "end": 1,
            "duration": 1,
            "billsec": 1,
            "disposition": 1,
            "amaflags": 1,
            "accountcode": 1,
            "uniqueid": 1,
            "userfield": 1,
            "sequence": 1,
            "did": 1,
            "pub_id": 1,
            "camp_id": 1,
            "buyer_id": 1,
            "price_per_tfn": 1,
            "call_reducer": 1,
            "count": 1,
            "status": 1,
            "recordingfile": 1,
        }
    }
    ]).then(data => {

        if (!data) {
            resolve(res.sendStatus(422))
        }
        return res.json({
			statusCode: "200",
			status: 'success',
			message: 'CDR Details',
            cdr: data,
            totalcalls: data.length
        });
    });
}
cdr.getAuditTotalUniqueCalls = (req, res, next) => {
	let str = {
        did: {
            $ne: ''
        }        
    };
	
    if (req.params.sdate == undefined && req.params.edate == undefined) {

        const current = new Date();
        ssdate = moment(current).format("YYYY-MM-DD 00:00:00");
        eedate = moment(current).format("YYYY-MM-DD 23:59:59");
        str.start = {
            $gte: ssdate,
            $lte: eedate
        };
    } else if (req.params.sdate == "" && req.params.edate == "") {
        const current = new Date();
        ssdate = moment(current).format("YYYY-MM-DD 00:00:00");
        eedate = moment(current).format("YYYY-MM-DD 23:59:59");
        str.start = {
            $gte: ssdate,
            $lte: eedate
        };
    } else {
        sdat = parseInt(req.params.sdate);
        sdate = new Date(sdat);
        ssdate = moment(sdate).utcOffset('+0530').format("YYYY-MM-DD 00:00:00");
        edat = parseInt(req.params.edate);
        edate = new Date(edat);
        eedate = moment(edate).utcOffset('+0530').format("YYYY-MM-DD 23:59:59");
        str.start = {
            $gte: ssdate,
            $lte: eedate
        };
		console.log(str);
    }
	
	if(req.query.buyerNumber){
		delete str.did;
		str.buyer_id = req.query.buyerNumber;
	}
	if (req.query.pub_id) {

            str.pub_id = parseInt(req.query.pub_id);
    } else {

            if (req.query.pubArr) {
                str.pub_id = {
                    $in: JSON.parse(req.query.pubArr)
            };
        }
    }

	Cdr.distinct("src", str).then(data => {
		if(!data){
			return res.sendStatus(422);
		}
		return res.json({
			statusCode: "200",
			status: 'success',
			message: 'Total Unique Calls',
			totaluniquecalls: data.length
		});
	}).catch(next);
}
cdr.getAuditTotalUniqueAnsweredCalls = (req, res, next) => {
	let str = {
        did: {
            $ne: ''
        },
        disposition: {
            $eq: "ANSWERED"
        }        
    };

    if (req.params.sdate == undefined && req.params.edate == undefined) {

        const current = new Date();
        ssdate = moment(current).format("YYYY-MM-DD 00:00:00");
        eedate = moment(current).format("YYYY-MM-DD 23:59:59");
        str.start = {
            $gte: ssdate,
            $lte: eedate
        };
    } else if (req.params.sdate == "" && req.params.edate == "") {
        const current = new Date();
        ssdate = moment(current).format("YYYY-MM-DD 00:00:00");
        eedate = moment(current).format("YYYY-MM-DD 23:59:59");
        str.start = {
            $gte: ssdate,
            $lte: eedate
        };
    } else {
        sdat = parseInt(req.params.sdate);
        sdate = new Date(sdat);
        ssdate = moment(sdate).utcOffset('+0530').format("YYYY-MM-DD 00:00:00");
        edat = parseInt(req.params.edate);
        edate = new Date(edat);
        eedate = moment(edate).utcOffset('+0530').format("YYYY-MM-DD 23:59:59");
        str.start = {
            $gte: ssdate,
            $lte: eedate
        };
    }
	if(req.query.buyerNumber){
		delete str.did;
		str.buyer_id = req.query.buyerNumber;
	}
	if (req.query.pub_id) {

            str.pub_id = parseInt(req.query.pub_id);
    } else {

            if (req.query.pubArr) {
                str.pub_id = {
                    $in: JSON.parse(req.query.pubArr)
            };
        }
    }
	Cdr.distinct("src", str).then(data => {
		if(!data){
			return res.sendStatus(422);
		}
		return res.json({
			statusCode: "200",
			status: 'success',
			message: 'Total Unique Answered Calls',
			totaluniqueansweredcalls: data.length
		});
	}).catch(next);
}
cdr.getAuditAHT = (req, res, next) => {
	let str = {
		did: {
			$ne: ''
		},
		disposition: {
			$eq: 'ANSWERED'
		}
	};
	if (req.params.sdate == undefined && req.params.edate == undefined) {

        const current = new Date();
        ssdate = moment(current).format("YYYY-MM-DD 00:00:00");
        eedate = moment(current).format("YYYY-MM-DD 23:59:59");
        str.start = {
            $gte: ssdate,
            $lte: eedate
        };
    } else if (req.params.sdate == "" && req.params.edate == "") {
        const current = new Date();
        ssdate = moment(current).format("YYYY-MM-DD 00:00:00");
        eedate = moment(current).format("YYYY-MM-DD 23:59:59");
        str.start = {
            $gte: ssdate,
            $lte: eedate
        };
    } else {
        sdat = parseInt(req.params.sdate);
        sdate = new Date(sdat);
        ssdate = moment(sdate).utcOffset('+0530').format("YYYY-MM-DD 00:00:00");
        edat = parseInt(req.params.edate);
        edate = new Date(edat);
        eedate = moment(edate).utcOffset('+0530').format("YYYY-MM-DD 23:59:59");
        str.start = {
            $gte: ssdate,
            $lte: eedate
        };
    }
	if(req.query.pub_id){
		str.pub_id = parseInt(req.query.pub_id);
	}
	else{
		if(req.query.pubArr){
			str.pub_id = {
				$in: JSON.parse(req.query.pubArr)
			};
		}
	}
	if(req.query.camp_id){
		str.camp_id = parseInt(req.query.camp_id);
	}
	if(req.query.did){
		str.did = req.query.did;
	}
	if(req.query.dst){
		str.dst = req.query.dst;
	}
	if(req.query.status){
		str.status = req.query.status;
	}
	if(req.query.buyerNumber){
		delete str.did;
		str.buyer_id = req.query.buyerNumber;
	}
	if(req.query.buffer_time){
		str.duration = {
			$gt: parseInt(req.query.buffer_time)
		};
	}
	console.log(str);
	const arrayToObject = (array) =>
	array.reduce((obj, item) => {
		obj[item.id] = item;
		console.log(obj);
		 return obj
		 
		
	})
	return Cdr.aggregate(
		[{
			$match: str
		},{
			$group: {
				_id: '$src',
				total: {
					$avg: "$duration"
				}
			}
		},{
			$group: {
				_id: null,
				aht: {
					$avg: '$total'
				}
			}
		}],
		function(err, result){
			if (Array.isArray(result) && result.length){
				return res.json({
				statusCode: "200",
				status: 'success',
				message: 'AHT',
				aht: arrayToObject(result)
			});
			}
			else{
				return res.json({
				statusCode: "200",
				status: 'success',
				message: 'AHT',
				aht: 0
			});
			}
			
		});
}


cdr.weeklyReport = (req, res, next) => {

    let str = {
		did: {
            $ne: ''
        } 
	};

    let weekdays = [];
    let totalcalls = [];
    let answeredcalls = [];
    let unique_calls = [];
    let aht = [];
    let data = [];
	    function getAllCdrData(str) {

        return new Promise((resolve, reject) => {

            async.parallel({
                totalcalls: function (callback) {
                    return Cdr.countDocuments(str, function (err, result) {
                        return callback(null, result);
                    });
                },
                totalanswered: function (callback) {
                    let query = str;
                    query.disposition = 'ANSWERED';
                    return Cdr.countDocuments(query, function (err, result) {
                        return callback(null, result);
                    });
					
                },
                last: function (callback) {
                    let query = str;
                    query.disposition = 'ANSWERED';

                    return Cdr.aggregate(
                        [{
                            $match: query
                        }, {
                            $group: {
                                _id: '$src',
                                total: {
                                    $avg: "$duration"
                                }
                            }
                        }, {
                            $group: {
                                _id: null,
                                unique_calls: {
                                    $sum: 1
                                },
                                aht: {
                                    $avg: '$total'
                                },
                            }
                        },
                        {
                            $project: {
                                unique_calls: 1,
                                aht: 1,
                                total: 1,
                                //payableamount: { $multiply: ["$unique_calls", price_per_tfn] },
                            }
                        }
                        ],
                        function (err, result) {
                            return callback(null, result)
                        });
                }
            },
                function (err, results) {

                    // console.log(results, "+++++++++++++++++");
                    totalcalls = [...totalcalls, results.totalcalls];
                    //answeredcalls = [...answeredcalls, results.totalanswered];
					if (results.last[0] !== undefined) {
                        answeredcalls = [...unique_calls, results.last[0].unique_calls];
                    } else {
                        answeredcalls = [...unique_calls, 0];
                    }
                    if (results.last[0] !== undefined) {
                        unique_calls = [...unique_calls, results.last[0].unique_calls];
                    } else {
                        unique_calls = [...unique_calls, 0];
                    }
                    if (results.last[0] !== undefined) {
                        aht = [...aht, Math.round(results.last[0].aht / 60)];
                    } else {
                        aht = [...aht, 0];
                    }
                    return resolve(results);
                });
        });
    }

    async function getData() {


        return new Promise(async (resolve, reject) => {

            var curr = new Date;
            var first = curr.getDate() - curr.getDay();

            for (var i = 1; i < 7; i++) {

                str = {
                    did: {
                        $ne: ''
                    },
                    lastapp: {
                        $ne: 'Hangup'
                    },
                    dst: {
                        $ne: 's'
                    }
                };
                var next = new Date(curr.getTime());
                next.setDate(first + i);
                //ssdate = moment(next).format("YYYY-MM-DD");
                ssdate = moment(next).format("dddd, MMMM ");
                //console.log(next.toString());
                weekdays = [...weekdays, ssdate];
                ssdate = moment(next).format("YYYY-MM-DD 00:00:00");
                eedate = moment(next).format("YYYY-MM-DD 23:59:59");
                str.start = {
                    $gte: ssdate,
                    $lte: eedate
                };

                if (req.query.pub_id) {
                    str.pub_id = parseInt(req.query.pub_id);
                    str.status = 'show';
                }
				if (req.query.camp_id) {
                    str.camp_id = parseInt(req.query.camp_id);
                }
                /* for audit profile */
                if (req.query.call_type) {
                    if (req.query.call_type === 'outbound') {

                        str.did = '';
                    }
                    if (req.query.call_type === 'inbound') {

                        str.did = {
                            $ne: ''
                        };
                    }
                    if (req.query.pub_id) {

                        str.pub_id = parseInt(req.query.pub_id);

                    } else {
                        if (req.query.pubArr) {

                            str.pub_id = {
                                $in: JSON.parse(req.query.pubArr)
                            };
                        }
                    }
					if (req.query.camp_id) {
                        str.camp_id = parseInt(req.query.camp_id);
                    }
                }

                data2 = await getAllCdrData(str);
                if (i >= 6) {
                    data = [{
                        data: totalcalls,
                        label: 'Total Calls'
                    },
                    {
                        data: answeredcalls,
                        label: 'Total Unique Calls'
                    },
                    {
                        data: unique_calls,
                        label: 'Total Unique Answered Calls'
                    },
                    {
                        data: aht,
                        label: 'AHT'
                    }
                    ]
                    resolve(res.json({
                        weekly: {
                            week: weekdays,
                            data: data
                        }
                    }));
                }
            }
        });

    }


    getData();
}
cdr.hourlyReport = (req, res, next) => {

    let str = {};

    let hours = [];
    let totalcalls = [];
    let answeredcalls = [];
    let unique_calls = [];
    let aht = [];
    let data = [];

    function getAllCdrData(str) {

        return new Promise((resolve, reject) => {

            async.parallel({
                totalcalls: function (callback) {
                    return Cdr.countDocuments(str, function (err, result) {
                        return callback(null, result);
                    });
                },
                totalanswered: function (callback) {
                    let query = str;
                    query.disposition = 'ANSWERED';
                    return Cdr.countDocuments(query, function (err, result) {
                        return callback(null, result);
                    });
                },
                last: function (callback) {
                    let query = str;
                    query.disposition = 'ANSWERED';

                    return Cdr.aggregate(
                        [{
                            $match: query
                        }, {
                            $group: {
                                _id: '$src',
                                total: {
                                    $avg: "$duration"
                                }
                            }
                        }, {
                            $group: {
                                _id: null,
                                unique_calls: {
                                    $sum: 1
                                },
                                aht: {
                                    $avg: '$total'
                                },
                            }
                        },
                        {
                            $project: {
                                unique_calls: 1,
                                aht: 1,
                                total: 1,

                            }
                        }
                        ],
                        function (err, result) {
                            return callback(null, result)
                        });
                }
            },
                function (err, results) {

                    totalcalls = [...totalcalls, results.totalcalls];
                    answeredcalls = [...answeredcalls, results.totalanswered];
                    if (results.last[0] !== undefined) {
                        unique_calls = [...unique_calls, results.last[0].unique_calls];
                    } else {
                        unique_calls = [...unique_calls, 0];
                    }
                    if (results.last[0] !== undefined) {
                        aht = [...aht, Math.round(results.last[0].aht / 60)];
                    } else {
                        aht = [...aht, 0];
                    }
                    return resolve(results);
                });
        });
    }

    async function getData() {


        return new Promise(async (resolve, reject) => {

            var curr = new Date;
            var first = curr.getDate() - curr.getDay();

            for (var i = 0; i < 24; i++) {

                str = {
                    did: {
                        $ne: ''
                    },
                    lastapp: {
                        $ne: 'Hangup'
                    },
                    dst: {
                        $ne: 's'
                    }
                };
                var next = new Date();
                if (i < 10) {
                    ssdate = moment(next).format("YYYY-MM-DD 0" + i + ":00:00");
                    eedate = moment(next).format("YYYY-MM-DD 0" + i + ":59:59");
                   // ssdate = moment(next).format("0" + i + ":00:00");
                   // eedate = moment(next).format("0" + i + ":59:59");
                } else {
                    //ssdate = moment(next).format("" + i + ":00:00");
                    //eedate = moment(next).format("" + i + ":59:59");

                    ssdate = moment(next).format("YYYY-MM-DD " + i + ":00:00");
                    eedate = moment(next).format("YYYY-MM-DD " + i + ":59:59");
                }
                hours = [...hours, ssdate];
                str.start = {
                    $gte: ssdate,
                    $lte: eedate
                };

                if (req.query.pub_id) {
                    str.pub_id = parseInt(req.query.pub_id);
                    str.status = 'show';
                }
				if (req.query.camp_id) {
					str.camp_id = parseInt(req.query.camp_id);
				}
                /* for audit profile */
                if (req.query.call_type) {
                    if (req.query.call_type === 'outbound') {

                        str.did = '';
                    }
                    if (req.query.call_type === 'inbound') {

                        str.did = {
                            $ne: ''
                        };
                    }
					if (req.query.camp_id) {

                        str.camp_id = parseInt(req.query.camp_id);

                    }
                    if (req.query.pub_id) {

                        str.pub_id = parseInt(req.query.pub_id);

                    } else {
                        if (req.query.pubArr) {

                            str.pub_id = {
                                $in: JSON.parse(req.query.pubArr)
                            };
                        }
                    }
                }

                data2 = await getAllCdrData(str);
                if (i >= 23) {
                    data = [{
                        data: totalcalls,
                        label: 'Total Calls'
                    },
                    {
                        data: answeredcalls,
                        label: 'Total Unique Calls'
                    },
                    {
                        data: unique_calls,
                        label: 'Total Unique Answered Calls'
                    },
                    {
                        data: aht,
                        label: 'AHT'
                    }
                    ]
                    resolve(res.json({
                        weekly: {
                            week: hours,
                            data: data
                        }
                    }));
                }
            }
        });

    }


    getData();
}

cdr.campaignReport = (req, res, next) => {
	let str = {
        did: {
            $ne: ''
        }        
    };
	if(req.query.hour){
		const i = req.query.hour;
		if (req.query.sdate == undefined && req.query.edate == undefined) {

			const current = new Date();
			if (i < 10) {
				ssdate = moment(current).format("YYYY-MM-DD 0" + i + ":00:00");
				eedate = moment(current).format("YYYY-MM-DD 0" + i + ":59:59");
			} else {
				ssdate = moment(current).format("YYYY-MM-DD " + i + ":00:00");
				eedate = moment(current).format("YYYY-MM-DD " + i + ":59:59");
			}
			
			str.start = {
				$gte: ssdate,
				$lte: eedate
			};
		} else if (req.query.sdate == "" && req.query.edate == "") {
			const current = new Date();
			if (i < 10) {
				ssdate = moment(current).format("YYYY-MM-DD 0" + i + ":00:00");
				eedate = moment(current).format("YYYY-MM-DD 0" + i + ":59:59");
			} else {
				ssdate = moment(current).format("YYYY-MM-DD " + i + ":00:00");
				eedate = moment(current).format("YYYY-MM-DD " + i + ":59:59");
			}
			str.start = {
				$gte: ssdate,
				$lte: eedate
			};
		} else {
			sdat = parseInt(req.query.sdate);
			sdate = new Date(sdat);
			edat = parseInt(req.query.edate);
			edate = new Date(edat);
			if (i < 10) {
				ssdate = moment(sdate).format("YYYY-MM-DD 0" + i + ":00:00");
				eedate = moment(edate).format("YYYY-MM-DD 0" + i + ":59:59");
			} else {
				ssdate = moment(sdate).format("YYYY-MM-DD " + i + ":00:00");
				eedate = moment(edate).format("YYYY-MM-DD " + i + ":59:59");
			}
			str.start = {
				$gte: ssdate,
				$lte: eedate
			};
		}
	}
	else if(req.query.month){
		const i = req.query.month;
		if (req.query.sdate == undefined && req.query.edate == undefined) {

			const current = new Date();
			ssdate = moment(current).format("YYYY-0"+i+"-DD 00:00:00");
			eedate = moment(current).format("YYYY-0"+i+"-DD 23:59:59");
			str.start = {
				$gte: ssdate,
				$lte: eedate
			};
		} else if (req.query.sdate == "" && req.query.edate == "") {
			const current = new Date();
			ssdate = moment(current).format("YYYY-0"+i+"-DD 00:00:00");
			eedate = moment(current).format("YYYY-0"+i+"-DD 23:59:59");
			str.start = {
				$gte: ssdate,
				$lte: eedate
			};
		} else {
			sdat = parseInt(req.query.sdate);
			sdate = new Date(sdat);
			edat = parseInt(req.query.edate);
			edate = new Date(edat);
			ssdate = moment(sdate).format("YYYY-0"+i+"-DD 00:00:00");
			eedate = moment(edate).format("YYYY-0"+i+"-DD 23:59:59");
			str.start = {
				$gte: ssdate,
				$lte: eedate
			};
		}
	}else if(req.query.week){
		const i = req.query.week;
		if (req.query.sdate == undefined && req.query.edate == undefined) {

			const current = new Date();
			if(i<10){
				ssdate = moment(current).format("YYYY-MM-0"+i+" 00:00:00");
				eedate = moment(current).format("YYYY-MM-0"+i+" 23:59:59");
			}else{
				ssdate = moment(current).format("YYYY-MM-"+i+" 00:00:00");
				eedate = moment(current).format("YYYY-MM-"+i+" 23:59:59");
			}
			str.start = {
				$gte: ssdate,
				$lte: eedate
			};
		} else if (req.query.sdate == "" && req.query.edate == "") {
			const current = new Date();
			if(i<10){
				ssdate = moment(current).format("YYYY-MM-0"+i+" 00:00:00");
				eedate = moment(current).format("YYYY-MM-0"+i+" 23:59:59");
			}else{
				ssdate = moment(current).format("YYYY-MM-"+i+" 00:00:00");
				eedate = moment(current).format("YYYY-MM-"+i+" 23:59:59");
			}
			str.start = {
				$gte: ssdate,
				$lte: eedate
			};
		} else {
			sdat = parseInt(req.query.sdate);
			sdate = new Date(sdat);
			edat = parseInt(req.query.edate);
			edate = new Date(edat);
			if(i<10){
				ssdate = moment(current).format("YYYY-MM-0"+i+" 00:00:00");
				eedate = moment(current).format("YYYY-MM-0"+i+" 23:59:59");
			}else{
				ssdate = moment(current).format("YYYY-MM-"+i+" 00:00:00");
				eedate = moment(current).format("YYYY-MM-"+i+" 23:59:59");
			}
			str.start = {
				$gte: ssdate,
				$lte: eedate
			};
		}
	}else{
		if (req.query.sdate == undefined && req.query.edate == undefined) {

			const current = new Date();
			ssdate = moment(current).format("YYYY-MM-DD 00:00:00");
			eedate = moment(current).format("YYYY-MM-DD 23:59:59");
			str.start = {
				$gte: ssdate,
				$lte: eedate
			};
		} else if (req.query.sdate == "" && req.query.edate == "") {
			const current = new Date();
			ssdate = moment(current).format("YYYY-MM-DD 00:00:00");
			eedate = moment(current).format("YYYY-MM-DD 23:59:59");
			str.start = {
				$gte: ssdate,
				$lte: eedate
			};
		} else {
			sdat = parseInt(req.query.sdate);
			sdate = new Date(sdat);
			ssdate = moment(sdate).utcOffset('+0530').format("YYYY-MM-DD 00:00:00");
			edat = parseInt(req.query.edate);
			edate = new Date(edat);
			eedate = moment(edate).utcOffset('+0530').format("YYYY-MM-DD 23:59:59");
			str.start = {
				$gte: ssdate,
				$lte: eedate
			};
		}
	}
	
    if (req.query.pub_id) {
        str.pub_id = parseInt(req.query.pub_id);
    }
	if(req.query.camp_id){
		str.camp_id = parseInt(req.query.camp_id);
	}

	//console.log(str);
	let query = [{
		$match: str
	},
	{
		$group: {
			_id: '$camp_id',
			total: {
				$sum: '$duration'
			},
			did: {$first: '$did'},
			start: {$first: '$start'},
			end: {$first: '$end'}
		}
	}
   
	];
	
	//console.log(query);

    Cdr.aggregate(query).then(data => {
		//console.log(data);
        return res.json({
            usageReport: data
        });
    }).catch(next);

}


cdr.monthlyReport = (req, res, next) => {

    let str = {};

    let hours = [];
    let totalcalls = [];
    let answeredcalls = [];
    let unique_calls = [];
    let aht = [];
    let data = [];

    function getAllCdrData(str) {

        return new Promise((resolve, reject) => {

            async.parallel({
                totalcalls: function (callback) {
                    return Cdr.countDocuments(str, function (err, result) {
                        return callback(null, result);
                    });
                },
                totalanswered: function (callback) {
                    let query = str;
                    query.disposition = 'ANSWERED';
                    return Cdr.countDocuments(query, function (err, result) {
                        return callback(null, result);
                    });
                },
                last: function (callback) {
                    let query = str;
                    query.disposition = 'ANSWERED';

                    return Cdr.aggregate(
                        [{
                            $match: query
                        }, {
                            $group: {
                                _id: '$src',
                                total: {
                                    $avg: "$duration"
                                }
                            }
                        }, {
                            $group: {
                                _id: null,
                                unique_calls: {
                                    $sum: 1
                                },
                                aht: {
                                    $avg: '$total'
                                },
                            }
                        },
                        {
                            $project: {
                                unique_calls: 1,
                                aht: 1,
                                total: 1,

                            }
                        }
                        ],
                        function (err, result) {
							//console.log(results);
                            return callback(null, result)
                        });
                }
            },
                function (err, results) {

                    totalcalls = [...totalcalls, results.totalcalls];
                    answeredcalls = [...answeredcalls, results.totalanswered];
                    if (results.last[0] !== undefined) {
                        unique_calls = [...unique_calls, results.last[0].unique_calls];
                    } else {
                        unique_calls = [...unique_calls, 0];
                    }
                    if (results.last[0] !== undefined) {
                        aht = [...aht, Math.round(results.last[0].aht / 60)];
                    } else {
                        aht = [...aht, 0];
                    }
					
                    return resolve(results);
                });
        });
    }

    async function getData() {


        return new Promise(async (resolve, reject) => {

            var curr = new Date;
            var first = curr.getDate() - curr.getDay();

            for (var i = 1; i < 13; i++) {

                str = {
                    did: {
                        $ne: ''
                    },
                    lastapp: {
                        $ne: 'Hangup'
                    },
                    dst: {
                        $ne: 's'
                    }
                };
                var next = new Date();
                if (i < 10) {
                    ssdate = moment(next).format("YYYY-0"+i+"-01");
                    eedate = moment(next).format("YYYY-0"+i+"-31");
                    ssdate = moment(next).format("YYYY-0"+i+"-01");
                    eedate = moment(next).format("YYYY-0"+i+"-31");

                } else {
                    ssdate = moment(next).format("YYYY-"+i+"-01");
                    eedate = moment(next).format("YYYY-"+i+"-31");
                }
                hours = [...hours, ssdate];
                str.start = {
                    $gte: ssdate,
                    $lte: eedate
                };
				console.log(str);
                if (req.query.pub_id) {
                    str.pub_id = parseInt(req.query.pub_id);
                    str.status = 'show';
                }
				if (req.query.camp_id) {
					str.camp_id = parseInt(req.query.camp_id);

                 }
                /* for audit profile */
                if (req.query.call_type) {
                    if (req.query.call_type === 'outbound') {

                        str.did = '';
                    }
                    if (req.query.call_type === 'inbound') {

                        str.did = {
                            $ne: ''
                        };
                    }
					
                    if (req.query.pub_id) {

                        str.pub_id = parseInt(req.query.pub_id);

                    } else {
                        if (req.query.pubArr) {

                            str.pub_id = {
                                $in: JSON.parse(req.query.pubArr)
                            };
                        }
                    }
                }
				
                data2 = await getAllCdrData(str);
                if (i >= 12) {
                    data = [{
                        data: totalcalls,
                        label: 'Total Calls'
                    },
                    {
                        data: answeredcalls,
                        label: 'Total Unique Calls'
                    },
                    {
                        data: unique_calls,
                        label: 'Total Unique Answered Calls'
                    },
                    {
                        data: aht,
                        label: 'AHT'
                    }
                    ]
                    resolve(res.json({
                        monthly: {
                            month: hours,
                            data: data
                        }
                    }));
                }
            }
        });

    }


    getData();
}

cdr.getUsageReport = (req, res, next) => {
	//console.log(req.query);
	//console.log(req.params);
    /*let str = {
        //uniqueid: { $ne: 0 },
        $and: [{
            did: {
                $ne: ''
            }
        }, {
            did: {
                $ne: 's'
            }
        }],
        lastapp: {
            $ne: 'Hangup'
        }
    };

    if (req.query.pub_id) {
        str.pub_id = parseInt(req.query.pub_id);
    }

    str.start = {
        $gte: req.params.sdate,
        $lt: req.params.edate
    };
	console.log(str);
    let query = [{
        $match: str
    },
    {
        $group: {
            _id: '$did',
            total: {
                $sum: '$duration'
            }
        }
    },
    {
        $lookup: {
            from: 'tfns',
            localField: '_id',
            foreignField: 'tfn',
            as: 'tfndata'
        }
    },
    {
        $project: {
            total: {
                $ceil: {
                    $divide: ['$total', 60]
                }
            },
            price_per_tfn: {
                $arrayElemAt: ['$tfndata.price_per_tfn', 0]
            },
            total_amount: {
                $multiply: [{
                    $ceil: {
                        $divide: ['$total', 60]
                    }
                }, {
                    $arrayElemAt: ['$tfndata.price_per_tfn', 0]
                }]
            }
        }
    }
    ];
	//console.log(query);
    Cdr.aggregate(query).then(data => {
        return res.json({
            usageReport: data
        });
    }).catch(next);*/
	let str = {
        did: {
            $ne: ''
        }        
    };

    if (req.params.sdate == undefined && req.params.edate == undefined) {

        const current = new Date();
        ssdate = moment(current).format("YYYY-MM-DD 00:00:00");
        eedate = moment(current).format("YYYY-MM-DD 23:59:59");
        str.start = {
            $gte: ssdate,
            $lte: eedate
        };
    } else if (req.params.sdate == "" && req.params.edate == "") {
        const current = new Date();
        ssdate = moment(current).format("YYYY-MM-DD 00:00:00");
        eedate = moment(current).format("YYYY-MM-DD 23:59:59");
        str.start = {
            $gte: ssdate,
            $lte: eedate
        };
    } else {
        sdat = parseInt(req.params.sdate);
        sdate = new Date(sdat);
        ssdate = moment(sdate).utcOffset('+0530').format("YYYY-MM-DD 00:00:00");
        edat = parseInt(req.params.edate);
        edate = new Date(edat);
        eedate = moment(edate).utcOffset('+0530').format("YYYY-MM-DD 23:59:59");
        str.start = {
            $gte: ssdate,
            $lte: eedate
        };
    }
	
    if (req.body.pub_id) {
        str.pub_id = parseInt(req.body.pub_id);
    }

	//console.log(str);
    let query = [{
        $match: str
    },
    {
        $group: {
            _id: '$did',
            total: {
                $sum: '$duration'
            }
        }
    }
   
    ];
	//console.log(query);
    Cdr.aggregate(query).then(data => {
		//console.log(data);
        return res.json({
            usageReport: data
        });
    }).catch(next);
}

cdr.fixCDR = (req, res, next) => {
    var start = req.params.start;
    var limit = req.params.limit;
    function changeDateFormat(d) {
        let date = new Date(d);
        let hh = date.getHours();
        if (hh < 10) {
            hh = '0' + hh;
        }
        let dd = date.getDate();
        if (dd < 10) {
            dd = '0' + dd;
        }
        let mm = date.getMinutes();
        if (mm < 10) {
            mm = '0' + mm;
        }
        let ss = date.getSeconds();
        if (ss < 10) {
            ss = '0' + ss;
        }
        return date.getFullYear() + '-0' + (date.getMonth() + 1) + '-' + dd + ' ' + hh + ':' + mm + ':' + ss;

    }
    return new Promise((resolve, reject) => {
		request('https://client.alivepbx.com/pbxapis/NodeApis/getCDR', { json: true }, (err, res, body) => {
            if (err) {
				connection.end();
                reject(err);
            } else {
                //console.log(data.length);
				var data=body.data;
                data.map(d => {
                    let sdate = changeDateFormat(d.calldate);
                    let n = new Cdr();

                    n.clid = '';
                    n.src = d.src;
                    n.dst = d.dst;
                    n.dcontext = d.dcontext;
                    n.channel = d.channel;
                    n.dstchannel = d.dstchannel;
                    n.lastapp = d.lastapp;
                    n.lastdata = d.lastdata;
                    n.start = sdate;
                    n.answer = sdate;
                    n.end = sdate;
                    n.duration = d.duration;
                    n.billsec = d.billsec;
                    n.disposition = d.disposition;
                    n.amaflags = d.amaflags;
                    n.accountcode = d.accountcode;
                    n.uniqueid = d.uniqueid;
                    n.userfield = d.userfield;
                    n.sequence = d.sequence;
                    n.did = d.did;
					n.recordingfile = d.recordingfile;
                    n.pub_id = d.pub_id;
                    n.camp_id = d.camp_id;
                    n.buyer_id = d.dst;
                    n.price_per_tfn = d.price_per_tfn;
                    n.call_reducer = d.call_reducer;
                    n.count = d.count;
                    n.publisherName = d.publisherName;
                    n.camp_name = d.camp_name;
                    n.buffer_time = d.buffer_time;
                    n.price_per_call = d.price_per_call;
                    console.log(n);
        
                    n.save().then(r => {
                        console.log(r, 'inserted');
                    });

                });
                /*resolve(res.json({
                    data: 'ok'
                }));*/
            }
        });
    });
}
module.exports = cdr;