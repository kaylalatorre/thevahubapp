const mongoose = require('mongoose');

var classSchema = new mongoose.Schema({
	classID: String,
	trainerID: String,
	courseName: String,
	startDate: Date,
	endDate: Date,
	startTime: Date,
	endTime: Date,
	meetLink: String,
	classPhoto: String,
	trainees: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
}, {collection: "Class"});

module.exports = mongoose.model('Class', classSchema);
