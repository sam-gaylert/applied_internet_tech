
const mongoose = require('mongoose');



const revSchema = new mongoose.Schema({
	courseNumber: String,
	courseName: String,
	semester: String,
	year: Number,
	professor: String,
	review: String,
	sessionID: String
});

mongoose.model('Review', revSchema);


mongoose.connect('mongodb://localhost/hw05');