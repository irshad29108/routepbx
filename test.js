var request = require('request').defaults({
    strictSSL: false,
    rejectUnauthorized: false
 });

request('https://client.alivepbx.com/pbxapis/NodeApis/getCDR', { json: true }, (err, res, body) => {
  if (err) { return console.log(err); }
  //console.log(body.url);
  console.log(body.data);
});