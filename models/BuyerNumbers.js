const mongoose = require('mongoose');

const BuyerNumberSchema = new mongoose.Schema({

    buyer_id: { type: Number, default: null, required: true },
    number: { type: String, unique: true, required: true, trim: true },
    status: { type: String, default: "unused" }, 
    limit: { type: Number, default: 0 }, 
    monitoring: { type: Number, default: 0 },
    buyer_finance: { type: Number, default: 1 },
    capping: { type: Number, default: 0 },
    cdr: { type: Number, default: 0 },
    realtime: { type: Number, default: 0 },
    eod: { type: Number, default: 0 },
    dups: { type: Number, default: 0 },
    start: { type: String, default: '23:59:59' },
    end: { type: String, default: '23:59:59' },
    queue: { type: Number, default: 0 },
    agents: { type: String, default: '' }
}, { timestamps: true });



mongoose.model('Buyer_Number', BuyerNumberSchema);
