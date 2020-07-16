var mongoose = require('mongoose');
let Cappings = mongoose.model('Cc_Capping');
let Buyer_Number = mongoose.model('Buyer_Number');
let Buyer = mongoose.model('Buyer');
var cappings = {};


cappings.getAll = (req, res, next) => {
    function ModifyArray(data) {
        let arr = {};
        data.forEach(async element => {
            if (arr[element.queue] === undefined) {
                arr[element.queue] = [];
            }
            arr[element.queue] = [...arr[element.queue], element];
        });
        return arr;
    }
    let query = {};
    if (req.params.id) {
        query = { _id: mongoose.Types.ObjectId(req.params.id) };
    }
    Cappings.aggregate([
        {
            $match: query,
        },
        {
            $lookup: {
                from: 'buyer_numbers',
                localField: 'buyer_number',
                foreignField: 'number',
                as: 'buyerNumbers'
            }
        },
        {
            $lookup: {
                from: 'buyers',
                localField: "buyerNumbers.buyer_id",
                foreignField: 'buyer_id',
                as: 'buyerdata'
            }
        },
        {
            $project: {
                buyer_number: 1,
                queue: 1,
                capping: 1,
                global_cap: 1,
                status: 1,
                pause_status: 1,
                priority: 1,
                b_number: { $arrayElemAt: ["$buyerNumbers.number", -1] },
                buyer: { $arrayElemAt: ["$buyerdata.name", -1] },

            }
        }
    ]).then(data => {
        return ModifyArray(data);
    }).then(data => {
        return res.json({ cappings: data });
    }).catch(next);
}




module.exports = cappings;
