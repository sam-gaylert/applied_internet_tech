$(document).ready(function(){

    //backgroundRequest('GET', '/revs', true);

    $("#input").click(function(e){
        e.preventDefault();
        const location = $('#location').val();
        const user = $('#user').val();
        const rating = $('#rating').val();
        const qString = "?location=" + location +"&username=" + user + "&rating=" + rating;
        clearTable();
        backgroundRequest('GET', '/revs'+qString, true);
    });

});

function clearTable(){
    const table = document.querySelector('tbody');
    while (table.firstChild) {
        table.removeChild(table.firstChild);
    }
}

function tableFill(data){
    const table = document.querySelector('tbody');
    for(let i = 0; i < data.length; i++){
        let link = document.createElement('a');
        link.setAttribute('href','/review/location/' + data[i]._id);
        let newEntry = document.createElement('tr');
        newEntry.setAttribute('id',data[i]._id);
        let newLocation = document.createElement('td');
        newLocation.setAttribute('id','locationElem');
        let newUsername = document.createElement('td');
        newUsername.setAttribute('id','usernameElem');
        let newRating = document.createElement('td');
        newRating.setAttribute('id','ratingElem');
        let newReview = document.createElement('td');
        newReview.setAttribute('id','reviewElem');
        link.innerText = (data[i].location);
        newLocation.appendChild(link);
        newUsername.innerText = (data[i].username);
        newRating.innerText = (data[i].rating);
        newReview.innerText = (data[i].review);
        newEntry.appendChild(newLocation);
        newEntry.appendChild(newUsername);
        newEntry.appendChild(newRating);
        newEntry.appendChild(newReview);
        table.appendChild(newEntry);
    }
}


function backgroundRequest(method, url, async){
    const req = new XMLHttpRequest();
    req.open(method, url, async);
    req.onload = function() { 
        if (req.status >= 200 && req.status < 400) {
            data = JSON.parse(req.responseText);
            tableFill(data);
        }
    };
    req.onerror = function() { 
        $('#messageWrite').text('content NOT loaded!');
    };
    req.send();
}