const jwt = require("jsonwebtoken")
const CONSTANTS = require('./const')

const createToken = (data, cb) => {
      jwt.sign({data}, CONSTANTS.PASSWORD, (err, Token) => {if(err) throw (err) ; cb(null,Token)})
}

const getDataFromToken = (token, cb) => {
      jwt.verify(token, CONSTANTS.PASSWORD, (err, data) => {if(err) throw (err) ; cb(null,data)})
}

module.exports = {
      createToken,
      getDataFromToken
}