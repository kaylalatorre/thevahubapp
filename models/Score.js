const mongoose = require('mongoose');

var scoreSchema = new mongoose.Schema({
	traineeID: String,
	classID: String,
	TraineeInfo: [{
		Day1: [String],
		Day2: [String],
		Day3: [String],
		Day4: [String],
		Day5: [String],
		Day6: [String],
		Day7: [String],
	}],
	traineeStatus: String,
}, {collection: "Score"});

module.exports = mongoose.model('Score', scoreSchema);
