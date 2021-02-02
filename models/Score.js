const mongoose = require('mongoose');

var scoreSchema = new mongoose.Schema({
	traineeID: String,
	fName: String,
	lName: String,
	classID: String,
	courseName: String,
	Day1: [Number],
	Day2: [Number],
	Day3: [Number],
	Day4: [Number],
	Day5: [Number],
	Day6: [Number],
	Day7: [Number],
	Day8: [Number],
	FinalAve: String,
	traineeStatus: String,
}, {collection: "Score"});

module.exports = mongoose.model('Score', scoreSchema);
