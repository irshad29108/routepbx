var mongoose = require('mongoose');
var Queue = mongoose.model('Queue');
var queue = {};

queue.getQueuess = (req, res, next) => {

    let queryObj = {};

    if (req.params.pub_id) {
        queryObj = { pub_id: req.params.pub_id }
    }


    Queue.find(queryObj).then(function (data) {
        if (!data) { return res.sendStatus(422); }

        return res.json({
		statusCode: "200",
		status: 'success',
		message: 'Queues',			
		queue: data
		});
    }).catch(next);
}
queue.getQueues = (req, res, next) => {

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
			queue_id: 1,
			publisherName: {
				$arrayElemAt: ["$userdata.fullname", 0]
			}
		}
	}
	];
	Queue.aggregate(aggregateData)
	.then(data => {
		if(!data){
			//return res.sendStatus(422);
			return res.json({statusCode:100,status: 'error',message: 'Error Occurred'});
		}
		return res.json({
			//success: "OK",
			statusCode: "200",
			status: 'success',
			message: 'Get All Queues',	
			queues: data
		});
	})
	.catch(next);
}
queue.getQueue = (req, res, next) => {

    Queue.findOne({ queue_id: req.params.queueid }).then(data => {
        if (!data) { return res.sendStatus(422); }

        return res.json({ 
		statusCode: "200",
		status: 'success',
		message: 'Queue Detail',		
		queue: data
		});
    }).catch(next);
}
queue.addQueue = (req, res, next) => {

    let queue = new Queue();

		queue.pub_id = req.body.pub_id,
        queue.address = req.body.address,
        queue.name = req.body.name,
        queue.email = req.body.email,
        queue.contact = req.body.contact,
        queue.password = req.body.password,
        queue.created_at = Date.now(),
        queue.status = "active",
        queue.price_per_call = req.body.price_per_call,
        queue.buffer_time = req.body.buffer_time
    queue.save().then(data => { 

        return res.json({
			statusCode: "200",
			status: 'success',
			message: 'Queue Added Successfully',
			queue: data
			});
    }).catch(next);

}

queue.editQueue = (req, res, next) => {
    if (req.params) {
        Queue.findOne({ queue_id: req.params.queueid }).then(queue => {
            if (!queue) {
                return res.json({ profile: req.profile.toProfileJSONFor(false) });

            } else {

                let query = {
                    queue_id: req.params.queueid
                },
                    update = {
                        pub_id: req.body.pub_id,
                        name: req.body.name,
                        email: req.body.email,
                        contact: req.body.contact,
                        price_per_call: req.body.price_per_call,
                        buffer_time: req.body.buffer_time,
                        address: req.body.address
                    },
                    options = {
                        upsert: false,
                        new: true
                    };
                if (req.body.password) {
                    update.password = req.body.password;
                }

                Queue.findOneAndUpdate(query, update, options).then(data => {

                    return res.json({ 
					statusCode: "200",
					status: 'success',
					message: 'Queue Updated Successfully',
					queue: data
					});

                }).catch(next);
            }
        });
    } else {
        return res.json({ profile: req.profile.toProfileJSONFor(false) });
    }
}
queue.deleteQueue = (req, res, next) => {

    Queue.deleteOne({ queue_id: req.params.queueid }).then(data => {

        if (!data) { return res.sendStatus(422); }

        return res.json({ 
		//statusCode: 200, 
		statusCode: "200",
		status: 'success',
		message: "Queue deleted successfully!"
		});

    }).catch(next);
}

module.exports = queue;
