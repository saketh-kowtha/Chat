var nodemailer = require('nodemailer');
const email = require("./const").EMAIL
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: email
});




const sendMail = (name, to, link, cb,) => {
      let content = `Hello ${name},<br><br>Please verify your account by openining below link.<br><a href='${link}'>Click to verify</a>.<br><br>Thanks,<br>Team Hola.`
      var mailOptions = {
            from: email.user,
            subject: 'Hola - Verify',
            html: content,
            to: to
      };          
      transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              cb(error)
              throw error
            } else {
              cb("Succsess")
            }
          }); 
}
module.exports = {
      sendMail
}