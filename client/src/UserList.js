import React from 'react';

const UserList = function(props) {
  return (
    <div>
      {props.users.map( function(user, index) {
        return (
          <div key={index}>
            <p>{user.name}</p>
          </div>
        );
      })}
    </div>
  );
};

export default UserList;
