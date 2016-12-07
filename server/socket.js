"use strict";
const chalk = require('chalk');

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
    console.log(`${user.name}\t\t joined with id: \t'${user._id}'`);
    users.push(user);
    io.emit('usersUpdated', users);
  });

  // server relays messages from the original sender, to who the message was designated for.
  socket.on('sendEncrypted', function(message) {
    console.log(`\nReceived '${chalk.red(message.text)}' from '${chalk.green(message.originalSender)}' to '${chalk.yellow(message.sendingTo)}' \n`);
    io.sockets.sockets[message.sendingTo].emit('receiveEncrypted', message);
  });

};

module.exports = socketSetup;
