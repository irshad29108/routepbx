const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const ActiveHourSchema = new mongoose.Schema({
  
  day: { type: String, default: null },
  tfn:{ type: String, default: null ,required:true},
  destination: { type: String, default: null },
  active_on: { type: String, default: null }, 
  active_off: { type: String, default: null }


}, { timestamps: false });

ActiveHourSchema.plugin(AutoIncrement, { inc_field: 'ah_id' });

mongoose.model('Active_Hour', ActiveHourSchema);
