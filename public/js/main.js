'use strict';

$(() => {
    function makeSelection(e) {
        $(e.target).addClass('active');
        var selection = $(this).data('answer');
        socket.emit('selection', selection);
    }

    var socket = io();
    socket.on("warning", message => alert(message));

    $('#status').text(`Waiting for opponent`);

    socket.on('nextQuestion', randomQuestion => {
      console.log('RANDOM QUESTION OBJ:', randomQuestion);
      $(".questionTitle").text(randomQuestion.question);
      $("#option1").text(randomQuestion.option1);
      $("#option2").text(randomQuestion.option2);
      $("#option3").text(randomQuestion.option3);
    });

    socket.on('gameStart', () => {
        $('#answersButtons').show();
        $('#status').text(`Pick the right answer!`)
    });

    socket.on('gameError', message => {
        alert(message);
        location.reload();
    });

    socket.on('gameEnd', message => {
        alert(message);
        location.reload();
    });


    $('.answersButton').on('click', makeSelection);
});

