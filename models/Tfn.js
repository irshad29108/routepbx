const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const TfnSchema = new mongoose.Schema({
	buyer_id: {type: Number, default: 0},
	pub_id: {type: Number, default: 0},
	tfn: {type: String, required: [true, "can`t be blank"], default: null, trim: true, unique: true},
	price_per_tfn: {type: Number, default: 0},
	status: {type: String, default: 'active', trim: true},
	purchase_date: {type: String, default: null},
	charge_per_minutes: {type: Number, default: 0}
}, {timestamps: false });

mongoose.model('Tfn',TfnSchema);