import React from 'react';
import { List, ListItem } from 'material-ui/List';
import MessageIcon from 'material-ui/svg-icons/communication/message';

const ChatMessages = function(props) {
  return (
    <List>
      {props.messages.map( function(message, index) {
        return (
          <ListItem
            key={index}
            primaryText={message.name}
            secondaryText={message.text}
            leftIcon={<MessageIcon />}
            >
          </ListItem>
        );
      })}
    </List>
  );
};

export default ChatMessages;
