const mongoose = require('mongoose');

const CampBuyerTfnSchema = new mongoose.Schema({
    camp_id: { type: Number, required: [true, "can't be blank"] },
    buyer_id: { type: Number, default: null, required: [true, "can't be blank"] },
    buyers_no: { type: String, required: [true, "can't be blank"], trim: true },
    queue: { type: String, required: [true, "can't be blank"], trim: true },
    created_at: { type: Date },
    priority: { type: Number, default: 0 },
    capping: { type: Number, default: 0 },
    global_cap: { type: Number, default: 0 },
    status: { type: String, default: 'on' },
    pause_status: { type: String, default: 'pause' },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

mongoose.model('Camp_Buyer_Tfn', CampBuyerTfnSchema);