const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const uniqueValidator = require('mongoose-unique-validator');
const jwt = require('jsonwebtoken');

const UserSettingsSchema = new mongoose.Schema({

  pub_id: { type: Number, required: true },
  enabled_record: { type: Number, default: 0 },
  daily_tfns: { type: Number, default: 0 },
  monthly_tfns: { type: Number, default: 0 },
  display_cnum: { type: Number, default: 0 },
  display_wallet: { type: Number, default: 1 },
  phone_system: { type: Number, default: 1 },
  call_reducer: { type: Number, default: 0 },
  enable_inside_route: { type: Number, default: 1 },
  enable_outside_route: { type: Number, default: 0 },
  buyer_limit: { type: Number, default: 0 },
  usage_module: { type: Number, default: 0 },
  filtered: { type: Number, default: 1 },
  number_to_ivr: { type: Number, default: 0 },
  show_buyer_no: { type: Number, default: 0 },
  hide_campaign: { type: Number, default: 0 },
  charge_per_minute: { type: Number, default: 0 },
  buyer_capping: { type: Number, default: 0 },
  buyernumber_cdr: { type: Number, default: 0 },

}, { timestamps: false });



mongoose.model('User_Settings', UserSettingsSchema);
