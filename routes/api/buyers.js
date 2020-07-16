const buyers = require('../../controllers/buyers');
var passport = require('passport');
var auth = require('../auth');

module.exports = (app) => {
	app.use(require('../token'));
    app.get('/buyer/getBuyerr', auth.required,buyers.getBuyerrs);
    app.get('/buyer/getBuyer', auth.required,buyers.getBuyers);
	app.get('/buyer/getBuyer/:buyerid', auth.required, buyers.getBuyer);
	app.post('/buyer', auth.required,buyers.addBuyer);
	app.post('/buyer/editBuyer/:buyerid', auth.required,buyers.editBuyer);
	app.post('/buyer/status/:buyerid', auth.required,buyers.inactiveBuyer);
	app.delete('/buyer/deleteBuyer/:buyerid', auth.required,buyers.deleteBuyer);
	app.get('/buyer/getBuyerByPubId/:pub_id',auth.required, buyers.getBuyers);
	app.post('/buyer/updatePassword/:bid', auth.required, buyers.updatePassword);
}