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
const InterviewDB = require('../models/Interview');

/* FUNCTIONS and CONSTRUCTORS */
//function to generate random classID
function generateClassID() {
	var classID = "C";
	var idLength = 6;

	for (var i = 0; i < idLength; i++) {
		classID += (Math.round(Math.random() * 10)).toString();	}

	return classID;
}

// constructor for class
function createClass(classID, trainerID, courseName, startDate, endDate, startTime, endTime, meetLink) {
	var tempClass = {
		classID: classID,
		trainerID: trainerID,
		courseName: courseName,
		startDate: startDate,
		endDate: endDate,
		startTime: startTime,
		endTime: endTime,
		meetLink: meetLink,
		//coursePhoto: coursePhoto,
		trainees: []
	};

	return tempClass;
}

function toDate(date, time) {
    let d = new Date(date);
    d.setHours(time.substr(0, time.indexOf(":")));
    d.setMinutes(time.substr(time.indexOf(":") + 1));
    d.setSeconds(0);
    return d.toString();
}

const rendFunctions = {
/* GET FUNCTIONS */	

/* [/] Login
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
			if (req.session.user.userType === "HRadmin")
				res.render('hr-home', {});
			else if (req.session.user.userType === "HRinterv")
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
	
/* [/] Application
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

/* [..] HR Schedule
 */
	getHRSched: function(req, res) {
		if(req.session.user.userType === "HRadmin"){
			res.render('hr-schedule', {
			});
		}
	},
	
	getInterviews: async function(req, res) {
		try {
			let interviews = await InterviewDB.find({}, '').populate("interviewer applicant");
			res.send(interviews);
			
		} catch(e) {
			console.log(e);
			res.send(e);			
		}
	},
	
	getIntervApplic: async function(req, res) {
		try {
			let interviewers = await db.findMany(UserDB, {userType: "HRinterv"}, '');
			let applicants = await db.findMany(ApplicantDB, {screenStatus: "ACCEPTED"}, '');
			res.send({intervs: interviewers, applics: applicants});
			
		} catch(e) {
			console.log(e);
			res.send(e);
		}
	},
	
	getFilterIntervs: async function(req, res) {
		console.log("in FilterIntervs(): " + req.query.filterID);
		let interviews = await InterviewDB.find({intervID: req.query.filterID}, '').populate("interviewer applicant");
		res.send(interviews);
	},

/* [..] HR Screening
 */
	
	getHRScreening: async function(req, res) {
		if(req.session.user) {
			if(req.session.user.userType === "HRadmin"){
				let applicants = await db.findMany(ApplicantDB, {});
				
				let acceptApps = [];
				let pendApps = [];
				let rejectApps = [];
					
				for(let i=0; i< applicants.length; i++){
					if(applicants[i].screenStatus === "ACCEPTED")
						acceptApps.push(applicants[i]);
					else if(applicants[i].screenStatus === "PENDING")
						pendApps.push(applicants[i]);
					else if(applicants[i].screenStatus === "REJECTED")
						rejectApps.push(applicants[i]);				
				}
				
				res.render('hr-screening', {
					accepted: acceptApps,
					pending: pendApps,
					rejected: rejectApps
				});
			}
		}
		else {
			res.redirect('/');
		}
	},
	
	getApplicInfo: async function(req, res) {
		try {
			if(req.session.user.userType === "HRadmin"){
				// console.log(req.query);
                let applic = await db.findOne(ApplicantDB, {applicantID: req.query.applicantID}, '');
                let encode = Buffer.from(applic.resume_cv.buffer).toString('base64');
                // console.log(encode);
                res.send({applic: applic, encoded: encode});
			}			
		} catch(e){
			console.log(e);
			res.send(e);
		}
	},
	
/* [] HR Interviewer
 */	
	getApplicList: async function(req, res) {
		try {
			if(req.session.user.userType === "HRinterv"){
				let intervs = await InterviewDB.find({}, '').populate("interviewer applicant");
				let applics = [];
				let phase;
				
				for(i=0; i<intervs.length;i++){
					if(intervs[i].interviewer.userID === req.session.user.userID){
						phase = intervs[i].phase;
						applics.push(intervs[i].applicant);
					}
						
				}
				
				res.render('int-applicants', {
					applicants: applics,
					intervPhase: phase
				});
			}			
		} catch(e){
			console.log(e);
			res.send(e);
		}		
	},
	
	getHRInterviews: async function(req, res) {
		try {
			let interviews = await InterviewDB.find({}, '').populate("interviewer applicant");
			let filterIntervs = interviews.filter(elem => elem.interviewer.userID === req.session.user.userID);
			res.send(filterIntervs);
			
////
//                let encode = Buffer.from(applic.resume_cv.buffer).toString('base64');
//                // console.log(encode);
//                res.send({applic: applic, encoded: encode});
////
			
		} catch(e) {
			console.log(e);
			res.send(e);			
		}		
	},

	getTraineeProf: function(req, res, next) {
		if (req.session.user){

			// will determine trainee status (on-going, graduated)

			// will collect classes of trainee

			res.render('trainee-profile', {
				fName: req.session.user.fName,
				lName: req.session.user.lName,
				userID: req.session.user.userID,
				
			});
			
		} else {
			res.redirect('/');
		}
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
		if (req.session.user.userType === "Trainer") {
			//collect classes under current trainer
			ClassDB.find({trainerID: req.session.user.userID}, function(err, data) {
				var classes = JSON.parse(JSON.stringify(data));
				var classDet = classes;	
				console.log(classes);
				
				CourseDB.find({}, function(err, data) {
					var courses = JSON.parse(JSON.stringify(data));
					var courseDet = courses;	
					// console.log(courses);
					
					res.render('trainer-classes', {
						classList: classDet,
						courseList: courseDet,
					});
				});	
			});
		}
		else {
			res.redirect('/');
		}
	},


	getTRClassDetails: function(req, res, next) {
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

	getDetailedReport: function(req, res, next) {
		res.render('detailed-report', {
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

	getIntSchedule: function(req, res, next) {
		res.render('int-schedule', {
		});
	},

	getDeactivate: function(req, res, next) {
		if(req.session.user.userType === "Trainee")
			res.render('deactivate', {
				userID: req.session.user.userID,
				fName: req.session.user.fName,
			});
		
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
			if(!user.isDeactivated){ // user can not log in once deactivated
				bcrypt.compare(password, user.password, function(err, match) {
						if (match){
							req.session.user = user;
							res.send({status: 200});
						} else
							res.send({status: 401});
				});
			}
			else res.send({status: 410});
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
			
			let {fname, lname, cNo, email, address, bday, applyFor, resumeFile} = req.body;
			console.log(req.body); 
			
			let formArray = [];
			let skills = [];
			let certs = [];
			let applicID = generateID("AP");
			let resFile = new Buffer.from(JSON.parse(resumeFile).data, "base64"); //converts String to base64 for Buffer type in Applicant (resume_cv)
			
			// for skills and certs
			for(let i=0; i < Object.keys(req.body).length; i++)
				formArray.push({name: Object.keys(req.body)[i], value: Object.values(req.body)[i]});
			
			for(let i=0; i < formArray.length; i++){
				if (formArray[i].name.substr(0, 10) === "skillTitle")
					skills.push({title: formArray[i].value, level: formArray[i+1].value});
				
				if (formArray[i].name.substr(0, 8) === "certName")
					certs.push({title: formArray[i].value, certFrom: formArray[i+1].value, year: Number.parseInt(formArray[i+2].value)});				
			}
			console.log(skills);
			console.log(certs);
			
			// [/] for form-check-input input type (sys_reqs)
			let sysReqs = checkSysReqs(req.body);
			
			// [/] get file types (resume/cv) --> accept only *pdf file types
			// -- done w filepond
			
			// [/] inform Applicant that their submission has been acknowledged
			// -- done in scripts.js submitAppForm()	
			
			// create Applicant record in db
			let insertApplic = await db.insertOne(ApplicantDB, {
					applicantID: applicID,
					fName: fname,
					lName: lname,
					phoneNo: cNo,
					email: email,
					address: address,
					birthdate: bday,
					applyFor: applyFor,
					skills: skills,
					sys_reqs: sysReqs,
					certifications: certs,
					resume_cv: resFile,
					screenStatus: "PENDING"
			});
			
			if (insertApplic)
				res.redirect("/form-submitted");
			
		} catch(e) {
			res.status(500).send(e);
		}
		
	},
			
	postLogout: function(req, res) {
		req.session.destroy();
		res.redirect('/login');
	},
	
	postDeactivate: function(req, res) {
		if(req.session.user) {
			let { password } = req.body;

			console.log(req.session.user.password, password);

			bcrypt.compare(password, req.session.user.password, function(err, match) {
				if (match){ 
					UserDB.findOneAndUpdate(
						{userID: req.session.user.userID},
						{ $set: { isDeactivated: true }},
						{ useFindAndModify: false},
						function(err, match) {
							if (err) {
								res.send({status: 500});
							}
							else {
								res.send({status: 200});
								req.session.destroy();
							}
					});	
				}
				else res.send({status: 401});
			});
		}
		else res.redirect('/login');
	},

	postCreateClass: function(req, res) {
		try{
			let { courseName, startDate, endDate, startTime, endTime, meetLink } = req.body;
			// console.log(courseName, startDate, endDate, startTime, endTime, meetLink)

			// generate classID
			var classID = generateClassID();
			// console.log("ClassID: " + classID);

			var sTime = new Date("Jan 01 2021 " + startTime + ":00");
			var eTime = new Date("Jan 01 2021 " + endTime + ":00");
			// console.log(sTime, eTime);

			// create the class
			var tempClass = createClass(classID, req.session.user.userID, courseName, startDate, endDate, sTime, eTime, meetLink);

			
			// add into Class model
			ClassDB.create(tempClass, function(error) {
			if (error) {
				res.send({status: 500, mssg: 'Error in adding class.'});
				console.log("create-class error: " + error);
			}
			// add into TrainerInfo array
			else {
				res.send({status: 200});	
				// UserDB.findOneAndUpdate({userID: req.session.user.userID},
				// 	{$push: {TrainerInfo: tempClass}}, 
				// 	{useFindAndModify: false}, function(err) {
				// 		if (err) 
				// 			res.send({status: 500, mssg: 'Cannot update Trainer Info'});
				
				// 		else res.send({status: 200});	
				// 	});
				}
			});
		} catch(e){
			res.send({status: 500, mssg: 'Cannot connect to db.'});
		}
	},
	
	//there might be a way to optimize
	postAcceptApplic: async function(req, res) {
		try {
			if(req.session.user.userType === "HRadmin"){
                let applic = await db.updateOne(ApplicantDB, {applicantID: req.body.applicantID}, {screenStatus: "ACCEPTED"});
                res.sendStatus(200);
			}			
		} catch(e){
			console.log(e);
			res.send(e);
		}		
	},
	
	postRejectApplic: async function(req, res) {
		try {
			if(req.session.user.userType === "HRadmin"){
                let applic = await db.updateOne(ApplicantDB, {applicantID: req.body.applicantID}, {screenStatus: "REJECTED"});
                res.sendStatus(200);
			}			 
		} catch(e){
			console.log(e);
			res.send(e);
		}		
	},

	postRemoveApplic: async function(req, res) {
		try {
			if(req.session.user.userType === "HRadmin"){
                let applic = await db.updateOne(ApplicantDB, {applicantID: req.body.applicantID}, {screenStatus: "PENDING"});
//				console.log(applic.screenStatus);
                res.sendStatus(200);
			}			 
		} catch(e){
			console.log(e);
			res.send(e);
		}		
	}, 
	
	postIntervSched: async function(req, res) {
		try {    
			if(req.session.user.userType === "HRadmin"){
				let intID = generateID("IN");
				let {intervPhase, schedDate, timeStart, timeEnd, intervID, applicID, meetingLink} = req.body;
				
				// find Interviewer and Applicant
				let interv = await db.findOne(UserDB, {userID: intervID}, '');
				let applic = await db.findOne(ApplicantDB, {applicantID: applicID}, '');
				
				// format timeSlot to Date type
				let tStart = toDate(schedDate, timeStart);
				let tEnd = toDate(schedDate, timeEnd);
				console.log("tStart: " + tStart); 
				console.log("tStart: " + tEnd); 
				
				let maxCap = interv.intervCap;
				console.log("intervCap: " + maxCap);
				
				if(maxCap !== 0){
					let intervSched = await db.insertOne(InterviewDB, {
									intervID: intID,
									phase: intervPhase,
									date: new Date(schedDate),
									timeStart: tStart,
									timeEnd: tEnd,
									interviewer: interv,
									applicant: applic,
									meetingLink: meetingLink
								});
					maxCap--;
					let updateInterv = await db.updateOne(UserDB, {userID: intervID}, {intervCap: maxCap});
					console.log("intervCap: " + maxCap);
					
					if(intervSched){
						let sched = await InterviewDB.findOne({intervID: intID}, '').populate("interviewer applicant");
						console.log(sched);
						res.status(200).send(sched);
					}
					
				} else {
					console.log("Sorry, interview slots of this Interviewer is full.");
					res.status(400).send("Sorry, interview slots of this Interviewer is full.");
				}
			}
			
		} catch(e){
			console.log(e);
			res.send(e);
		}
	},
	
	getTest: function(req, res){
//		res.render('hr-screening', {});
//		res.render('hr-schedule', {});
		res.render('int-applicants', {});
	}
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
