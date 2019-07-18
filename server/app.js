const express = require('express')
const app = express()
const bodyParser = require("body-parser")
const mongo = require("./src/Mongo/server")
const util = require("./src/util/index")
const helmet = require("helmet")
const PORT = process.env.PORT || 3001
const socket = require("./src/Socket/index.js")
const socketIo = require("socket.io");
const cookieParser = require('cookie-parser');
const path = require("path")

app.use(helmet())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());


app.use(["/api/getFriendList","/api/load", "/api/addFriend"], function(req, resp, next){
      try{
            req.token = req.cookies['Authorization']
            if(!req.token){
                  resp.status(401).send("UnAuthorized");
                  return resp.end();
            }
            req.token = req.token.split(" ")[1]
            if(!req.token){
                  resp.status(401).send("UnAuthorized");
                  return resp.end();
            }
            util.getDataFromToken(req.token, (err, data)=>{
                  if(err || Object.keys(data).length === 0 ){
                        resp.status(401).send("UnAuthorized");
                        return resp.end();
                  }  
                  else{
                        req.token = data
                  }
            })
            next()
      }
      catch(ex){
            resp.status(401).send("UnAuthorized");
            return resp.end();
      }

})

app.get("/api/verifyToken", function(req, resp){
      if(req.cookies['Authorization'] && typeof req.cookies['Authorization'] === "string"){
            try{
                  let token = req.cookies['Authorization'].split(" ")[1]
                  util.getDataFromToken(token, (err, data)=>{
                        if(data){
                              if(Object.keys(data).length === 0 ){
                                    resp.status(200).send("Authorized");
                                    return resp.end()
                              }
                              else {
                                    resp.status(401).send("UnAuthorized");
                                    return resp.end();
                              }
                        }
                        else{
                              resp.status(200).send("Authorized");
                              return resp.end();                  
                        }
                  })
            }
            catch(er){
                  resp.status(401).send("UnAuthorized");
                  return resp.end();
            }
      }
      else{
            resp.status(200).send("Authorized");
            return resp.end();  
      }
})

app.post("/api/Register",function(req, resp){
      const addUserCb = (err, data) => {
            let link = req.protocol + '://' + req.get('host') + "/api/verify/user/" + util.genTokenFromKey(req.body.username)
            util.sendEmail(req.body.username, req.body.email, link, ()=>{
                  if(err) return resp.json({message: err}).status(500)
                  resp.json({message: data}).status(200)
            })
      }
      let time = new Date()
      mongo.user.addUser({
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            lastLogin: time.getTime(),
            isOnline: false,
            chats: JSON.stringify(req.body.chats)
      }, addUserCb)    
})


app.get("/api/verify/user/:id", function(req, resp){
      let id = req.params.id
      const cb = (err, data) => {
            if(data === "User Found"){
                  resp.statusCode = 302;
                  resp.setHeader("Location", "http://localhost:3001/");
                  return resp.end();
            }
            else{
                  resp.send("Incorrect")
                  return resp.end();
            }
      }
      mongo.user.isUserExist({username: util.genKeyFromToken(id)}, cb)
})


app.post("/api/getFriendList", function(req, resp){ 

      const cb = (err, data) =>{
            let activeUsers = socket.getNameSpaces(io)
            const setActiveStat = (e) => {
                  return  {
                        message: activeUsers.indexOf(e) != -1 ? "Online..." : "Offline...",
                        name: e
                  }
            }
            resp.json({data: Array.from(data.messagesOdrer.map(setActiveStat))}).status(200)       
      }
      mongo.user.getUser({
            username: req.token.data.username,
            password: req.token.data.password
      }, cb)
})

app.post("/api/load", function(req, resp){
      if(!req.token){
            resp.writeHead(404, {Location: 'http://localhost:3001'});
            return resp.end();
      }
      socket.createSocketConnection(io, req.token.data.username)  
      resp.json({data: req.token.data}).status(200)
})


app.post("/api/Login",function(req, resp){
      const findUserCb = (err, data) => {
            if((data &&  data.username != req.body.username) || err){
                  resp.send({message: (err || "User Not Found")}).status(500)
            }
            util.createToken(data, (err, token) => {
                  if(err) throw err
                  resp.cookie('Authorization',"Bearer " + token, { maxAge: 3600000, httpOnly: true });
                  resp.send("User Found").status(200)
            })
      }
      mongo.user.getUser({
            username: req.body.username,
            password: req.body.password
      }, findUserCb, false)
})


app.get("/api/Logout",function(req, resp){
      resp.clearCookie("Authorization")
      resp.send("OK")
      resp.end()
})


app.get("/api/addFriend", function(req, resp){

      const cb = (err, data) => {
            if(data === "User Found"){
                  let activeUsers = socket.getNameSpaces(io)
                  mongo.user.updateMessageOrder( req.token.data.username,req.query.name, (err, data)=>{
                        resp.json({msg: "Added", name:req.query.name, message: activeUsers.indexOf(req.query.names) != -1 ? "Online..." : "Offline..." }).status(200)
                  })
            }
            else{
                  resp.json({msg: "Something Wrong"}).status(500)
            }
      }

      mongo.user.isUserExist({username: req.query.name}, cb)
})


if (process.env.NODE_ENV === 'production') {
      app.use(express.static('build'));
      console.log(path.resolve(__dirname, 'build', 'index.html'))
      app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
      });
    }

const server = app.listen(PORT, function(){
      console.log(`Port listening from ${PORT}`)
})
const io = socketIo(server)


