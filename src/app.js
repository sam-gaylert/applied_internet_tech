// app.js
const express = require('express');
const app = express();
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
app.get('/register', (req, res) => {
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

app.get('/review/write', (req, res) => {
	res.render('write',{username: req.user.username});
});

app.post('/review/write', (req, res) => {
	if(req.user){
		const newReview = new Review({
			location: req.body.location,
			username: req.user.username,
			rating: req.body.rating,
			review: req.body.review
		});
		newReview.save(function(err){
			if(err){ 
				res.render('write', {message: 'REVIEW ADD ERROR'}); 
			}
			else{
				res.redirect('/');
			}
        });
	}
});

app.post('/login', function(req, res, next) {
	passport.authenticate('local', function(err, user, info) {
		if (err) { 
			console.log(err);
			res.render('login',{message:'Error: ' + err.name});
		}
		if (!user) {
			res.render('login',{message:'User does not exist'}); 
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



app.get('/', (req, res)=> {
	Review.find((err, revs) => {
		if(err){
			res.send(err);
		}
		if(req.user){
			res.render('index',{rev: revs, message: req.user.username});
		}
		else{
			res.render('index',{rev: revs});
		}
	});
});


app.listen(process.env.PORT || 3000);


