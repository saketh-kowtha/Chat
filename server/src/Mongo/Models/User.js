const mongoose = require("mongoose")
const encrypt = require("../../util/encrypt")

const UserSchema = mongoose.Schema({
      username: {
            type: String,
            trim: true,
            index: true, 
            unique: true
      },
      password: {
            type: String,
            minlength: 6,
            trim: true
      },
      phoneNumber: {
            type: String,
            index: true, 
            unique: true
      },
      email: {
            type: String,
            unique: true,
            trim: true,
            index: true, 
            unique: true
      },
      lastLogin: String,
      isOnline: {
            type: Boolean,
      },
      verified: Boolean,
      chats: {
            type: Array,
            default: []
      },
      messagesOdrer: {type:Array, default:[]}
})

UserSchema.pre('save', function(next){
      let user = this;
      if(!user.isModified("password")) 
            return next()
      encrypt.encrypt(user.password, (hash)=>{
            user.password = hash
            next()
      })
})




// const 
const User = mongoose.model('User', UserSchema)
module.exports = {
      User
}