const socket = io();

$(document).ready(function(){
    $('#revArea').keyup(function () {
        let name = $(this).val(); 
        socket.emit('bad-word', {name: name});
    });
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