import React, { Component } from 'react';
import { socketConnect } from 'socket.io-react';
import ChatMessages from './ChatMessages';
import UserList from './UserList';
import InputWithButton from './utils/InputWithButton';

class ChatContainer extends Component {
  constructor(props) {
    super(props);

    this.sendMessage = this.sendMessage.bind(this);
    this.messageReceived = this.messageReceived.bind(this);
    this.state = {
      messages: [],
      users: [],
    };
  }

  sendMessage(text) {
    this.props.socket.emit('sendMessage', {
      text,
      name: this.props.name,
    });
  }

  messageReceived(message) {
    this.setState({
      ...this.state,
      messages: [
        ...this.state.messages,
        message,
      ]
    })
  }

  componentDidMount() {
    this.props.socket.on('messageReceived', this.messageReceived);
  }

  componentDidUnMount() {
    this.props.socket.removeListener('messageReceived');
  }

  render() {
    const { name } = this.props;
    return (
      <div>
        <h1>
          HELLO {name}
        </h1>
        <div className="message-list">
          <ChatMessages messages={this.state.messages} />
          <InputWithButton onSubmit={this.sendMessage} buttonText="SEND" />
        </div>
        <div className="user-list">
          <UserList users={this.state.users}/>
        </div>
      </div>

    );
  }
}

export default socketConnect(ChatContainer);
