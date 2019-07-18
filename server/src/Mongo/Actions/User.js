const User = require("../Models/User").User

const encrypt = require("../../util/encrypt")

const addUser = (userData, cb) => {
      const newUser = new User(userData)
      newUser.save(function(err, doc){
            if(err) return cb(err)
            cb(null,"User Record Added Successfully")
      })
}

const updateMessageOrder = (user, name, cb) => {
      User.updateOne({username: user}, {"$pull":{"messagesOdrer": name} }, function(err, data){
            User.updateOne({username: user}, {"$push":{"messagesOdrer": name} }, function(err, data){
                  if(data) return cb(null, "success")
                  return cb(err)
            })
            
      })
}

const updateChats = (name,data, cb) => {
      User.updateOne({username: name}, {"$push":{"chats": {"$each": data}}}, function(err, data){
            if(data) return cb(null, "success")
            return cb(err)
      })
}

const _isUserExist = (userCred, cb, type, token) => {
      User.findOne({username: userCred.username}, function(err, user){
            if(err) return cb(err)
            if(user && user.username && user.password)  
            {          
                  if(type === "find"){
                        return cb(null,"User Found")
                  }
                  if(token){
                        delete user.password
                        return cb(null, user)
                  }
                  else{
                        encrypt.compare( userCred.password, user.password, (err, status)=>{
                              delete user.password
                              if(status === true){
                                    return cb(null, user)
                              }
                              else  {
                                    return cb(null,"User Not Found")
                              }
                        })
                  }
            }            
            else{
                  return cb(null,"User Not Found")
            }
      })
}

const getChats = (username, cb) =>{
      User.findOne({username: username}, function(err, user){
            if(err) return cb(err, null)
            cb(null, user.chats)
      })
} 

const isUserExist = (userCred, cb) => _isUserExist(userCred, cb, "find")
const getUser = (userCred, cb, token = true) => _isUserExist(userCred, cb, "get", token)


module.exports = {
      addUser,
      isUserExist,
      getUser,
      updateMessageOrder,
      updateChats,
      getChats
}