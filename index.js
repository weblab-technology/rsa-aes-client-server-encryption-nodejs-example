const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const rsaWrapper = require('./components/rsa-wrapper');
const aesWrapper = require('./components/aes-wrapper');

rsaWrapper.initLoadServerKeys(__dirname);
rsaWrapper.serverExampleEncrypt();

// middleware for static processing
app.use(express.static(__dirname + '/static'));

// web socket connection event
io.on('connection', function(socket){
    let message =  'Hello';
    let encrypted = rsaWrapper.encrypt(rsaWrapper.clientPub, message);

    socket.emit('rsa server encrypted message', encrypted);

    socket.on('rsa client encrypted message', function (data) {
        console.log('server received RSA message from client');
        console.log(data);
        console.log(rsaWrapper.decrypt(rsaWrapper.serverPrivate, data));
    });

    let aesKey = aesWrapper.generateKey();
    let aesIv = aesWrapper.generateIv();
    let encryptedMessage = aesWrapper.encrypt(aesKey, aesIv, 'Server AES message');
    encryptedMessage = aesWrapper.addIvToBody(aesIv, encryptedMessage);

    socket.emit('aes server encrypted message', { key:aesKey.toString('base64'), message: encryptedMessage});

    socket.on('aes client encrypted message', function (data) {
        console.log('server received AES message from client');
        console.log(data);
        console.log(aesWrapper.decrypt(aesKey, data));
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});
