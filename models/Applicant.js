const mongoose = require('mongoose');

var applicantSchema = new mongoose.Schema({
	applicantID: String,
	fName: String,
	lName: String,
	email: String,
	address: String,
	sys_reqs: [ boolean ],
	certifications: [{
			title: String,
			certFrom: String,
			year: Number
	}],
	initialStatus: String,
	initialRemarks: String,
	finalStatus: String,
	finalRemarks: String
}, {collection: "Applicant"});

module.exports = mongoose.model('Applicant', applicantSchema);