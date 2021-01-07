/* REQUIRED NODES/PACKAGES */
const nodemailer = require('nodemailer');

const bcrypt = require('bcrypt');
const saltRounds = 10;

/* DB MODELS */
const db = require('../models/db');
const UserDB = require('../models/User');
const ApplicantDB = require('../models/Applicant');
const ClassDB = require('../models/Class');
const CourseDB = require('../models/Course');
const ClientDB = require('../models/Client');

const rendFunctions = {
/* GET FUNCTIONS */	
/* [..] Login
 */
	getLogin: function(req, res, next) {
		var {email, password} = req.body;
	
		 if (req.session.user){
			res.redirect('/');
		 } else
			res.render('login', {});
	
	},

	getHome: function(req, res) {
		if (req.session.user.userType === "HR admin")
			res.render('hr-home', {});
		else if (req.session.user.userType === "HR interviewer")
			res.render('int-home', {});		
		else if (req.session.user.userType === "Trainee")
			res.render('trainee-home', {});
		else if (req.session.user.userType === "Trainer")
			res.render('trainer-home', {});
		else 
			res.render('login', {});
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

/* POST FUNCTIONS */
	postLogin: async function(req, res) {
			let {email, password} = req.body;

			var user = await db.findOne(UserDB, {email:email}, '');

			try {
				if (!user) 
					res.status(401).send();
				else { 
					bcrypt.compare(password, user.password, function(err, match) {
						if (match){
							req.session.user = user;
							res.status(200).send();					
						} else
							res.status(401).send();
					});
				}		
			} catch(e) { // Server error
				res.status(500).send(e);
			}
		},

//	postApplication: async function(req, res) {
//		try {
//			// send to Applicant email
//			
//			// create Applicant record
//			let {fName, lName, cNo, email, address, bday, applyFor /*skills, certs, sys_reqs*/} = req.body;
//			
//			// redirect to form submitted page (--> then what?)
//		} catch(e) {
//			res.status(500).send(e);
//	},
			
	getTest: function(req, res){
		res.render('int-applicants', {});
	}
};

module.exports = rendFunctions;