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
function createClass(classID, trainerID, courseName, startDate, endDate, startTime, endTime, meetLink, classPhoto) {
	var tempClass = {
		classID: classID,
		trainerID: trainerID,
		courseName: courseName,
		startDate: startDate,
		endDate: endDate,
		startTime: startTime,
		endTime: endTime,
		meetLink: meetLink,
		classPhoto: classPhoto,
		trainees: []
	};

	return tempClass;
}

// format date
function formatDate(date) {
	var newDate = new Date(date);

	var mm = newDate.getMonth() + 1;
	switch(mm) {
		case 1: mm = "January"; break;
		case 2: mm = "February"; break;
		case 3: mm = "March"; break;
		case 4: mm = "April"; break;
		case 5: mm = "May"; break;
		case 6: mm = "June"; break;
		case 7: mm = "July"; break;
		case 8: mm = "August"; break;
		case 9: mm = "September"; break;
		case 10: mm = "October"; break;
		case 11: mm = "November"; break;
		case 12: mm = "December"; break;
	}

	var dd = newDate.getDate();

	return mm + " " + dd;
}

function formatShortDate(date) {
	var newDate = new Date(date);

	var mm = newDate.getMonth() + 1;
	switch(mm) {
		case 1: mm = "Jan"; break;
		case 2: mm = "Feb"; break;
		case 3: mm = "Mar"; break;
		case 4: mm = "Apr"; break;
		case 5: mm = "May"; break;
		case 6: mm = "Jun"; break;
		case 7: mm = "Jul"; break;
		case 8: mm = "Aug"; break;
		case 9: mm = "Sep"; break;
		case 10: mm = "Oct"; break;
		case 11: mm = "Nov"; break;
		case 12: mm = "Dec"; break;
	}

	var dd = newDate.getDate();
	var yy = newDate.getFullYear();

	return mm + " " + dd;
}

function formatNiceDate(date) {
	var newDate = new Date(date);
	// adjust 0 before single digit date
	let day = ("0" + newDate.getDate()).slice(-2);

	// current month
	let month = ("0" + (newDate.getMonth() + 1)).slice(-2);

	// current year
	let year = newDate.getFullYear();

	return year + "-" + month + "-" + day;
}

// two digits
function n(n) {
    return n > 9 ? "" + n: "0" + n;
}

//format time
function formatTime(time) {
	var time = new Date(time);

	var hh = n(time.getHours());
	var min = n(time.getMinutes());

	return hh + ":" + min; 
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
			else if (req.session.user.userType === "SLadmin")
				res.render('sales-home', {});
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

/* [] Schedule Interview
 */
	getHRSched: function(req, res) {
		if(req.session.user.userType === "HRadmin"){
			
			
			res.render('hr-schedule', {
			});
		}


	},
	
	getIntervApplic: async function(req, res) {
		try {
			let interviewers = await db.findMany(UserDB, {userType: "HRinterv"}, '');
			let applicants = await db.findMany(ApplicantDB, {screenStatus: "ACCEPTED"}, '');
//			console.log("in getIntervApplic(): /" + interviewers + applicants);
			res.send({intervs: interviewers, applics: applicants});
			
		} catch(e) {
			console.log(e);
			res.send(e);
		}
	},

/* [..] Screen Applicants
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
				console.log(req.query);
				
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

	getHRReports: function(req, res, next) {
		res.render('application-reports', {
		});
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
				var classes2 = JSON.parse(JSON.stringify(data));

				// var classDet = classes;	
				// console.log(classes);

				// fix format of dates
				for(let i = 0; i < classes.length; i++) {
					sDate = formatShortDate(classes[i].startDate);
					eDate = formatShortDate(classes[i].endDate);

					classes[i].sDate = sDate;
					classes[i].eDate = eDate;
				}
				
				// console.log(classes);

				CourseDB.find({}, function(err, data) {
					var courses = JSON.parse(JSON.stringify(data));
					// var courseDet = courses;	
					// console.log(courses);
					
					res.render('trainer-classes', {
						classList: classes,
						courseList: courses,
					});
				});	
			});
		}
		else {
			res.redirect('/');
		}
	},


	getTRClassDetails: function(req, res, next) {
		var classID = req.params.classID;
		
		ClassDB.find({classID: classID}, function(err, data) {
			var classVar = JSON.parse(JSON.stringify(data));
			// var classDet = classVar;	
			console.log(classVar);
		
			// count number of trainees in class

			// fix format of dates
			sDate = formatDate(classVar[0].startDate);
			eDate = formatDate(classVar[0].endDate);

			classVar[0].startDate = sDate;
			classVar[0].endDate = eDate;

			// fix format of time
			sTime = formatTime(classVar[0].startTime);
			eTime = formatTime(classVar[0].endTime);

			classVar[0].startTime = sTime;
			classVar[0].endTime = eTime;

			res.render('tr-class-details', {
				courseName: classVar[0].courseName,
				// numTrainees: ,
				date: classVar[0].startDate + " - " + classVar[0].endDate + ", 2021",
				time: classVar[0].startTime + " - " + classVar[0].endTime,
				meetLink: classVar[0].meetLink,

				// scoresheet
			});
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

	getTrainingReports: function(req, res, next) {
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

	getSalesHome: function(req, res, next) {
		res.render('sales-home', {
		});
	},

	getVAList: function(req, res, next) {
		res.render('sales-valist', {
		});
	},

	getClientList: function(req, res, next) {
		res.render('sales-clientlist', {
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
			
	getTest: function(req, res){
//		res.render('hr-screening', {});
		res.render('hr-schedule', {});
//		res.render('int-applicants', {});
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
			let { courseName, startDate, endDate, startTime, endTime, meetLink, classPhoto } = req.body;
			// console.log(courseName, startDate, endDate, startTime, endTime, meetLink)

			// generate classID
			var classID = generateClassID();
			// console.log("ClassID: " + classID);

			var sTime = new Date("Jan 01 2021 " + startTime + ":00");
			var eTime = new Date("Jan 01 2021 " + endTime + ":00");
			// console.log(sTime, eTime);

			// create the class
			var tempClass = createClass(classID, req.session.user.userID, courseName, startDate, endDate, sTime, eTime, meetLink, classPhoto);

			
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
	
	postEditClass: function(req, res) {
		try{
			let { courseName, startDate, endDate, startTime, endTime, meetLink, classPhoto } = req.body;
			// console.log(courseName, startDate, endDate, startTime, endTime, meetLink)

			// generate classID
			var classID = generateClassID();
			// console.log("ClassID: " + classID);

			var sTime = new Date("Jan 01 2021 " + startTime + ":00");
			var eTime = new Date("Jan 01 2021 " + endTime + ":00");
			// console.log(sTime, eTime);

			// create the class
			var tempClass = createClass(classID, req.session.user.userID, courseName, startDate, endDate, sTime, eTime, meetLink, classPhoto);

			
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

	postDeleteClass: function(req, res) {
		let { classID } = req.body;



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
				let tStart = schedDate + timeStart;
				let tEnd = schedDate + timeEnd;
				console.log("timeStart: " + timeStart);
				console.log("timeEnd: " + timeEnd);				
				console.log(tStart);
				console.log(tEnd);
				
				let intervSched = await db.insertOne(InterviewDB, {
								intervID: intID,
								phase: intervPhase,
								date: schedDate,
								timeStart: tStart,
								timeEnd: tEnd,
								interviewer: interv,
								applicant: applic,
								meetingLink: meetingLink
							});
				
				if(intervSched) res.sendStatus(200);
			}
			
		} catch(e){
			console.log(e);
			res.send(e);
		}
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
