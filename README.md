# crypto-chat

## Set up

Download [NodeJS](https://nodejs.org/en/) Probably the LTS (Long Term Stable) is best.

Then clone this repo, and run `npm install` twice, once in the `client/` directory, and once in the `server/` directory.

If you receive no errors you're good to move on, if you have errors, ask Ben. (NOTE: npm/node must be on your path.)

Then run `npm run dev` in the `server/` folder to start the server in "development" mode which will restart the server when files change.

Then run `npm run start` in the `client/` folder to start the client in "development" mode which will restart the client when files change.

## Encryption pattern

* Type message, hit send
* on client, encrypt with private/public key
* *client*: **emit sendHashed**
* server receives, and relays to everyone
* *server*: **broadcast hashedMessage**
* all clients receive hashedMessage
* they themselves encrypt message using their own private/public key
* *client*: **emit sendDoubleHashed**
* server receives double hashed, relays message to original client
* *server*: **emit** to original client **doubleHashedMessage**
* original client receives doubleHashed, un-hashes it's own part
* *client*: **emit sendUnhashed**
* server receives un-hashed single, and then relays to most previous hasher
* *server*: **emit** to client that asked **finalUnhash**
* client that asked un-hashes it and now can see the message!
