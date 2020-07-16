const roles = require('../../controllers/roles');
var passport = require('passport');
var auth = require('../auth');

module.exports = (app) => {
	app.use(require('../token'));
    app.get('/role/getRoles', auth.required,roles.getRoles);
	app.post('/role', auth.required,roles.addRole);
	app.delete('/role/deleteRole/:roleid', auth.required,roles.deleteRole);
	
}