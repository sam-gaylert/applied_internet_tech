
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
	email: String
});
userSchema.plugin(passportLocalMongoose);

const revSchema = new mongoose.Schema({
	location: String,
	username: String,
	rating: Number,
	review: String
});

const locationSchema = new mongoose.Schema({
	address: String,
	name: String,
	reviews: [{id:String, author:String, rate:Number, details: String}]
});

mongoose.model('Review', revSchema);
mongoose.model('User', userSchema);
mongoose.model('Location', locationSchema);




let dbconf;
if (process.env.NODE_ENV === 'PRODUCTION') {
 const fs = require('fs');
 const path = require('path');
 const fn = path.join(__dirname, 'config.json');
 const data = fs.readFileSync(fn);
 const conf = JSON.parse(data);
 dbconf = conf.dbconf;
} else {
 dbconf = 'mongodb://localhost/final-project';
}

mongoose.connect(dbconf);