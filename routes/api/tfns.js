//var router = require('express').Router();
const tfns = require('../../controllers/tfns');
var passport = require('passport');
var auth = require('../auth');


module.exports = (app) => {
	app.use(require('../token'));
	/* TFN's APIs */
    app.get('/getAllTfns', auth.required, tfns.getAllTfns);
	
	app.post('/addTfn', auth.required, tfns.addTfn);   
	/*freepbx api pending*/
	
	/*get tfn by pub_id*/
	app.get('/getTfnByPublisher/:pub_id', auth.required, tfns.getTfnn);
	/*get tfn by tfn*/
	app.get('/getTfnByTfn/:tfn', auth.required, tfns.getTfnn);
	/* get tfn by obj id*/
	app.get('/getTfnById/:id', auth.required, tfns.getTfn);
	/* get available TFNs */
	app.get('/getAvailableTfn', auth.required, tfns.getAvailableTfn);
	/* get pending TFNS*/
	app.get('/freepbxTfn', tfns.freepbxTfn);
	app.post('/updateStatus', tfns.updateStatus);
	app.get('/getPendingTfns', auth.required, tfns.getPendingTfns);
	/* delete TFNs */
	app.delete('/tfn/delete/:id', auth.required, tfns.deleteTfn);
	app.post('/deleteTfns', auth.required, tfns.deleteTfns);   
}