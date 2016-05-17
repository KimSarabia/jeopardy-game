'use strict';

var socket, player;

$(() => {

    socket = io();

    socket.on('playerNum', playerNum => {
        player = playerNum;
        $('#status').text(`Waiting for opponent`)
    });

    socket.on('gameStart', () => {

        getRandomQuestion();

        if (player) {
            $('#answersButtons').show();
            $('#status').text(`Pick the right answer!`)

        }
    });

    $('.answersButton').on('click', makeSelection);
});

function makeSelection(e) {

    $('.answersButton').off('click');
    $(e.target).addClass('active');

    var selection = $(e.target).data('rps');
    socket.emit('selection', selection)

    console.log('e.target:', e.target);
}


var questionArr = [
  {
    "question":"Why is the sky blue?",
    "option1":"Molecules in the air scatter blue light from the sun.",
    "option2":"The ocean is reflected in the sky.",
    "option3":"The color of outer space.",
    "correctAnswer":"option1"
  },
  {
    "question": "Why is the grass green?",
    "option1":"The water in the cells",
    "option2":"Photosynthesis is taking place",
    "option3":"They produce a bright pigment called chlorophyll",
    "correctAnswer":"option3"
  }
];
