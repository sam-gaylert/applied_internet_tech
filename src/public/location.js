//AIzaSyDm1Dn8Dbt7CXiTUx9OHywa31lujkWT-Ik geocoding
//AIzaSyCSpXd5s1YcQWtPL3sFn6b8xyl-2ii_qbo javascript


let urlStart = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
let urlTail = '&key=AIzaSyDm1Dn8Dbt7CXiTUx9OHywa31lujkWT-Ik';
let testAddress = '';
let lat = 0;
let lng = 0;
let revs =[];

$(document).ready(function(){
    const name = $('#mapLoc').text();
    findLoc(name, updateMap);
    
});

function addressString(str){
    const hold = str.split(' ').join('+');
    const hold2 = hold.split(',').join(',+');
    return hold2;
}

function updateMap(){
    const req = new XMLHttpRequest();
    req.open('GET', urlStart+testAddress+urlTail, true);
    req.onload = function() { 
        if (req.status >= 200 && req.status < 400) {
            data = JSON.parse(req.responseText);
            if(data.status === 'OK'){
                lat = data.results[0].geometry.location.lat;
                lng = data.results[0].geometry.location.lng;
                initMap();
            }
            else{
                let message = document.createElement('h1');
                message.innerText = 'Map Error: ' + data.status;
                $('#map').attr('hidden', 'true');
                $('#ifErr').append(message);
                tableFill(revs);
            }
        }
    };
    req.onerror = function() { 
        let message = document.createElement('h1');
        message.innerText = 'Load Error';
        $('#map').attr('hidden', 'true');
        $('#ifErr').append(message);
    };
    req.send();
}



function tableFill(data){
    const table = document.querySelector('tbody');
    for(let i = 0; i < data.length; i++){
        let newEntry = document.createElement('tr');
        newEntry.setAttribute('id',data[i]._id);
        let newUser = document.createElement('td');
        newUser.setAttribute('id','userElem');
        newUser.setAttribute('style',"width: 20%");
        let newRating = document.createElement('td');
        newRating.setAttribute('id','ratingElem');
        newRating.setAttribute('style',"width: 10%");
        let newReview = document.createElement('td');
        newReview.setAttribute('id','reviewElem');
        newReview.setAttribute('style',"width: 70%");
        newUser.innerText = (data[i].author);
        newRating.innerText = (data[i].rate);
        newReview.innerText = (data[i].details);
        newEntry.appendChild(newUser);
        newEntry.appendChild(newRating);
        newEntry.appendChild(newReview);
        table.appendChild(newEntry);
    }
}

function findLoc(name, func){ //custom hof
    const qString = '?name=' + name;
    const url = '/location' + qString;
    const req = new XMLHttpRequest();
    req.open('GET', url, true);
    req.onload = function() { 
        if (req.status >= 200 && req.status < 400) {
            data = JSON.parse(req.responseText);
            testAddress = (addressString(data.address));
            revs = data.reviews;
            func();
        }
    };
    req.onerror = function() { 
        let message = document.createElement('h1');
        message.innerText = 'Load Error';
        $('#map').attr('hidden', 'true');
        $('#ifErr').append(message);
    };
    req.send();

}


function initMap() {
    var uluru = {lat: lat, lng: lng};
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: uluru
    });
    var marker = new google.maps.Marker({
        position: uluru,
        map: map
    });
    tableFill(revs);
}