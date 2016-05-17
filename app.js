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
    console.log('userCount:', userCount);

    if (userCount === 1 || userCount === 2) {
        socket.emit('playerNum', userCount);
    }

    if (userCount === 2) {
        io.emit('gameStart', null);
    }

//take the input
//determine the winner
//am I answer 3
//did you win?
//if you have answer 1, you won...

    socket.on('selection', selection => {
        console.log('selection:', selection);
        selections.push(selection);

        //we've made both selections once selections is two, and then we can figure out the winner

        if (selections.length === 2) {
            var winner = determineWinner(selections);
            io.emit('winner', winner);
            selections = [];
        }
    })


    socket.on('disconnect', function() {
        console.log('Client disconnected');

        userCount--;
        console.log('userCount:', userCount);
    });

});
//
// function determineWinner(selections) {
//     var options = ['option1', 'option2', 'option3'];
//
//     if (selections[0] === selections[1]) {
//         return 'draw';
//     }
//     for(var i = 0; i < options.length; i++){
//       if(selections.indexOf(options[i]) === -1)
//     }
// }

function getRandomQuestion(){
  console.log('RANDOM QUESTION!');
  var randomQuestion = questionArr[Math.floor(Math.random()*questionArr.length)];
  console.log('RANDOM QUESTION OBJ:', randomQuestion);
  $(".questionTitle").append(randomQuestion.question);
  $("#option1").append(randomQuestion.option1);
  $("#option2").append(randomQuestion.option2);
  $("#option3").append(randomQuestion.option3);
}

function determineWinner(selections) {

}

server.listen(PORT, err => {
    console.log(err || `Server listening on port ${PORT}`);
});
