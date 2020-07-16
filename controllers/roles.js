var mongoose = require('mongoose');
var Role = mongoose.model('Role');
 
var role = {};
role.getRoles = (req, res, next) => {

    let queryObj = {};


    Role.find(queryObj).then(function (data) {
        if (!data) { return res.sendStatus(422); }

        return res.json({
			statusCode: "200",
			status: 'success',
			message: 'Roles',
			buyer: data
			});
    }).catch(next);
}
role.addRole = (req, res, next) => {

    let role = new Role();

		role.name = req.body.name,
    role.save().then(data => { 

        return res.json({ 
		statusCode: "200",
		status: 'success',
		message: 'Role is added successfully',
		roles: data
		});
    }).catch(next);

}


role.deleteRole = (req, res, next) => {
	Role.deleteOne({
		  role_id: req.params.roleid
	})
	  .then(data => {
		if (!data) {
		  return res.sendStatus(422);
		}
		return res.json({
			statusCode: "200",
			status: 'success',
			message: "Role is deleted successfully"
		});
	  }).catch(next);
}

module.exports = role;