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
const sessionOptions = { 
	secret: 'secret for signing session id', 
	saveUninitialized: false, 
	resave: false 
};

app.set('view engine', 'hbs');
app.use(express.static(publicPath));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session(sessionOptions));


app.use(function(req, res, next){
	if (!req.session.count){
		// = 0;
		req.session.count = 0;
	} 
	next();
});

/*
	pathing
*/
app.get('/', (req, res)=> {
	req.session.count += 1;
	res.locals.count = req.session.count;
	const queryObj = {};
	Object.keys(req.query).forEach(key => {
		if(req.query[key] !== ''){ 
			queryObj[key] = req.query[key]; 
		}
	});
	Review.find(queryObj, (err, revs) => {
		if(err){
			res.send(err);
		}
		res.render('index',{rev: revs});
	});
});

app.get('/reviews/add', (req, res) =>{
	req.session.count += 1;
	res.locals.count = req.session.count;
	res.render('review');
});

app.get('/reviews/mine', (req,res) => {
	req.session.count += 1;
	res.locals.count = req.session.count;
	Review.find({sessionID: req.session.id}, (err,revs) => {
		res.render('index', {rev: revs});
	});
});

app.post('/reviews/add', (req, res) => {
	new Review({
	courseNumber: req.body.courseNumber,
	courseName: req.body.courseName,
	semester: req.body.semester,
	year: req.body.year,
	professor: req.body.professor,
	review: req.body.review,
	sessionID: req.session.id,
	updated_at: Date.now()
	}).save(function(err){
		if(err){ res.send(err); }
		res.redirect('/');
	});
});

app.listen(PORT);

/*
req.query.semester
req.query.year
req.query.professor
*/
