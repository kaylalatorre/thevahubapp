const mongoose = require('mongoose');

var courseSchema = new mongoose.Schema({
	courseID: String,
	courseName: String
}, {collection: "Course"});

module.exports = mongoose.model('Course', courseSchema);