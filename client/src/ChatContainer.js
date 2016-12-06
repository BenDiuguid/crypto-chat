import React, { Component } from 'react';
import { socketConnect } from 'socket.io-react';
import ChatMessages from './ChatMessages';
import UserList from './UserList';
import InputWithButton from './utils/InputWithButton';
import NodeRSA from 'node-rsa';

class ChatContainer extends Component {
  constructor(props) {
    super(props);

    this.sendHashed = this.sendHashed.bind(this);
    this.receiveHashed = this.receiveHashed.bind(this);
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

    const message = {
      text: null, // Override this when sending.
      name: this.props.name,
      originalSender: this.props.socket.id,
      sendingTo: null, // Override this when sending.
    };

    // const hashedText = this.hash(text, this.state.publicKey); // Override with encrypted text.

    this.state.users.forEach( (user) => {
      if(user.publicKey !== this.state.publicKey) {
        console.log('SENDING');
        const hashedText = this.hash(text, user.publicKey); // Override with encrypted text.
        message.text = hashedText;
        message.sendingTo = user._id;

        this.props.socket.emit('sendHashed', message);
      }
    });

    message.text = text;

    this.setState({
      ...this.state,
      messages: [
        ...this.state.messages,
        message
      ]
    });
  }

  // received single hashed message with only our part left
  receiveHashed(ourHashedMessage) {
    const otherPublicKey = this.state.users.filter( function(user) {
      return user._id === ourHashedMessage.originalSender;
    })[0].publicKey;

    const unhashedMessageText = this.unhash(ourHashedMessage.text, otherPublicKey);

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
  hash(text, publicKey) {
    const privateKey = this.state.privateKey;

    const myKey = new NodeRSA();
    myKey.importKey(privateKey, 'private');

    const otherKey = new NodeRSA();
    otherKey.importKey(publicKey, 'public');

    return otherKey.encrypt(myKey.encryptPrivate(text, 'base64'), 'base64', 'base64');
  }

  // unhash the text using our public/private keys
  unhash(text, publicKey) {
    console.log(`unhashed: ${text}`);
    const privateKey = this.state.privateKey;

    const myKey = new NodeRSA();
    myKey.importKey(privateKey, 'private');

    const otherKey = new NodeRSA();
    otherKey.importKey(publicKey, 'public');

    return otherKey.decryptPublic(myKey.decrypt(text, 'base64'), 'utf8');
  }

  componentDidMount() {
    this.props.socket.on('receiveHashed', this.receiveHashed);
    this.props.socket.on('usersUpdated', this.usersUpdated);

    const key = new NodeRSA({b: 512});

    const publicKey = key.exportKey('public');
    const privateKey = key.exportKey('private');

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
    this.props.socket.removeListener('receiveHashed');
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
