import React from 'react';

const ChatMessages = (props) => {
  const { messages } = props;
  return (
    <div>
      {messages.map( (message, index) =>
        <div key={index}>
          <strong>{message.name}</strong>
          <p>{message.text}</p>
        </div>
      )}
    </div>
  );
};

export default ChatMessages;
