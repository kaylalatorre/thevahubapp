const mongoose = require('mongoose');

var scoreSchema = new mongoose.Schema({
	traineeID: String,
	classID: String,
	TraineeInfo: [{
		scores: [String]
	}],
	traineeStatus: String,
}, {collection: "Score"});

module.exports = mongoose.model('Score', scoreSchema);
