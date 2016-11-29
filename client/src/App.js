import React, { Component } from 'react';
import InputWithButton from './utils/InputWithButton';
import ChatContainer from './ChatContainer';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.onNameSubmit = this.onNameSubmit.bind(this);
    this.state = {
      name: null,
    };
  }

  render() {
    return (
      <div className="app">
        <div className="app-header">
          <h1>Welcome to crypto-chat!</h1>
        </div>
        <div className="app-body">
          {this.state.name ?
            <ChatContainer name={this.state.name} /> :
            <InputWithButton onSubmit={this.onNameSubmit} buttonText="JOIN"/>
          }
        </div>
      </div>
    );
  }

  onNameSubmit(name) {
    this.setState({
      name: name,
    });
  }
}

export default App;
