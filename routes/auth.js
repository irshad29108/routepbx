var jwt = require('express-jwt');
var jsonwebtoken = require('jsonwebtoken');
var secret = process.env.NODE_ENV === 'production' ? process.env.SECRET : 'secret'



function getTokenFromHeader(req) {


  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token' ||
    req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {

      return req.headers.authorization.split(' ')[1];

  }
  

  return null;
}

var auth = {
  required: jwt({
    secret: secret,
    userProperty: 'payload',
    getToken: getTokenFromHeader
  }),
  optional: jwt({
    secret: secret,
    userProperty: 'payload',
    credentialsRequired: false,
    getToken: getTokenFromHeader
  })
};

module.exports = auth;
