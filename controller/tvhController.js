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
	
	getFormSubmitted: function(req, res) {
		res.render('form-submitted', {});
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
		
// for console register w password hashing
	postRegister: async function(req, res) {
		try {
			let hashPass = await bcrypt.hash(req.body.password, saltRounds);
			console.log(hashPass);
			let insertUser = await db.insertOne(UserDB,
				{userID: req.body.userID, firstName: req.body.firstName, lastName: req.body.lastName, 
					email: req.body.email, password: hashPass, isVerified: true, userType: req.body.userType});
				
			console.log("db: Created user/n" + insertUser);
		} catch(e) {
			res.status(500).send(e);
		}
	},

	postApplication: async function(req, res) {
		try {
			
			
			
			let {fName, lName, cNo, email, address, bday, applyFor, /*skillTitle, skillLevel, certName, certFrom, certYear,*/ 
				check1, check2, check3, check4} = req.body;
			// [] how to get data from form-check-input input type? (sys_reqs)
			// --get check1-4 var 
			// --if there is data in var, put as 0 in boolean array?
			
			// [] how to get for file types? (resume/cv) --> accept only *pdf file types
			
			
			// [/] inform Applicant that their submission has been acknowledged
			// --done in scripts.js submitAppForm()	
			
			// create Applicant record in db
			
		} catch(e) {
			res.status(500).send(e);
		}
	},
			
	getTest: function(req, res){
		res.render('int-applicants', {});
	}
};

module.exports = rendFunctions;