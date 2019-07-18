const mongoose = require('mongoose');
const user = require("./Actions/User")
 
// make a connection
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.connect("mongodb://localhost:27017/App").then((e) => console.log("Mongoose connected"))
.catch(e => console.log(e))
module.exports={
      user
}