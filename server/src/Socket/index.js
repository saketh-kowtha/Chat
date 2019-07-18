
const users = {}
const toneAnalyzer = require("../../tone").tone
const util = require("../Mongo/server")
const createSocketConnection = (socketIo, name) => {
      var nsp = socketIo.of("/"+name);
      nsp.on('connection', function(socket) {
            let disConnect = "" 
            chats = []
            socket.on('sendMessage', function(data) {
                  if(users && data && data.to && users[data.to]){
                        let d = new Date()
                        data.ts = d.getTime()
                        chats.push(data)
                        util.user.updateMessageOrder(name, data.to, (err, succ) => console.log(err, succ))
                        //
                        toneAnalyzer(data.message, (tones)=>{
                              tones = JSON.parse(tones)
                              data.tone = tones["document_tone"]["tones"].map(e=> e.tone_name)
                              users[data.to].emit("receiveMessage", data)
                        }) 
                              // users[data.to].emit("receiveMessage", data)

                  }
                  else if(users && data && data.to){
                        //update to chat order
                        let d = new Date()
                        data.ts = d.getTime()
                        chats.push(data)
                        util.user.updateMessageOrder(data.to, name, (err, succ) => console.log(err, succ))
                  }
                  
            });

            socket.on("status event", function(data){
                  util.user.getChats(data.name, (er, data) => {
                        if(data){
                              chatData=data.filter(e => e.to === name)
                              nsp.emit("receiveData", chatData)
                        }
                  })
                  disConnect = data.name
            })

            socket.on("typing", function(data){
                  if(disConnect && users[disConnect])
                  {
                        users[disConnect].emit("isTyping", {status: data.status  || "Online..."})
                  }
            })
            socket.on('disconnect', function(socket) {
                  if(disConnect && users[disConnect])
                  {
                        let date = new Date()
                        date = date.getHours() + ":" + date.getMinutes() 
                        users[disConnect].emit("userOffline", {lastSeen: date, ts: date})
                  }
                  //update chats in to db
                  util.user.updateChats(name,chats, (e, d)=> console.log(e,d))
                  delete users[name]
                  delete socketIo.nsps["/"+name]
            });
 
      });
      users[name] = nsp
}   



const getNameSpaces =(socketIo)=>{
      return Object.keys(socketIo.nsps)
}


module.exports = {
      createSocketConnection,
      getNameSpaces
}