
const mongoose = require('mongoose');



const revSchema = new mongoose.Schema({
	location: String,
	user: [userSchema],
	rating: Number,
	review: String
});

const userSchema = new mongoose.Schema({
	username: { type: String, required: true, unique: true },
	email: String,
	hash: { type: String, required: true}
});

const locationSchema = new mongoose.Schema({
	address: String,
	name: String,
	reviews: [revSchema]
});

mongoose.model('Review', revSchema);
mongoose.model('User', userSchema);
mongoose.model('Location', locationSchema);


mongoose.connect('mongodb://localhost/final-project');