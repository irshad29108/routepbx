var auth = require('../auth');
const cappings = require('../../controllers/cappings');

module.exports = (app) => {
	app.use(require('../token'));
	app.get('/cappings/getAll', auth.required,  cappings.getAll);
	app.get('/cappings/getAllCappings', cappings.getAll);
}
