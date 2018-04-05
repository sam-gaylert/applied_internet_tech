// app.js

//boiler plate requires and variables
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;
const publicPath = path.join(__dirname, '/public/');
const session = require('express-session');

//mongoose integration
require('./db.js');
const mongoose = require('mongoose');
const Review = mongoose.model('Review');
const Location = mongoose.mpdel('Location');
const User = mongoose.mpdel('User');
const sessionOptions = { 
	secret: 'secret for signing session id', 
	saveUninitialized: false, 
	resave: false 
};

app.set('view engine', 'hbs');
app.use(express.static(publicPath));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session(sessionOptions));




/*
	pathing
*/
app.get('/', (req, res)=> {
	
	Review.find((err, revs) => {
		if(err){
			res.send(err);
		}
		res.render('index',{rev: revs});
	});
});


app.listen(PORT);


