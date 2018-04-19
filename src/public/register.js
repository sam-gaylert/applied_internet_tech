const socket = io();

$(document).ready(function(){
    //$
    $('#username').keyup(function () {
        let name = $(this).val(); 
        socket.emit('bad-word', {name: name});
    });

    $('#registerForm').submit(function(e){
        const name = $('#username').val();
        const pass = $('#password').val();
        const email = $('#email').val();

        

        if(pass.length < 8){
            $('#messageReg').text('password too short');
            e.preventDefault();
        }
    });
});



socket.on('check', data => {
    if (!data.valid){
        $('#registerSubmit').prop("disabled",true);
    }
    else{
        $('#registerSubmit').prop("disabled",false);
    }
});