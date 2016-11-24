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
    this.usersUpdated = this.usersUpdated.bind(this);

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
    });
  }

  usersUpdated(users) {
    this.setState({
      ...this.state,
      users,
    });
  }

  componentDidMount() {
    this.props.socket.on('messageReceived', this.messageReceived);
    this.props.socket.on('usersUpdated', this.usersUpdated);

    // TODO: create and emit public key here
    this.props.socket.emit('joinChat', {
      name: this.props.name,
      _id: this.props.socket.id,
    });
  }

  componentDidUnMount() {
    this.props.socket.removeListener('messageReceived');
    this.props.socket.removeListener('usersUpdated');
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
