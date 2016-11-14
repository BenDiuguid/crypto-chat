import React, { Component } from 'react';
import './App.css';
import socketClient from 'socket.io-client';

const socketPORT = 1337;
const socketURL = `//localhost:${socketPORT}`;

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      socket: null,
    };
  }
  componentDidMount() {
    const socket = socketClient(socketURL);
    this.setState({
      socket
    });
  }
  render() {
    if(this.state.socket) {
      return (
        <div className="App">
          <h1>
            💥 CONNECTED! 💥
          </h1>
        </div>
      );
    }
    return (
      <div className="App">
        <h1>
          🚧 CONNECTING... 🚧
        </h1>
      </div>
    );
  }
}

export default App;
