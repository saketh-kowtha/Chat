const crypto = require('crypto');
const bcrypt = require('bcrypt');
const CONSTANTS = require('./const')
const genTokenFromKey = (_key) =>{
      let key = crypto.createCipher('aes-128-cbc', CONSTANTS.PASSWORD);
      let token = key.update(_key, 'utf8', 'hex')
      token += key.final('hex');
      return token
}

const genKeyFromToken = (_token) =>{
      var token = crypto.createDecipher('aes-128-cbc', CONSTANTS.PASSWORD);
      var key = token.update(_token, 'hex', 'utf8')
      key += token.final('utf8');
      return key
}


const encrypt = (text, cb) => {
      bcrypt.hash(text, CONSTANTS.SALT, (err, hash)=>{
            if(err) throw err
            cb(hash)
      })
}


const compare = (text, hash,cb) => {
      bcrypt.compare(text, hash, cb)
}


module.exports = {
      genTokenFromKey,
      genKeyFromToken,
      encrypt,
      compare
}