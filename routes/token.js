const jwt = require('jsonwebtoken')
var secret = process.env.NODE_ENV === 'production' ? process.env.SECRET : 'secret';

module.exports = (req,res,next) => {
	//console.log(req._parsedUrl.pathname);
if((req._parsedUrl.path == '/user/login') || (req._parsedUrl.path == '/BuyerNumbers/getAllBuyerNumbersFreepbx') || (req._parsedUrl.path == '/BuyerActiveHours/getActiveHourFreepbx') || (req._parsedUrl.path == '/uniquePublisher') || (req._parsedUrl.path == '/ActiveHours/getActiveHourFreepbx') || (req._parsedUrl.path == '/user/forgotPassword') || (req._parsedUrl.pathname == '/BuyerNumbers/getAllBuyerNumbers') || (req._parsedUrl.path == '/QueueNumbers/getAllQueueNumbers') || (req._parsedUrl.pathname == '/freepbxTfn') || (req._parsedUrl.pathname == '/getTotalCdrs') || (req._parsedUrl.pathname == '/cappings/getAllCappings') || (req._parsedUrl.pathname == '/user/recoveryPassword')){
	next();
}
else{
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token' ||
    req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {

    var token = req.headers.authorization.split(' ')[1];
		
		if (token) {
		// verifies secret and checks exp
		jwt.verify(token, secret, function(err, decoded) {
			if (err) {
				return res.status(401).json({"error": true, "message": 'Unauthorized access.' });
			}
		  req.decoded = decoded;
		  next();
		});
	  } 

  }
  else {
		// if there is no token
		// return an error
		return res.status(403).send({
			"error": true,
			"message": 'No token provided.'
		});
	  }

 
}

}
