const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const uniqueValidator = require('mongoose-unique-validator');
const jwt = require('jsonwebtoken');

const QueueSchema = new mongoose.Schema({

  queue_id: { type: Number, unique: true, index: true },
  name: { type: String, default: null },
  password: { type: String, required: [true, "can't be blank"], trim: true },
  email: { type: String, lowercase: true, required: [true, "can't be blank"], match: [/\S+@\S+\.\S+/, 'is invalid'], trim: true },
  contact: { type: String, default: null, trim: true },
  address: { type: String, required: [true, "can't be blank"], trim: true },
  price_per_call: { type: String, default: 'publisher' },
  status: { type: String, default: 'active' },
  buffer_time: { type: Number, default: 0 },
  pub_id: { type: Number, default: 0, required: true },
  role: { type: String, default: 'monitor' },
  created_at: { type: Date, default: Date.now }


});
QueueSchema.plugin(AutoIncrement, { inc_field: 'queue_id' });
QueueSchema.methods.generateJWT = function() {
	return jwt.sign({
		id: this._id,
		username: this.username,
		exp: (Math.floor(Date.now() / 1000) + 1*24*60*60)
	},'secret');
}
mongoose.model('Queue', QueueSchema);