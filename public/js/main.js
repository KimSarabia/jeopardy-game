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

var arr = [
  {"Question" :"Why is the sky blue?",
    "Option 1": "because molecules in the air scatter blue light from the sun",
    "Option 2": "Becasue of Nitrogen in the Air ",
    "Option 3": "Becasue of collison of air molecule ",
    "answer": "Option 1"​
  },
  {"Question" :"Why is the grass green?",
    "Option 1": "Becasue of chlorophyll",
    "Option 2": "They have diffentent cells ",
    "Option 3": "becasue of photosynthesis",
    "answer": "Option 1"​
  }
]

function getRandomQuestion(){

  console.log('RANDOM!');

  $.getJSON('./data.json', function(data) {
    console.log('JSON!');
    var entry = data[Math.floor(Math.random()*data.length)];
    //do the same exact thing with entry
    console.log(entry);
  })

}
