const socket = io();

$(document).ready(function(){
    $('#revArea').keyup(function () {
        let name = $(this).val(); 
        socket.emit('bad-word', {name: name});
    });
});

$('#reviewForm').submit(function(e){


    const add1 = $('#add1').val();
    if(!add1.match(/^\d+\s[A-z]+\s[A-z]+/g)){
        $('#messageWrite').text('invalid address');
        e.preventDefault();
    }

});

socket.on('check', data => {
    if (!data.valid){
        $('#messageWrite').text('no profanity');
        $('#submitBtn').first().prop("disabled",true);
    }
    else{
        $('#messageWrite').text('');
        $('#submitBtn').first().prop("disabled",false);
    }
});