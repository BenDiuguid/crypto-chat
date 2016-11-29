import React from 'react';

const ChatMessages = function(props) {
  return (
    <div>
      {props.messages.map( function(message, index) {
        return (
          <div key={index}>
            <strong>{message.name}</strong>
            <p>{message.text}</p>
          </div>
        );
      })}
    </div>
  );
};

export default ChatMessages;
