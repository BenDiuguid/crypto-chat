const path = require('path');
const cors = require('cors');
const express = require('express');
const NodeRSA = require('node-rsa');

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
});

// Configure Express
app.use(express.static(PATHS.client));
app.use(cors());
app.get('/', function(req, res) {
  res.sendFile(path.join(PATHS.client, 'index.html'));
});


const io = require('socket.io')(http);
const socketSetup = require('./socket');

io.on('connection', (socket) => {
  console.log(`😎 socket CONNECTED with id: ${socket.id}`);
  socketSetup(socket, io);
});
