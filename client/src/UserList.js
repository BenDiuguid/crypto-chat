import React from 'react';
import { List, ListItem } from 'material-ui/List';
import ContactsIcon from 'material-ui/svg-icons/communication/contacts';

const UserList = function(props) {
  return (
    <List>
      {props.users.map( function(user, index) {
        return (
          <ListItem
            key={index}
            primaryText={user.name}
            secondaryText={user._id}
            leftIcon={<ContactsIcon />}
            >
          </ListItem>
        );
      })}
    </List>
  );
};

export default UserList;
