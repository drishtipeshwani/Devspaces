const express = require('express');
const {Server} = require('socket.io');
const http = require('http')

const app = express();  // Create an instance of express
const server = http.createServer(app)  // Create an instance of http server
const io = new Server(server); // Create an instance of socket.io server

// Switching on the server socket to listen for connections
io.on('connection', (socket) => {
   console.log(socket.id+' connected');
})

const PORT = process.env.SERVER_PORT || 5000;

server.listen(PORT,()=>{console.log('Listening on  '+PORT)});