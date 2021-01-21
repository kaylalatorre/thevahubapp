const mongoose = require('mongoose');

var interviewSchema = new mongoose.Schema({
	intervID: String,
	phase: String,
	date: Date,
	time: Date,
	interviewer: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	applicant: {type: mongoose.Schema.Types.ObjectId, ref: 'Applicant'},
	meetingLink: String
}, {collection: "Interview"});

module.exports = mongoose.model('Interview', interviewSchema);


