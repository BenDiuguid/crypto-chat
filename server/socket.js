let users = [];

const socketSetup = (socket, io) => {

  // Upon socket disconnection, remove the disconnected socket from connections
  socket.on('disconnect', () => {
    console.log(`😭 socket DISCONNECTED with id: ${socket.id}`);
    users = users.filter( user => {console.log(user._id); return user._id !== socket.id} );
    io.emit('usersUpdated', users);
  });

  // When the server receives a sendMessage command
  // it emits a messageReceived event to all clients.
  socket.on('sendMessage', (message) => {
    console.log(`Received Message '${message.text}' now relaying it!`);
    io.emit('messageReceived', message);
  });

  socket.on('joinChat', (user) => {
    users.push(user);
    io.emit('usersUpdated', users);
  });
};

module.exports = socketSetup;
