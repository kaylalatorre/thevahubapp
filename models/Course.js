const mongoose = require('mongoose');

var courseSchema = new mongoose.Schema({
	courseName: String
}, {collection: "Course"});

module.exports = mongoose.model('Course', courseSchema);