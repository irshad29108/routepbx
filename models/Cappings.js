const mongoose = require('mongoose');

const CappingSchema = new mongoose.Schema({
    camp_buyer_tfn_id: { type: mongoose.SchemaTypes.ObjectId, default: null },
    buyer_number: { type: String, required: [true, "can't be blank"], trim: true },
    queue: { type: String, required: [true, "can't be blank"], trim: true },
    capping: { type: Number, default: 0 },
    global_cap: { type: Number, default: 0 },
    status: { type: String, default: 'on' },
    pause_status: { type: String, default: 'pause' },
    priority: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false },

}, { timestamps: true });

mongoose.model('Cc_Capping', CappingSchema);
