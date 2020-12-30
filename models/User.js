const mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
	userID: String,
	fName: String,
	lName: String,
	email: String,
	userType: String,
	TrainerInfo: {
		classes: [{
			className: {type: mongoose.Schema.Types.ObjectId, ref: 'Class'}, 
			date: Date, 
			score: mongoose.Schema.Types.Mixed //test for 2D-array
		}]			
	},
	TraineeInfo: {
		trainingStatus: String,
		isDeactivated: Boolean,
		classes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Class'}]	
	}
}, {collection: "User"});

module.exports = mongoose.model('User', userSchema);