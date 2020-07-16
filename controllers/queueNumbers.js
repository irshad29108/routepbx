var mongoose = require('mongoose');
var QueueNumber = mongoose.model('Queue_Number');
var queueNumbers = {};

queueNumbers.addQueueNumber = async (req, res, next) => {
    function checkNumber(number) {
        return new Promise((resolve, reject) => {
            QueueNumber.find({ number: number }, (err, d) => {
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
            let queueNumber = new QueueNumber();
            queueNumber.queue_id = req.body.queue_id;
            queueNumber.number = req.body.number;

            queueNumber.save().then(data => { 

                if (!data) {
                    return res.sendStatus(422)
                }
                return res.json({
					statusCode: "200",
					status: 'success',
					message: 'Queue Number Added Successfully',
                    queueNumber: data
                });

            }).catch(next);
        }
    }
}

queueNumbers.getAllQueueNumbers = (req, res, next) => {

    let query = {};

    if (req.params.queueId) {

        query = {
            queue_id: req.params.queueId
        };
    } else {
        query = {};
    }

    QueueNumber.find(query).then(data => {

        if (!data) {
            return res.sendStatus(422);
        }

        return res.json({
			statusCode: "200",
			status: 'success',
			message: 'Queue Numbers',
            queueNumber: data
        });
    }).catch(next);

}

queueNumbers.deleteQueueNumber = (req, res, next) => {

    QueueNumber.findByIdAndRemove({
        _id: mongoose.Types.ObjectId(req.params.id)
    }).then(data => {
        if (!data) {
            return res.sendStatus(422);
        }

        return res.json({
            //success: 'OK',
			statusCode: "200",
			status: 'success',
            message: 'Queue Number removed successfully'
        });

    }).catch(next);

}

queueNumbers.updateQueueNumber = (req, res, next) => {

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

    QueueNumber.findByIdAndUpdate(query, update, options).then(data => {

        if (!data) {
            return res.sendStatus(422);
        }

        return res.json({
			statusCode: "200",
			status: 'success',
			message: 'Queue Number Updated Successfully',	
            data: data
        });
    }).catch(next);

}

module.exports = queueNumbers;