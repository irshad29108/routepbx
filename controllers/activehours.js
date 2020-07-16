var mongoose = require('mongoose');
var ActiveHour = mongoose.model('Active_Hour');
var BuyerActiveHour = mongoose.model('BuyerActive_Hour');
var User = mongoose.model('User');
var UserSettings = mongoose.model('User_Settings');
var AssignedPublishers = mongoose.model('Assigned_Publisher');

var activeHours = {};


activeHours.getActiveHour = (req, res, next) => {

    let query = {};
    if (req.params.id) {
        query = { _id: mongoose.Types.ObjectId(req.params.id) };
    } else {
        query = {};
    }
    ActiveHour.find(query).then(data => {

        if (!data) { return res.sendStatus(422); }

        return res.json({ 
			statusCode: "200",
			status: 'success',
			message: 'Get Active Hours',
			activeHours: data
		});
    }).catch(next);

}


activeHours.deleteActiveHour = (req, res, next) => {

    ActiveHour.findByIdAndRemove({ _id: mongoose.Types.ObjectId(req.params.id) }).then(data => {
        if (!data) { return res.sendStatus(422); }

        return res.json({
			statusCode: "200",
			status: 'success',
			message: 'Active hours removed successfully' 
			});
    }).catch(next);

}

activeHours.addActiveHour =  (req, res, next) => {
	let activeHour = new ActiveHour();
	activeHour.day = req.body.day;
	activeHour.tfn = req.body.tfn;
	activeHour.destination = req.body.destination;
	activeHour.active_on = req.body.active_on;
	activeHour.active_off = req.body.active_off;

	activeHour.save().then(data => { 

		if (!data) { return res.sendStatus(422) }
		 return res.json({ 
			statusCode: "200",
			status: 'success',
			message: 'Active hours added successfully'
			});

	}).catch(next);

}


activeHours.updateActiveHour = (req, res, next) => {

    let updateObj = {};

    if (req.body.day) {
        updateObj.day = req.body.day;
    }
    if (req.body.active_on) {
        updateObj.active_on = req.body.active_on;
    }
    if (req.body.active_off) {
        updateObj.active_off = req.body.active_off;
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

    ActiveHour.findByIdAndUpdate(query, update, options).then(data => {

        if (!data) { return res.sendStatus(422); }

        return res.json({ 
			statusCode: "200",
			status: 'success',
			message: 'Active Hours Updated Successfully',
			activeHour: data });
    }).catch(next);

}
activeHours.updateActiveHour = (req, res, next) => {

    let updateObj = {};

    if (req.body.day) {
        updateObj.day = req.body.day;
    }
    if (req.body.active_on) {
        updateObj.active_on = req.body.active_on;
    }
    if (req.body.active_off) {
        updateObj.active_off = req.body.active_off;
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

    ActiveHour.findByIdAndUpdate(query, update, options).then(data => {

        if (!data) { return res.sendStatus(422); }

        return res.json({ 
			statusCode: "200",
			status: 'success',
			message: 'Active Hours Updated Successfully',
			activeHour: data
		});
    }).catch(next);

}
activeHours.getActiveHourFreepbx = (req, res, next) => {

    let query = {};
    var time = new Date().toISOString().split('T')[1];	
	var timee = time.split('.');
	var date =new Date().toISOString().split('T')[0];
	
    query.active_on = {
		$lt:  timee[0]
	};
	query.active_off = {
		$gt:  timee[0]
	}

	console.log(query);
    ActiveHour.find(query).then(data => {
		console.log(data);
        if (!data) { return res.sendStatus(422); }

        return res.json({ 
		activeHours: data 
		});
    }).catch(next);

}

activeHours.addBuyerActiveHour = (req, res, next) => {

    let query = {};
    if (req.params.id) {
        query = { _id: mongoose.Types.ObjectId(req.params.id) };
    } else {
        query = {};
    }
    BuyerActiveHour.find(query).then(data => {

        if (!data) { return res.sendStatus(422); }

        return res.json({ 
			statusCode: "200",
			status: 'success',
			message: 'Get Active Hours',
			activeHours: data
		});
    }).catch(next);

}
activeHours.getBuyerActiveHour = (req, res, next) => {

    let query = {};
    if (req.params.id) {
        query = { _id: mongoose.Types.ObjectId(req.params.id) };
    } else {
        query = {};
    }
    BuyerActiveHour.find(query).then(data => {

        if (!data) { return res.sendStatus(422); }

        return res.json({ 
			statusCode: "200",
			status: 'success',
			message: 'Get Active Hours',
			activeHours: data
		});
    }).catch(next);

}
activeHours.deleteBuyerActiveHour = (req, res, next) => {

    BuyerActiveHour.findByIdAndRemove({ _id: mongoose.Types.ObjectId(req.params.id) }).then(data => {
        if (!data) { return res.sendStatus(422); }

        return res.json({
			statusCode: "200",
			status: 'success',
			message: 'Active hours removed successfully' 
			});
    }).catch(next);

}

activeHours.addBuyerActiveHour =  (req, res, next) => {
	let activeHour = new BuyerActiveHour();
	activeHour.number = req.body.number;
	activeHour.active_on = req.body.active_on;
	activeHour.active_off = req.body.active_off;

	activeHour.save().then(data => { 

		if (!data) { return res.sendStatus(422) }
		 return res.json({ 
			statusCode: "200",
			status: 'success',
			message: 'Active hours added successfully'
			});

	}).catch(next);

}


activeHours.updateBuyerActiveHour = (req, res, next) => {

    let updateObj = {};

    if (req.body.active_on) {
        updateObj.active_on = req.body.active_on;
    }
    if (req.body.active_off) {
        updateObj.active_off = req.body.active_off;
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

    BuyerActiveHour.findByIdAndUpdate(query, update, options).then(data => {

        if (!data) { return res.sendStatus(422); }

        return res.json({ 
			statusCode: "200",
			status: 'success',
			message: 'Active Hours Updated Successfully',
			activeHour: data });
    }).catch(next);

}
activeHours.updateBuyerActiveHour = (req, res, next) => {

    let updateObj = {};

    if (req.body.active_on) {
        updateObj.active_on = req.body.active_on;
    }
    if (req.body.active_off) {
        updateObj.active_off = req.body.active_off;
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

    BuyerActiveHour.findByIdAndUpdate(query, update, options).then(data => {

        if (!data) { return res.sendStatus(422); }

        return res.json({ 
			statusCode: "200",
			status: 'success',
			message: 'Active Hours Updated Successfully',
			activeHour: data
		});
    }).catch(next);

}
activeHours.getBuyerActiveHourFreepbx = (req, res, next) => {

    let query = {};
    var time = new Date().toISOString().split('T')[1];	
	var timee = time.split('.');
	var date =new Date().toISOString().split('T')[0];
	
    query.active_on = {
		$lt:  timee[0]
	};
	query.active_off = {
		$gt:  timee[0]
	}

	console.log(query);
    BuyerActiveHour.find(query).then(data => {
		console.log(data);
        if (!data) { return res.sendStatus(422); }

        return res.json({ 
		activeHours: data 
		});
    }).catch(next);

}
module.exports = activeHours;
