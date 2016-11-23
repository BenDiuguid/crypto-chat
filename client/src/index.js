import React from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';
import { SocketProvider } from 'socket.io-react';

import App from './App';
import './index.css';

const socketPORT = 1337;
const socketURL = `//localhost:${socketPORT}`;

const socket = io.connect(socketURL);

const DOMNode = document.getElementById('root');

ReactDOM.render(
  <SocketProvider socket={socket}>
    <App />
  </SocketProvider>,
  DOMNode
);
