const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const uniqueValidator = require('mongoose-unique-validator');
const jwt = require('jsonwebtoken');

const BuyerSchema = new mongoose.Schema({

  buyer_id: { type: Number, unique: true, index: true },
  name: { type: String, default: null },
  password: { type: String, required: [true, "can't be blank"], trim: true },
  email: { type: String, unique:true, lowercase: true, required: [true, "can't be blank"], match: [/\S+@\S+\.\S+/, 'is invalid'], trim: true },
  contact: { type: String, default: null, trim: true },
  address: { type: String, required: [true, "can't be blank"], trim: true },
  price_per_call: { type: String, default: 'buyer' },
  status: { type: String, default: 'active' },
  role: { type: String, default: 'buyer' },
  buffer_time: { type: Number, default: 0 },
  pub_id: { type: Number, default: 0, required: true },
  created_at: { type: Date, default: Date.now }


});
BuyerSchema.plugin(AutoIncrement, { inc_field: 'buyer_id' });
BuyerSchema.methods.generateJWT = function() {
	return jwt.sign({
		id: this._id,
		username: this.username,
		exp: (Math.floor(Date.now() / 1000) + 1*24*60*60)
	},'secret');
}
mongoose.model('Buyer', BuyerSchema);