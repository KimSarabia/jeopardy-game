'use strict';

const PORT = 3000;
var express = require('express');
var morgan = require('morgan');
var http = require('http');
var path = require('path');

var app = express();

app.use(morgan('dev'));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

var server = http.createServer(app);

var io = require('socket.io')(server);

var messageLog = [];
var userCount = 0;

io.on('connection', function(socket) {
    // console.log(socket);
    console.log('Client connected');

    userCount++;

    if (userCount === 1 || userCount === 2) {
        socket.emit('playerNum', userCount);
    }

    if (userCount === 2) {
        io.emit('gameStart', null);
    }

    socket.on('selection', selection => {
        console.log('selection:', selection);
        selections.push(selection);

        if (selections.length === 2) {
            var winner = determineWinner(selections);
            io.emit('winner', winner);
        }
    })


    socket.on('disconnect', function() {
        console.log('Client disconnected');

        userCount--;
        console.log('userCount:', userCount);
    });

});

function determineWinner(selections) {
    var options = ['option1', 'option2', 'option3'];

    if (selections[0] === selections[1]) {
        return 'draw';
    }
}

server.listen(PORT, err => {
    console.log(err || `Server listening on port ${PORT}`);
});
