const express = require('express');
const cors = require('cors');
const axios = require('axios');
const {Server} = require('socket.io');
const http = require('http');
const ACTIONS = require('../src/Actions');

const app = express();  // Create an instance of express
const server = http.createServer(app)  // Create an instance of http server
const io = new Server(server); // Create an instance of socket.io server


// Storing a client list
const clients = new Map();


// Switching on the server socket to listen for connections
io.on('connection', (socket) => {

   const clientSocketId = socket.id;   
   
   console.log(clientSocketId+' connected');

   socket.on(ACTIONS.JOIN,({roomId,username})=>{
       console.log(roomId,username)
         clients.set(socket.id,{
               roomId,
               username,
               socketId: socket.id,
         })
        socket.join(roomId);
       const clientlist = Array.from(clients.values())
       clientlist.forEach(client=>{
         io.to(client.socketId).emit(ACTIONS.JOINED,{
             clientlist,
               username,
               socketId: socket.id,
         })
       })
   })

   
  // The server is listening to two events Code Change and Code Sync
   // Code Change is emitted when the user changes the code
   // Code Sync is called when the user joins the room to sync the previously typed code

   socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
  });

socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
    io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  // Input Change is emitted when the user changes the input
  // Input Sync is called when the user joins the room to sync the previously typed input
  socket.on(ACTIONS.INPUT_CHANGE, ({ roomId, input }) => {
    socket.in(roomId).emit(ACTIONS.INPUT_CHANGE, { input });
  }
  );

  socket.on(ACTIONS.SYNC_INPUT, ({ socketId, input }) => {
    io.to(socketId).emit(ACTIONS.INPUT_CHANGE, { input });
  }
  );

  // Output Change is emitted when the user changes the output
  // Output Sync is called when the user joins the room to sync the previously typed output
  socket.on(ACTIONS.OUTPUT_CHANGE, ({ roomId, output }) => {
    socket.in(roomId).emit(ACTIONS.OUTPUT_CHANGE, { output });
  }
  );

  socket.on(ACTIONS.SYNC_OUTPUT, ({ socketId, output }) => {
    io.to(socketId).emit(ACTIONS.OUTPUT_CHANGE, { output });
  }
  );

  socket.on(ACTIONS.LANGUAGE_CHANGE, ({ roomId, language }) => {
    socket.in(roomId).emit(ACTIONS.LANGUAGE_CHANGE, { language });
  }
  );

  socket.on(ACTIONS.SYNC_LANGUAGE, ({ socketId, language }) => {
    io.to(socketId).emit(ACTIONS.LANGUAGE_CHANGE, { language });
  }
  );

  socket.on(ACTIONS.LOADING_CHANGE, ({ roomId, loading }) => {
    socket.in(roomId).emit(ACTIONS.LOADING_CHANGE, { loading });
  }
  );

  socket.on(ACTIONS.SYNC_LOADING, ({ socketId, loading }) => {
    io.to(socketId).emit(ACTIONS.LOADING_CHANGE, { loading });
  }
  );

  socket.on(ACTIONS.VIDEO_CHANGE, ({ roomId, video }) => {
    socket.in(roomId).emit(ACTIONS.VIDEO_CHANGE, { video });
  }
  );

  socket.on(ACTIONS.SYNC_VIDEO, ({ socketId, video }) => {
    io.to(socketId).emit(ACTIONS.VIDEO_CHANGE, { video });
  }
  );


   // Disconnecting the current socket
    socket.on('disconnecting',()=>{
        console.log(clientSocketId+' disconnected')
        // Getting the list of all the present rooms
        const rooms = Object.keys(socket.rooms);
        rooms.forEach(roomId=>{  
          socket.in(roomId).emit(ACTIONS.DISCONNECTED,{
            socketId: socket.id,
            username: clients.get(socket.id).username,
          })
        })
        clients.delete(socket.id);
        socket.leave();
    })
   
})

const PORT = process.env.SERVER_PORT || 5000;

server.listen(PORT,()=>{console.log('Listening on  '+PORT)});