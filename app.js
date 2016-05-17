'use strict';

const PORT = 3000;
var express = require('express');
var morgan = require('morgan');
var http = require('http');
var path = require('path');
var uniqueRandomArray = require("unique-random-array");
var EventEmitter = require("events").EventEmitter;

var app = express();
var questionArr = require("./questions");

app.use(morgan('dev'));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

var server = http.createServer(app);

var io = require('socket.io')(server);

var messageLog = [];
var userCount = 0;
var currentGame = null;

// function Player(socket) {
//
// }
//
// Player.prototype.method = function () {
//
// };

var players = [];

class Game extends EventEmitter {
    constructor (players, questions) {
        super();
        this.selections = [];
        this.questions = questions;
        this.questionCount = questions.length;
        this.players = players;
        this.currentQuestion = null;
        this.getRandomQuestion = uniqueRandomArray(questions);
        this._onEventFromPlayers("selection", (player, answer) => {
            this.addAnswer(player, answer);
        });
    }

    _onEventFromPlayers (name, cb) {
        this.players.forEach(c => {
            c.socket.on(name, data => cb(c, data))
        })
    }

    _emitEventToPlayers (name, data) {
        this.players.forEach(player => player.socket.emit(name, data))
    }

    start () {
        this._emitEventToPlayers("gameStart");
        this.sendQuestion();
    }

    end (unfinished) {
        if (unfinished) {
            return this._emitEventToPlayers("gameError", "The other user was disconnected.");
        }
        this.determineWinner();
        this.emit("finish");
    }

    addAnswer (player, answer) {
        this.selections.push({
            answer: answer,
            user: player
        });

        player.checkAnswer(this.currentQuestion, answer);

        if (this.selections.length === this.questionCount) {
            this.end();
        } else {
            this.sendQuestion();
        }
    }


    determineWinner () {

        var p1s = this.players[0].score;
        var p2s = this.players[1].score;


        if (p1s === p2s) {
            this._emitEventToPlayers("gameEnd", "DRAW!");
            return;
        }

        var winner = this.players[p1s > p2s ? 0 : 1];
        var loser = this.players[p1s < p2s ? 0 : 1];
        winner.endGame("You won!");
        loser.endGame("You lost!");
    }

    sendQuestion () {
        var newQuestion = this.getRandomQuestion();
        this.currentQuestion = newQuestion;
        this._emitEventToPlayers("nextQuestion", newQuestion);
    }
}

class Player extends EventEmitter {
    constructor (socket) {
        super();
        this.socket = socket;
        this.score = 0;
    }

    checkAnswer(question, answer) {
        if (question.correctAnswer === answer) {
            ++this.score;
        } else {
            --this.score;
        }
    }

    endGame (message) {
        this.socket.emit("gameEnd", message);
    }
}

function resetPlayers() {
    players = [];
    userCount = 0;
    currentGame = null;
}

io.on('connection', function(socket) {

    if (currentGame) {
        return socket.emit("warning", "There is already a game started. Try to refresh the page to enter into the game.");
    }

    var currentPlayer = players[userCount] = new Player(socket);
    userCount++;

    if (userCount === 2) {
        currentGame = new Game(players, questionArr);
        currentGame.on("finish", () => {
            resetPlayers();
        });
        currentGame.start();
    }

    //take the input
    //determine the winner
    //am I answer 3
    //did you win?
    //if you have answer 1, you won...
    socket.on("error", err => {
        console.error(err);
    });

    socket.on('disconnect', function() {
        if (currentGame) {
            currentGame.end(true);
            resetPlayers();
        }
    });
});

server.listen(PORT, err => {
    console.log(err || `Server listening on port ${PORT}`);
});
