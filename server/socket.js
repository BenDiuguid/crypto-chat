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

  // server relays messages from the original sender, to who the message was designated for.
  socket.on('sendHashed', function(message) {
    console.log(`Received '${message.text}' from '${message.originalSender}' to '${message.sendingTo}' `);
    io.sockets.sockets[message.sendingTo].emit('receiveHashed', message);
  });

};

module.exports = socketSetup;
