const queueNumbers = require('../../controllers/queueNumbers');
var passport = require('passport');
var auth = require('../auth');

module.exports = (app) => {
	app.use(require('../token'));
	app.post('/QueueNumbers/add', auth.required, queueNumbers.addQueueNumber);
    app.get('/QueueNumbers/getAllQueueNumbers',queueNumbers.getAllQueueNumbers);
	app.delete('/QueueNumbers/delete/:id', auth.required, queueNumbers.deleteQueueNumber);
	app.get('/QueueNumbers/getQueueNumber/:queueId', auth.required, queueNumbers.getAllQueueNumbers);
	app.put('/QueueNumbers/updateStatus/:id', auth.required, queueNumbers.updateQueueNumber);
}