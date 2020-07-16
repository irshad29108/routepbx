const cdrs = require('../../controllers/cdrs');
var passport = require('passport');
var auth = require('../auth');

module.exports = (app) => {
	app.use(require('../token'));
    app.get('/getAllCdrs/:sdate/:edate', cdrs.getAllCdrs);
    app.get('/getAllCdrs1/:sdate/:edate', cdrs.getAllCdrs1);
    app.get('/getAllOutboundCdrs/:sdate/:edate', cdrs.getAllOutboundCdrs);
    app.get('/getTotalCdrs', cdrs.getTotalCdrs);
    app.get('/getMissedCalls', cdrs.getMissedCalls);
	app.get('/getTotalUniqueCalls/:sdate/:edate', cdrs.getTotalUniqueCalls);
	app.get('/getDupesCalls/:sdate/:edate', cdrs.getDupesCalls);
	app.get('/getTotalUniqueOutboundCalls/:sdate/:edate', cdrs.getTotalUniqueOutboundCalls);
	app.get('/getTotalUniqueAnsweredCalls/:sdate/:edate', cdrs.getTotalUniqueAnsweredCalls);
	app.get('/getTotalUniqueAnsweredOutboundCalls/:sdate/:edate', cdrs.getTotalUniqueAnsweredOutboundCalls);
	app.get('/getAHT/:sdate/:edate', cdrs.getAHT);
	app.get('/getOutboundAHT/:sdate/:edate', cdrs.getOutboundAHT);
	app.get('/buyerReport',cdrs.getBuyerReport);
	app.post('/queueReport',cdrs.getQueueReport);
	app.get('/getAllAuditCdrs/:sdate/:edate', cdrs.getAllAuditCdrs);
	app.get('/getAuditTotalUniqueCalls/:sdate/:edate', cdrs.getAuditTotalUniqueCalls);
	app.get('/getAuditTotalUniqueAnsweredCalls/:sdate/:edate', cdrs.getAuditTotalUniqueAnsweredCalls);
	app.get('/getAuditAHT/:sdate/:edate', cdrs.getAuditAHT);
	app.get('/cdr/weeklyReport', auth.required, cdrs.weeklyReport);
	app.get('/cdr/hourlyReport', auth.required, cdrs.hourlyReport);
	app.get('/cdr/campaignReport', auth.required, cdrs.campaignReport);
	app.get('/cdr/monthlyReport', auth.required, cdrs.monthlyReport);
	app.post('/usagereport/:sdate/:edate', auth.required, cdrs.getUsageReport);
	app.get('/fixcdr/:start/:limit', auth.required, cdrs.fixCDR);
}