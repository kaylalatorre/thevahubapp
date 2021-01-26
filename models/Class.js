const mongoose = require('mongoose');

var classSchema = new mongoose.Schema({
	classID: String,
	trainerID: String,
	// course: {type: mongoose.Schema.Types.ObjectId, ref: 'Course'},
	courseName: String,
	startDate: Date,
	endDate: Date,
	startTime: Date,
	endTime: Date,
	meetLink: String,
	coursePhoto: String,
	trainees: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
}, {collection: "Class"});

module.exports = mongoose.model('Class', classSchema);
