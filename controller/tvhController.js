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
		if(req.session.user) {
			if (req.session.user.userType === "HR admin")
				res.render('hr-home', {});
			else if (req.session.user.userType === "HR interviewer")
				res.render('int-home', {});		
			else if (req.session.user.userType === "Trainee")
				res.render('trainee-home', {});
			else if (req.session.user.userType === "Trainer")
				res.render('trainer-home', {});
			else 
				res.render('login');
		} else 
			res.render('login');
		 
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

	getTraineeProf: function(req, res, next) {
	// if (req.session.user){
	// 	res.redirect('/');
	// } else {
		res.render('trainee-profile', {
		});
	// }
	},

	getTraineeClasses: function(req, res, next) {
	// if (req.session.user){
	// 	res.redirect('/');
	// } else {
		res.render('trainee-classes', {
		});
	// }
	},

	getCertificate: function(req, res, next) {
	// if (req.session.user){
	// 	res.redirect('/');
	// } else {
		res.render('certificate', {
		});
	// }
	},

	getTEClassDet: function(req, res, next) {
		res.render('te-class-details', {
		});
	},

	getTrainerClasses: function(req, res, next) {
		res.render('trainer-classes', {
		});
	},


	getTRClassDet: function(req, res, next) {
		res.render('tr-class-details', {
		});
	},

	getScoresheet: function(req, res, next) {
		res.render('update-scoresheet', {
		});
	},

	getTraineeList: function(req, res, next) {
		res.render('manage-trainees', {
		});
	},

	getSummaryReport: function(req, res, next) {
		res.render('trainer-reports', {
		});
	},

	getTRSchedule: function(req, res, next) {
	// if (req.session.user){
	// 	res.redirect('/');
	// } else {
		res.render('tr-schedule', {
		});
	// }
	},

	getIntApplicants: function(req, res, next) {
		res.render('int-applicants', {
		});
	},

	getIntSchedule: function(req, res, next) {
		res.render('int-schedule', {
		});
	},

	getDeactivate: function(req, res, next) {
		if (req.session.user) {
			if(req.session.user.userType === "Trainee")
				res.render('deactivate', {
					userID: req.params.userID,
				});
			
			else res.redirect('login');
		}
		else res.redirect('login');
	},

	getError: function(req, res, next) {
		res.render('error', {
		});
	},

/* POST FUNCTIONS */
	postLogin: async function(req, res) {
		let {email, password} = req.body;

		var user = await db.findOne(UserDB, {email:email}, '');

		if (!user) // USER NOT IN DB
			res.send({status: 401});
		else { // SUCCESS
			bcrypt.compare(password, user.password, function(err, match) {
					if (match){
						req.session.user = user;
						res.send({status: 200});
					} else
						res.send({status: 401});
			});
		}
	},		
		
// for console register w password hashing
	postRegister: async function(req, res) {
		try {
			// console.log("Hello " + req.body.fName, req.body.lName);
			let hashPass = await bcrypt.hash(req.body.password, saltRounds);
			console.log(hashPass);
			let insertUser = await db.insertOne(UserDB,
				{ userID: req.body.userID, fName: req.body.fName, lName: req.body.lName, 
					email: req.body.email, password: hashPass, userType: req.body.userType, isDeactivated: false });
				
			console.log("db: Created user/n" + insertUser);
		} catch(e) {
			res.status(500).send(e);
		}
	},
	
	postApplication: async function(req, res) {
		try {
			
			let {fname, lname, cNo, email, address, bday, applyFor, skills, certifications} = req.body;
			
			// [/] from form-check-input input type? (sys_reqs)
			let sysReqs = checkSysReqs(req.body);
			let applicID = generateID("AP");
			
			// [] how to get for file types? (resume/cv) --> accept only *pdf file types
			
			
			// [/] inform Applicant that their submission has been acknowledged
			// --done in scripts.js submitAppForm()	
			
			// create Applicant record in db
			let insertApplic = await db.insertOne(ApplicantDB, {
					applicantID: applicID,
					fName: fname,
					lName: lname,
					email: email,
					address: address,
					birthdate: bday,
					applyFor: applyFor,
					skills: JSON.parse(skills),
					sys_reqs: sysReqs,
					certifications: JSON.parse(certifications)
					//resume_cv: String
			});
			
		} catch(e) {
			res.status(500).send(e);
		}
	},
			
	getTest: function(req, res){
//		res.render('int-applicants', {});
		res.render('hr-schedule', {});
	},


	postLogout: function(req, res) {
		req.session.destroy();
		res.redirect('/login');
	},
	
	postDeactivate: function(req, res) {
		if(req.session.user) {
			let { password } = req.body;

			var userIDtemp = req.session.user.userID;

			usersModel.findOneAndUpdate(
				{userID: userIDtemp},
				{ $set: { isDeactivated: true }},
				{ useFindAndModify: false},
				function(err, match) {
					if (err) {
						res.send({status: 500, mssg:'There has been an error in deactivating your account.'});
					}
					else {
					res.send({status: 200, mssg:'Account deactivated succesfully.'});
					req.session.destroy();
					}
			});	
		}
		else res.redirect('/');
	},
};

// HELPER FUNCTIONS
function checkSysReqs(form) {
	return [
		"check1" in form,
		"check2" in form,
		"check3" in form,
		"check4" in form
	];
}

function generateID(IDprefix) {
   var ID = IDprefix;
   var idLength = 5;

   for (var i = 0; i < idLength; i++) { ID += (Math.round(Math.random() * 10)).toString(); }

   return ID;
}

module.exports = rendFunctions;
