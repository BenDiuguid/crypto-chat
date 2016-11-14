const path = require('path');
const cors = require('cors');
const express = require('express');

// Initialize express/http server
const app = express();
const http = require('http').Server(app);

const PORT = 1337;
const PATHS = {
  client: path.join(__dirname, '../client/build')
};

// Setup http server.
http.listen(PORT, () => {
  console.log(`==> Listening on port: ${PORT}`);
  setInterval(() => {
    console.log(`connections: \n\t${(connections.map(con => con._id)).join('\n\t')}\n`);
  }, 10 * 1000);
});

// Configure Express
app.use(express.static(PATHS.client));
app.use(cors());
app.get('/', function(req, res) {
  res.sendFile(path.join(PATHS.client, 'index.html'));
});

// Global Array of all connections to connected clients
let connections = [];

const io = require('socket.io')(http);

io.on('connection', (socket) => {

  // Push all connected clients
  connections.push({ _id: socket.id });
  console.log(`😎 socket CONNECTED with id: ${socket.id}`);

  // Upon socket disconnection, remove the disconnected socket from connections
  socket.on('disconnect', () => {
    console.log(`😭 socket DISCONNECTED with id: ${socket.id}`);
    connections = connections.filter(
      con => con._id !== socket.id
    );
  });

  // When the server receives a sentMessage command
  // it emits a receivedMessage event to all clients.
  socket.on('sentMessage', (message) => {
    io.emit('receivedMessage', message);
  });

});

// Helper method to find a connection, based on id.
function findConnection(id, connections) {
  const conArray = connections.filter(con => con._id === id)
  if (conArray.length > 0) {
    return conArray[0];
  } else {
    return undefined;
  }
}
