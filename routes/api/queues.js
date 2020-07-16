const queues = require('../../controllers/queues');
var passport = require('passport');
var auth = require('../auth');

module.exports = (app) => {
	app.use(require('../token'));
    app.get('/queue/getQueues', auth.required,queues.getQueuess);
    app.get('/queue/getQueue', auth.required,queues.getQueues);
	app.get('/queue/getQueue/:queueid', auth.required, queues.getQueue);
	app.post('/queue', auth.required,queues.addQueue);
	app.post('/queue/editQueue/:queueid', auth.required,queues.editQueue);
	app.delete('/queue/deleteQueue/:queueid', auth.required,queues.deleteQueue);
	app.get('/queue/getQueueByPubId/:pub_id',auth.required, queues.getQueues);

}