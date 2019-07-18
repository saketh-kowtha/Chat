const fs = require("fs")
const path = require('path')

const loginLogsFile = path.join(__dirname, 'loginLogs.logs')

const entryLogsFile = path.join(__dirname, 'entry.logs')

const entryLogs = (message) => {
      appendFile(entryLogsFile, message)
}


const loginLogs = (message) => {
      appendFile(loginLogsFile, message)
}

const appendFile = (file, content) => {
      fs.appendFile(file,  content, "utf8", function(err, data){
            if(err) return err
      })
}

module.exports= {
      loginLogs,
      entryLogs
}