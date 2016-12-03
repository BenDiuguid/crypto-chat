import React, { Component } from 'react';
import { socketConnect } from 'socket.io-react';
import ChatMessages from './ChatMessages';
import UserList from './UserList';
import InputWithButton from './utils/InputWithButton';

class ChatContainer extends Component {
  constructor(props) {
    super(props);

    this.sendHashed = this.sendHashed.bind(this);
    this.hashedMessage = this.hashedMessage.bind(this);
    this.doubleHashedMessage = this.doubleHashedMessage.bind(this);
    this.finalUnhash = this.finalUnhash.bind(this);
    this.hash = this.hash.bind(this);
    this.unhash = this.unhash.bind(this);
    this.usersUpdated = this.usersUpdated.bind(this);

    this.state = {
      messages: [],
      users: [],
      publicKey: null,
      privateKey: null,
    };
  }

  // send new message
  sendHashed(text) {
    const hashedText = this.hash(text);

    const message = {
      text: hashedText,
      name: this.props.name,
      originalSender: this.props.socket.id,
      returnTo: null,
    };

    this.props.socket.emit('sendHashed', message);

    const newMessage = {
      ...message,
      text: text,
    };

    this.setState({
      ...this.state,
      messages: [
        ...this.state.messages,
        newMessage
      ]
    });
  }

  // new message received
  hashedMessage(singleHashedMessage) {
    // We have received a brand new message!
    // We must hash the message using our private key then send back to the server
    const doubleHashedMessageText = this.hash(singleHashedMessage.text);

    this.props.socket.emit('sendDoubleHashed', {
      ...singleHashedMessage, // This spreads out the message object's properties into this new object.
      text: doubleHashedMessageText, // This overrides the message.text field into this new object.
      returnTo: this.props.socket.id, // This overrides message.returnTo
    });
  }

  // unhash our part and send back for everyone else
  doubleHashedMessage(doubleHashedMessage) {
    const singleHashedMessageText = this.unhash(doubleHashedMessage.text);

    this.props.socket.emit('sendUnhashed', {
      ...doubleHashedMessage, // This spreads out the message object's properties into this new object.
      text: singleHashedMessageText, // This overrides the message.text field into this new object.
    });
  }

  // received single hashed message with only our part left
  finalUnhash(ourHashedMessage) {
    const unhashedMessageText = this.unhash(ourHashedMessage.text);

    const newMessage = {
      ...ourHashedMessage,
      text: unhashedMessageText
    };

    this.setState({
      ...this.state,
      messages: [
        ...this.state.messages,
        newMessage
      ]
    });
  }

  // receive the new uesers from the server and simply replace ours.
  usersUpdated(users) {
    this.setState({
      ...this.state,
      users: users,
    });
  }

  // hash the text using our public/private keys
  hash(text) {
    // const publicKey = this.state.publicKey;
    // const privateKey = this.state.privateKey;

    // TODO: actually hash

    return text;
  }

  // unhash the text using our public/private keys
  unhash(text) {
    // const publicKey = this.state.publicKey;
    // const privateKey = this.state.privateKey;

    // TODO: actually unhash

    return text;
  }

  componentDidMount() {
    this.props.socket.on('hashedMessage', this.hashedMessage);
    this.props.socket.on('doubleHashedMessage', this.doubleHashedMessage);
    this.props.socket.on('finalUnhash', this.finalUnhash);
    this.props.socket.on('usersUpdated', this.usersUpdated);

    // TODO: actually create keys
    const publicKey = null;
    const privateKey = null;

    this.setState({
      ...this.state,
      publicKey: publicKey,
      privateKey: privateKey,
    });

    this.props.socket.emit('joinChat', {
      name: this.props.name,
      _id: this.props.socket.id,
      publicKey: publicKey,
    });
  }

  componentDidUnMount() {
    this.props.socket.removeListener('hashedMessage');
    this.props.socket.removeListener('doubleHashedMessage');
    this.props.socket.removeListener('finalUnhash');
    this.props.socket.removeListener('usersUpdated');
  }

  render() {
    return (
      <div>
        <h1>
          HELLO {this.props.name}
        </h1>
        <div className="message-list">
          <ChatMessages messages={this.state.messages} />
          <InputWithButton onSubmit={this.sendHashed} buttonText="SEND" />
        </div>
        <div className="user-list">
          <UserList users={this.state.users}/>
        </div>
      </div>
    );
  }
}

export default socketConnect(ChatContainer);
