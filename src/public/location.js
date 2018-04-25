//AIzaSyDm1Dn8Dbt7CXiTUx9OHywa31lujkWT-Ik geocoding
//AIzaSyCSpXd5s1YcQWtPL3sFn6b8xyl-2ii_qbo javascript


let urlStart = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
let urlTail = '&key=AIzaSyDm1Dn8Dbt7CXiTUx9OHywa31lujkWT-Ik';
let testAddress = '';
let lat = 0;
let lng = 0;
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
                console.log('OKAYYY');
                initMap();
            }
            console.log(data.status);
            console.log(data.results[0].geometry.location.lat);
            console.log(data.results[0].geometry.location.lng);
        }
    };
    req.onerror = function() { 
        console.log('load error');
    };
    req.send();
}

function findLoc(name, func){ //CUSTOM CALLBACK 
    //name: name
    const qString = '?name=' + name;
    const url = '/location' + qString;
    const req = new XMLHttpRequest();
    req.open('GET', url, true);
    req.onload = function() { 
        if (req.status >= 200 && req.status < 400) {
            data = JSON.parse(req.responseText);

            console.log(data.address);
            testAddress = (addressString(data.address));
            func();
        }
    };
    req.onerror = function() { 
        console.log('load error');
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
}