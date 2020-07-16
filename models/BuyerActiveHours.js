const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const BuyerActiveHourSchema = new mongoose.Schema({
  number:{ type: String, default: null ,required:true},
  active_on: { type: String, default: null }, 
  active_off: { type: String, default: null }


}, { timestamps: false });

BuyerActiveHourSchema.plugin(AutoIncrement, { inc_field: 'b_id' });

mongoose.model('BuyerActive_Hour', BuyerActiveHourSchema);
