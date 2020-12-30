const mongoose = require('mongoose');

var classSchema = new mongoose.Schema({
	classID: String,
	course: {type: mongoose.Schema.Types.ObjectId, ref: 'Course'},
	startDate: Date,
	endDate: Date,
	startTime: Date,
	endTime: Date,
	trainees: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
}, {collection: "Class"});

module.exports = mongoose.model('Class', classSchema);
