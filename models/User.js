const mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
	userID: String,
	fName: String,
	lName: String,
	email: String,
	password: String,
	userType: String,
	TrainerInfo: {
		classes: [{
			classID: {type: mongoose.Schema.Types.ObjectId, ref: 'Class'}, 
			startDate: Date,
			endDate: Date,
			startTime: Date,
			endTime: Date,
			score: mongoose.Schema.Types.Mixed //test for 2D-array
		}]			
	},
	TraineeInfo: {
		trainingStatus: String,
		classes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Class'}]	
	},
	isDeactivated: Boolean,
}, {collection: "User"});

module.exports = mongoose.model('User', userSchema);
