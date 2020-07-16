var auth = require('../auth');
const activehours = require('../../controllers/activehours');
var passport = require('passport');
module.exports = (app) => {
	app.use(require('../token'));
	app.post('/ActiveHours/add', auth.required, activehours.addActiveHour);

	app.get('/ActiveHours/getAll', auth.required, activehours.getActiveHour);

	app.get('/ActiveHours/getActiveHour/:id', auth.required, activehours.getActiveHour);
	
	app.get('/ActiveHours/getActiveHourFreepbx', activehours.getActiveHourFreepbx);

	app.put('/ActiveHours/update/:id', auth.required, activehours.updateActiveHour);

	app.delete('/ActiveHours/delete/:id',auth.required,activehours.deleteActiveHour);

	app.post('/BuyerActiveHours/add', auth.required, activehours.addBuyerActiveHour);

	app.get('/BuyerActiveHours/getAll', auth.required, activehours.getBuyerActiveHour);

	app.get('/BuyerActiveHours/getActiveHour/:id', auth.required, activehours.getBuyerActiveHour);
	
	app.get('/BuyerActiveHours/getActiveHourFreepbx', activehours.getBuyerActiveHourFreepbx);

	app.put('/BuyerActiveHours/update/:id', auth.required, activehours.updateBuyerActiveHour);

	app.delete('/BuyerActiveHours/delete/:id',auth.required,activehours.deleteBuyerActiveHour);
}
