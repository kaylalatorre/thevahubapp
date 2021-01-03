/* For required node/packages
 */
const fs = require('fs');
const handlebars = require('handlebars');
const nodemailer = require('nodemailer');

const bcrypt = require('bcrypt');
const saltRounds = 10;
const algo = require('./algoSet');

/* For models (db) of each class
 */
const db = require('../models/db');
const UserDB = require('../models/User');
const ApplicantDB = require('../models/Applicant');
const ClassDB = require('../models/Class');
const CourseDB = require('../models/Course');
const ClientDB = require('../models/Client');

// main functions

const rendFunctions = {
/* [..] Login
 */
	getLogin: function(req, res, next) {
		var {email, password} = req.body;
	
		 if (req.session.user){
			res.redirect('/');
		 } else
			res.render('login', {});
	
		// include middleware for this?
	},

	getHome: function(req, res) {
	// if (req.session.user){
	// 	res.redirect('/');
	// } else {
		res.render('hr-home', {
		});
	// }
	},
	
/* [..] Application
 */
	getAppForm: function(req, res) {
	// if (req.session.user){
	// 	res.redirect('/');
	// } else {
		res.render('app-form', {
		});
	// }
	},

	getSubmitted: function(req, res, next) {
	// if (req.session.user){
	// 	res.redirect('/');
	// } else {
		res.render('form-submitted', {
		});
	// }
	},

/* [] Schedule Interview
 */
	getHRSched: function(req, res, next) {
	// if (req.session.user){
	// 	res.redirect('/');
	// } else {
		res.render('hr-schedule', {
		});
	// }
	},

/* [] Screen Applicants
 */
	getHRScreening: function(req, res, next) {
	// if (req.session.user){
	// 	res.redirect('/');
	// } else {
		res.render('hr-screening', {
		});
	// }
	},

/* [..] Application
 */	
	postApplication: async function(req, res) {
		try {	
			// hashing
		
			// send to Applicant email
			
			// create Applicant record
			let {fName, lName, cNo, email, address, bday, applyFor /*skills, certs, sys_reqs*/} = req.body;
			// **bday included in app form but it's not in the db design? --added for now
			
			// redirect to form submitted page (--> then what?)
		} catch(e) {
			res.status(500).send(e);
		}
		
		
	}
}

module.exports = rendFunctions;