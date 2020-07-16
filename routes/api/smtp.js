const smtps = require('../../controllers/smtps');
var passport = require('passport');
var auth = require('../auth');

module.exports = (app) => {
	app.use(require('../token'));
    app.post('/smtp/updateSmtp/:smtpid', auth.required, smtps.updateSmtp);
    app.get('/smtp/getSmtp', auth.required,smtps.getSmtp);
}