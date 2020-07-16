const buyerNumbers = require('../../controllers/buyerNumbers');
var passport = require('passport');
var auth = require('../auth');

module.exports = (app) => {
	app.use(require('../token'));
	app.post('/BuyerNumbers/add', auth.required, buyerNumbers.addBuyerNumber);
    app.get('/BuyerNumbers/getAllBuyerNumbers', buyerNumbers.getAllBuyerNumbers);
    app.get('/BuyerNumbers/getAllBuyerNumbersFreepbx', buyerNumbers.getAllBuyerNumbers);
	app.delete('/BuyerNumbers/delete/:id', auth.required, buyerNumbers.deleteBuyerNumber);
	app.get('/BuyerNumbers/getBuyerNumber/:buyerId', auth.required, buyerNumbers.getAllBuyerNumbers);
	app.put('/BuyerNumbers/updateStatus/:id', auth.required, buyerNumbers.updateBuyerNumber);
	app.get('/BuyerNumbers/getBuyerDetails',buyerNumbers.getBuyerDetails);
}