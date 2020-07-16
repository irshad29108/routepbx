const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const uniqueValidator = require('mongoose-unique-validator');
const jwt = require('jsonwebtoken');

const SmtpSchema = new mongoose.Schema({

  smtpid: { type: Number, unique: true, index: true },
  driver: { type: String, default: null },
  host: { type: String, required: [true, "can't be blank"], trim: true },
  port: { type: String, trim: true },
  username: { type: String, trim: true },
  password: { type: String, required: [true, "can't be blank"], trim: true },
  db_time: { type: String, trim: true }
  
});
SmtpSchema.plugin(AutoIncrement, { inc_field: 'smtpid' });
SmtpSchema.methods.generateJWT = function() {
	return jwt.sign({
		id: this._id,
		username: this.username,
		exp: (Math.floor(Date.now() / 1000) + 1*24*60*60)
	},'secret');
}
mongoose.model('Smtp', SmtpSchema);