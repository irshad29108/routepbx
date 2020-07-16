//var router = require('express').Router();
const campaign = require('../../controllers/campaigns');
var passport = require('passport');
var auth = require('../auth');

module.exports = (app) => {
	app.use(require('../token'));
	app.post('/Campaign/add', auth.required, campaign.addCampaign);
	app.get('/Campaign/getAllCamp',auth.required, campaign.getAllCampaign);
	app.delete('/Campaign/delete/:campId',auth.required,campaign.deleteCampaign);
	app.post('/Campaign/edit/:campaignId', auth.required, campaign.editCampaign);
	app.get('/Campaign/getCampaignByCampaignId/:campaignId',auth.required, campaign.getCampaign);
	app.get('/Campaign/getCampBuyerTfns/:camp_id',auth.required, campaign.getCampBuyerTfns);
	app.get('/Campaign/getCampPubTfns/:camp_id',auth.required, campaign.getCampPubTfns);

}