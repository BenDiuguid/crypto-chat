import React from 'react';

const UserList = (props) => {
  const { users } = props;
  return (
    <div>
      {users.map( (user, index) =>
        <div key={index}>
          <p>{user.name}</p>
        </div>
      )}
    </div>
  );
};

export default UserList;
