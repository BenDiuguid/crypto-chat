import React, { Component } from 'react';
import { socketConnect } from 'socket.io-react';
import ChatMessages from './ChatMessages';
import UserList from './UserList';
import InputWithButton from './utils/InputWithButton';
import NodeRSA from 'node-rsa';

class ChatContainer extends Component {
  constructor(props) {
    super(props);

    this.sendEncrypted = this.sendEncrypted.bind(this);
    this.receiveEncrypted = this.receiveEncrypted.bind(this);
    this.encrypt = this.encrypt.bind(this);
    this.decrypt = this.decrypt.bind(this);
    this.usersUpdated = this.usersUpdated.bind(this);

    this.state = {
      messages: [],
      users: [],
      publicKey: null,
      privateKey: null,
    };
  }

  // send new message
  sendEncrypted(text) {

    const message = {
      text: null, // Override this when sending.
      name: this.props.name,
      originalSender: this.props.socket.id,
      sendingTo: null, // Override this when sending.
    };

    // const encryptedText = this.encrypt(text, this.state.publicKey); // Override with encrypted text.

    this.state.users.forEach( (user) => {
      if(user.publicKey !== this.state.publicKey) {
        const encryptedText = this.encrypt(text, user.publicKey);
        message.text = encryptedText;
        message.sendingTo = user._id;

        this.props.socket.emit('sendEncrypted', message);
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

  // received single encrypted message with only our part left
  receiveEncrypted(ourEncryptedMessage) {
    const otherPublicKey = this.state.users.filter( function(user) {
      return user._id === ourEncryptedMessage.originalSender;
    })[0].publicKey;

    const decryptedMessageText = this.decrypt(ourEncryptedMessage.text, otherPublicKey);

    const newMessage = {
      ...ourEncryptedMessage,
      text: decryptedMessageText
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
    console.log(users);
    this.setState({
      ...this.state,
      users: users,
    });
  }

  // encrypt the text using our public/private keys
  encrypt(text, publicKey) {
    const privateKey = this.state.privateKey;

    const myKey = new NodeRSA();
    myKey.importKey(privateKey, 'private');

    const otherKey = new NodeRSA();
    otherKey.importKey(publicKey, 'public');

    return otherKey.encrypt(
      myKey.encryptPrivate(text, 'base64'),
      'base64',
      'base64'
    );
  }

  // decrypt the text using our public/private keys
  decrypt(text, publicKey) {
    const privateKey = this.state.privateKey;

    const myKey = new NodeRSA();
    myKey.importKey(privateKey, 'private');

    const otherKey = new NodeRSA();
    otherKey.importKey(publicKey, 'public');

    return otherKey.decryptPublic(
      myKey.decrypt(text, 'base64'),
      'utf8'
    );
  }

  componentDidMount() {
    this.props.socket.on('receiveEncrypted', this.receiveEncrypted);
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
    this.props.socket.removeListener('receiveEncrypted');
    this.props.socket.removeListener('usersUpdated');
  }

  render() {
    return (
      <div className="app-body">
        <h1>
          Hello {this.props.name}
        </h1>
        <div className="list-container">
          <div className="user-list">
            <h4>Users</h4>
            <UserList users={this.state.users}/>
          </div>
          <div className="message-list">
            <h4>Messages</h4>
            <ChatMessages messages={this.state.messages} />
            <InputWithButton onSubmit={this.sendEncrypted} buttonText="SEND" />
          </div>
        </div>
      </div>
    );
  }
}

export default socketConnect(ChatContainer);
