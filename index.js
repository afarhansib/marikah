// const { stat } = require('node:fs')
const dirTree = require('directory-tree')
const chokidar = require('chokidar')
const express = require('express')
const app = express()
const { createServer } = require("http");
const { Server } = require("socket.io");
const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });
console.log(process.argv.slice(2)[0])
let directoryToWatch = './' + process.argv.slice(2)[0]
let watcherInitiated = false
let entireDirectory
const watcher = chokidar.watch(directoryToWatch)

app.set('port', (process.env.PORT || 3000))
app.use(express.static('client/dist'))

app.get('/', function(request, response) {
  response.sendFile(__dirname + '/client/index.html')
})

httpServer.listen(app.get('port'), function() {
  console.log('Node app is running on port ', app.get('port'))
})

watcher.on('all', (event, path) => {
  if (watcherInitiated === true) {
    entireDirectory = dirTree(directoryToWatch)
    console.log(entireDirectory)
  }
})

watcher.on('ready', () => {
  watcherInitiated = true
  entireDirectory = dirTree(directoryToWatch)
  console.log('Entire directory initiated.')
  console.log(entireDirectory)
})

io.on('connection', (socket) => {
  console.log('a user connected')
  io.emit('directoryUpdate', entireDirectory)
  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})
// stat('./Watch/0. Ahmad Farhan Sibghotalloh/Picture1.jpg', (err, stats) => {
//   console.log(stats.isDirectory())
//   console.log(stats)
// })