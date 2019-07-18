const sendEmail = require("./mailer").sendMail
const verifyToken = require("./encrypt")
const tokens = require("./tokens")


module.exports = {
      sendEmail,
      genTokenFromKey: verifyToken.genTokenFromKey,
      genKeyFromToken: verifyToken.genKeyFromToken,
      createToken: tokens.createToken,
      getDataFromToken: tokens.getDataFromToken
}