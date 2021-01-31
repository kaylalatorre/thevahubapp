const mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
	userID: String,
	fName: String,
	lName: String,
	email: String,
	password: String,
	userType: String,
	TrainerInfo: [{
		type: mongoose.Schema.Types.ObjectId, ref: 'Class'
	}],
	TraineeInfo: [{
		scores: [String]
	}],
	traineeStatus: String,
	isDeactivated: Boolean,
}, {collection: "User"});

module.exports = mongoose.model('User', userSchema);
