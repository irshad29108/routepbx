const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const uniqueValidator = require('mongoose-unique-validator');

const RoleSchema = new mongoose.Schema({

  role_id: { type: Number, unique: true, index: true },
  name: { type: String, default: null },
  created_at: { type: Date, default: Date.now }

});
RoleSchema.plugin(AutoIncrement, { inc_field: 'role_id' });
mongoose.model('Role', RoleSchema);