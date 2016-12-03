"use strict";

let users = [];

const socketSetup = (socket, io) => {

  // Upon socket disconnection, remove the disconnected socket from connections
  socket.on('disconnect', () => {
    console.log(`😭 socket DISCONNECTED with id: ${socket.id}`);
    users = users.filter( function(user) {
      return user._id !== socket.id;
    });
    io.emit('usersUpdated', users);
  });

  // When a user joins the chat, update the users.
  socket.on('joinChat', (user) => {
    console.log(`${user.name}\t\t joined`);
    users.push(user);
    io.emit('usersUpdated', users);
  });

  // server sees initial message, and sends it back to all clients except original
  socket.on('sendHashed', function(message) {
    console.log(`1)\t'sendHashed'\t\t: Received '${message.text}' from '${message.originalSender}' now broadcasting 'hashedMessage'`);
    Object.keys(io.sockets.sockets).filter(function(socketId) {
      return socketId !== message.originalSender;
    }).map(function(socketId) {
        io.sockets.sockets[socketId].emit('hashedMessage', message);
    });

  });

  // server receives double hashed message and relays it back to the original sender
  socket.on('sendDoubleHashed', function(message) {
    console.log(`2)\t'sendDoubleHashed'\t: Received '${message.text}' now single-emitting 'doubleHashedMessage' to '${message.originalSender}'`);
    io.sockets.sockets[message.originalSender].emit('doubleHashedMessage', message);
  });

  // server receives unhashed (from original), and relays back to the most previous requester.
  socket.on('sendUnhashed', function(message) {
    console.log(`3)\t'sendUnHashed'\t\t: Received '${message.text}' now single-emitting 'finalUnhash' to '${message.returnTo}'`);
    io.sockets.sockets[message.returnTo].emit('finalUnhash', message);
  });
};

module.exports = socketSetup;
