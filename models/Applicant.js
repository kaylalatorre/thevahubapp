const mongoose = require('mongoose');

var applicantSchema = new mongoose.Schema({
	applicantID: String,
	fName: String,
	lName: String,
	email: String,
	address: String,
	birthdate: String,
	applyFor: String,
	skills: [{
		title: String,
		level: String
	}],
	sys_reqs: [ Boolean ],
	certifications: [{
			title: String,
			certFrom: String,
			year: Number
	}],
	resume_cv: String,
	initialStatus: String,
	initialRemarks: String,
	finalStatus: String,
	finalRemarks: String
}, {collection: "Applicant"});

module.exports = mongoose.model('Applicant', applicantSchema);