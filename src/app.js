// app.js
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const Filter = require('bad-words');
const filter = new Filter();
//boiler plate requires and variables
const path = require('path');
const publicPath = path.join(__dirname, '/public/');
const mongoose = require('mongoose');
require('./db.js');
const Review = mongoose.model('Review');
const Location = mongoose.model('Location');
const User = mongoose.model('User');


const passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
const session = require("express-session")
	,bodyParser = require("body-parser");


passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.findById(id, function(err, user) {
		done(err, user);
	});
});
	  

app.use(express.static(publicPath));
app.use(session({ secret: "itsfreerealestate", resave: false, saveUninitialized: false }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
	if(req.user){
		res.locals.path = "/review/write";
		res.locals.username = req.user.username;
	}
	else{
		res.locals.path = "/login";
	}
    next();
});

app.set('view engine', 'hbs');

/*
	pathing
*/
io.on('connection', (socket) => {
    socket.on('bad-word', (data) => {
		if(filter.isProfane(data.name)){
			io.emit('check', {valid: false});
		}
		else{
			io.emit('check', {valid: true});
		}
    });
});

filter.removeWords('hells');
filter.removeWords('hell');
filter.removeWords('hello');

app.get('/review/location/:id',(req,res) => {
	res.locals.source = '../../location.js'; 

	Review.findOne({'_id':req.params.id}, (err, revs) => {
		if(err){
			res.send(err);
		}
		else{
			
			res.render('location',{rev: revs});
		}
		
	});
});

app.get('/location', (req, res) => {
	const queryObj = {};
	const keys = Object.keys(req.query).filter( key => req.query[key] !== '');
	keys.forEach( key => queryObj[key] = req.query[key]);
	Location.findOne(queryObj, (err, locs) => {
		if(err){
			res.send(err);
		}
		else{
			res.send(locs);
		}
		
	});
});

app.get('/register', (req, res) => {
	res.locals.source = 'register.js';
	res.render('register');
});


app.post('/register', (req, res) => {
	const username = req.body.username;     
	const email = req.body.email;
	User.register(new User({username: username, email:email}), req.body.password, function(err) {
		if (err) {
			if(err.name === "UserExistsError"){
				res.render('register',{message:"username already exists"});
			}
		}
		else{
			passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login'})(req,res);
		}
	  });

});

app.get('/login', (req,res) => {
	res.render('login');
});

app.post('/login', function(req, res, next) {
	passport.authenticate('local', function(err, user, info) {
		if (err) { 
			res.render('login',{message:'Error: ' + err.name});
		}
		if (!user) {
			res.render('login',{message:'Invalid username or password'}); 
		}
		else if(user){
			req.logIn(user, function(err) {
				if (err) { 
					res.render('login',{message:'Error: ' + err.name});
				 }
				 else{
					res.redirect('/');
				 }
			});
		}
		
	})(req, res, next);
});



app.get('/review/write', (req, res) => {
	res.locals.source = '../write.js'; 
	res.render('write',{username: req.user.username});
});

function addReview(review, locationName, address){
	Location.findOne({name: locationName}, (err, loc) => {
		if(err){
			res.send(err);
			return false;
		}
		else{
			if(loc){
				const newObj = {id:review._id, author:review.username, rate:review.rating, details: review.review};
				loc.reviews.push(newObj);
				loc.markModified('reviews');
				loc.save(function(err){
					if(err)console.log(err);

					return
				});
			}
			else{
				const newLocation = new Location({
					address: address,
					name: locationName,
					reviews: [{id:review._id, author:review.username, rate:review.rating, details: review.review}]
				});
				newLocation.save(function(err){
					if(err){  
						return err;
					}
					else{
						return;
					}
				});
			}
		}
	});
}

app.post('/review/write', (req, res) => {
	if(req.user){
		const newReview = new Review({
			location: req.body.location,
			username: req.user.username,
			rating: req.body.rating,
			review: req.body.review
		});

		let address = '';
		address += req.body.address1 + ',';
		address += req.body.address2 + ',';
		address += req.body.state;

		newReview.save(function(err){
			if(err){ 
				res.render('write', {message: 'REVIEW ADD ERROR'}); 
			}
			else{
				addReview(newReview, req.body.location, address);
				res.redirect('/');
				
			}
		});
		
	}
});



app.get('/revs', (req, res) => {
	const queryObj = {};
	const keys = Object.keys(req.query).filter( key => req.query[key] !== '');
	keys.forEach( key => queryObj[key] = req.query[key]);

	Review.find(queryObj, (err, revs) => {
		const reversed = revs.reverse();
		if(err){
			res.send(err);
		}
		else{
			
			if(req.user){
				res.send(reversed);
			}
			else{
				res.send(reversed);
			}
		}
		
	});
});

app.get('/', (req, res)=> {
	res.locals.source = 'index_js.js';

	const queryObj = {};
	const keys = Object.keys(req.query).filter( key => req.query[key] !== '');
	keys.forEach( key => queryObj[key] = req.query[key]);

	Review.find(queryObj, (err, revs) => {
		const reversed = revs.reverse();
		if(err){
			res.send(err);
		}
		else{
			
			if(req.user){
				res.render('index',{rev: reversed, message: req.user.username});
			}
			else{
				res.render('index',{rev: reversed});
			}
		}
		
	});
});


server.listen(process.env.PORT || 3000);


