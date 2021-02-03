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
const ScoreDB = require('../models/Score');


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

function toDate(date, time) {
    let d = new Date(date);
    d.setHours(time.substr(0, time.indexOf(":")));
    d.setMinutes(time.substr(time.indexOf(":") + 1));
    d.setSeconds(0);
	return d.toString();
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
		res.render('app-form', {
		});
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
				
		} catch(e) {
			console.log(e);
			res.send(e);			
		}		
	},
	
	getResumeDL: async function(req, res){
		try {
			let applic = await db.findOne(ApplicantDB, {applicantID: req.query.applicID}, '');
			console.log("in resumeDL(): " + req.query.applicID);
			let file = Buffer.from(applic.resume_cv.buffer).toString('base64');

			res.setHeader('Content-Length', file.length);
			res.write(file, 'binary');
			res.end();					

		} catch(e) {
			console.log(e);
			res.send(e);				
		}

	},
	
//// non-functional
	getApplicPDF: async function(req, res){

		let applic = await db.findOne(ApplicantDB, {applicantID: req.query.applicID}, '');
		console.log(req.query.applicID);
		let encodePDF = Buffer.from(applic.resume_cv.buffer).toString('base64');
		 console.log(encodePDF);
		res.status(200).send(encodePDF);
	
	},
	
	getPDF: function(req, res){
		res.render('testpdf', {});
	},
////	

	getHRReports: function(req, res, next) {
		res.render('application-reports');
	},

	getTraineeProf: function(req, res, next) {
		if (req.session.user){

			//collect classes of the trainee
			ScoreDB.find({traineeID: req.session.user.userID}, async function(err, data) {
				var classes = JSON.parse(JSON.stringify(data));
				console.log(classes);

				// fix format of dates
				for(let i = 0; i < classes.length; i++) {
					var classDummy = await db.findOne(ClassDB, {classID: classes[i].classID});
					var classVar = JSON.parse(JSON.stringify(classDummy));
					console.log(classVar);

					var sDate = formatShortDate(classVar.startDate);
					var eDate = formatShortDate(classVar.endDate);

					classes[i].sDate = sDate;
					classes[i].eDate = eDate;
				}

				res.render('trainee-profile', {
					classList: classes,
					fName: req.session.user.fName,
					lName: req.session.user.lName,
					userID: req.session.user.userID,
				});
			});			
		} else {
			res.redirect('/');
		}
	},

	getTraineeClasses: async function(req, res, next) {
		if (req.session.user.userType === "Trainee") {
			//collect classes of the trainee
			ScoreDB.find({traineeID: req.session.user.userID}, async function(err, data) {
				var classes = JSON.parse(JSON.stringify(data));
				console.log(classes);

				// fix format of dates
				for(let i = 0; i < classes.length; i++) {
					var classDummy = await db.findOne(ClassDB, {classID: classes[i].classID});
					var classVar = JSON.parse(JSON.stringify(classDummy));
					console.log(classVar);

					var sDate = formatShortDate(classVar.startDate);
					var eDate = formatShortDate(classVar.endDate);

					classes[i].sDate = sDate;
					classes[i].eDate = eDate;
				}
			
				res.render('trainee-classes', {
					classList: classes,
				});
			});	
		}
		else {
			res.redirect('/');
		}
	},

	getCertificate: function(req, res, next) {
		if (req.session.user){

			//collect all
			ScoreDB.find({traineeID: req.session.user.userID}, async function(err, data) {
				var classes = JSON.parse(JSON.stringify(data));
				console.log(classes);

				// fix format of dates
				for(let i = 0; i < classes.length; i++) {
					var classDummy = await db.findOne(ClassDB, {classID: classes[i].classID});
					var classVar = JSON.parse(JSON.stringify(classDummy));
					console.log(classVar);

					var sDate = formatShortDate(classVar.startDate);
					var eDate = formatShortDate(classVar.endDate);

					classes[i].sDate = sDate;
					classes[i].eDate = eDate;
				}

				res.render('certificate', {
					classList: classes,
					fName: req.session.user.fName,
					lName: req.session.user.lName,
					userID: req.session.user.userID,
				});
			});			
		} else {
			res.redirect('/');
		}
	},

	getTEClassDet: function(req, res, next) {
		var classID = req.params.classID;

		ClassDB.find({classID: classID}, async function(err, data) {
			var classVar = JSON.parse(JSON.stringify(data));
			// var classDet = classVar;	
			// console.log(classVar);
		
			// fix format of dates
			var sDate = formatDate(classVar[0].startDate);
			var eDate = formatDate(classVar[0].endDate);

			classVar[0].startDate = sDate;
			classVar[0].endDate = eDate;

			// fix format of time
			var sTime = formatTime(classVar[0].startTime);
			var eTime = formatTime(classVar[0].endTime);

			classVar[0].startTime = sTime;
			classVar[0].endTime = eTime;

			// collect trainee scores
			var traineeDump = await db.findOne(ScoreDB, {classID: classVar[0].classID, traineeID: req.session.user.userID});
			var traineeVar = JSON.parse(JSON.stringify(traineeDump));
				// console.log(traineeVar);

			// compute for daily average in scoresheet
				// get average of score skills per day
			var ave1 = (traineeVar.Day1[0] + traineeVar.Day2[0] + traineeVar.Day3[0] + traineeVar.Day4[0] + traineeVar.Day5[0] + traineeVar.Day6[0] + traineeVar.Day7[0] + traineeVar.Day8[0])/8;
			var ave2 = (traineeVar.Day1[1] + traineeVar.Day2[1] + traineeVar.Day3[1] + traineeVar.Day4[1] + traineeVar.Day5[1] + traineeVar.Day6[1] + traineeVar.Day7[1] + traineeVar.Day8[1])/8;
			var ave3 = (traineeVar.Day1[2] + traineeVar.Day2[2] + traineeVar.Day3[2] + traineeVar.Day4[2] + traineeVar.Day5[2] + traineeVar.Day6[2] + traineeVar.Day7[2] + traineeVar.Day8[2])/8;
			var ave4 = (traineeVar.Day1[3] + traineeVar.Day2[3] + traineeVar.Day3[3] + traineeVar.Day4[3] + traineeVar.Day5[3] + traineeVar.Day6[3] + traineeVar.Day7[3] + traineeVar.Day8[3])/8;
			var ave5 = (traineeVar.Day1[4] + traineeVar.Day2[4] + traineeVar.Day3[4] + traineeVar.Day4[4] + traineeVar.Day5[4] + traineeVar.Day6[4] + traineeVar.Day7[4] + traineeVar.Day8[4])/8;

				// insert into array
			var dailyAve = [ave1.toFixed(3), ave2.toFixed(3), ave3.toFixed(3), ave4.toFixed(3), ave5.toFixed(3)];

				// compute for final average 
			var finalAve = (ave1 + ave2 + ave3 + ave4 + ave5)/5;
			
			var skill1 = ['Verbal Communication', traineeVar.Day1[0], traineeVar.Day2[0], traineeVar.Day3[0], traineeVar.Day4[0], traineeVar.Day5[0],traineeVar.Day6[0],traineeVar.Day7[0],traineeVar.Day8[0]];
			var skill2 = ['Written Communication', traineeVar.Day1[1], traineeVar.Day2[1], traineeVar.Day3[1], traineeVar.Day4[1], traineeVar.Day5[1],traineeVar.Day6[1],traineeVar.Day7[1],traineeVar.Day8[1]];
			var skill3 = ['Compliance to Rules', traineeVar.Day1[2], traineeVar.Day2[2], traineeVar.Day3[2], traineeVar.Day4[2], traineeVar.Day5[2],traineeVar.Day6[2],traineeVar.Day7[2],traineeVar.Day8[2]];
			var skill4 = ['Analytical Skills', traineeVar.Day1[3], traineeVar.Day2[3], traineeVar.Day3[3], traineeVar.Day4[3], traineeVar.Day5[3],traineeVar.Day6[3],traineeVar.Day7[3],traineeVar.Day8[3]];
			var skill5 = ['Technical Skills', traineeVar.Day1[4], traineeVar.Day2[4], traineeVar.Day3[4], traineeVar.Day4[4], traineeVar.Day5[4],traineeVar.Day6[4],traineeVar.Day7[4],traineeVar.Day8[4]];
			
			classVar[0].trainee = traineeVar;
			console.log(classVar[0].trainee)

			res.render('te-class-details', {
				classID: classID,
				courseName: classVar[0].courseName,
				skill1: skill1,
				skill2: skill2,
				skill3: skill3,
				skill4: skill4,
				skill5: skill5,
				dailyAve: dailyAve,
				finalAve: finalAve.toFixed(3),
				date: classVar[0].startDate + " - " + classVar[0].endDate + ", 2021",
				time: classVar[0].startTime + " - " + classVar[0].endTime,
				meetLink: classVar[0].meetLink,
			});
		});
	},

	getTrainerClasses: async function(req, res, next) {
		if (req.session.user.userType === "Trainer") {
			//collect classes under current trainer
			ClassDB.find({trainerID: req.session.user.userID}, async function(err, data) {
				var classes = JSON.parse(JSON.stringify(data));

				// fix format of dates
				for(let i = 0; i < classes.length; i++) {
					var sDate = formatShortDate(classes[i].startDate);
					var eDate = formatShortDate(classes[i].endDate);

					classes[i].sDate = sDate;
					classes[i].eDate = eDate;

					// collect all trainees under each class
					var traineesDump = await db.findMany(ScoreDB, {classID: classes[i].classID});
					var traineesVar = JSON.parse(JSON.stringify(traineesDump));
						// console.log(traineesVar);

					classes[i].numTrainees = traineesVar.length;
				}

				// console.log(classes);

				CourseDB.find({}, function(err, data) {
					var courses = JSON.parse(JSON.stringify(data));
					
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


	getTRClassDetails: async function(req, res, next) {
		var classID = req.params.classID;
		
		ClassDB.find({classID: classID}, async function(err, data) {
			var classVar = JSON.parse(JSON.stringify(data));
			// var classDet = classVar;	
			// console.log(classVar);
		
			// fix format of dates
			var sDate = formatDate(classVar[0].startDate);
			var eDate = formatDate(classVar[0].endDate);

			classVar[0].startDate = sDate;
			classVar[0].endDate = eDate;

			// fix format of time
			var sTime = formatTime(classVar[0].startTime);
			var eTime = formatTime(classVar[0].endTime);

			classVar[0].startTime = sTime;
			classVar[0].endTime = eTime;

			// collect trainees in class
			var traineesDump = await db.findMany(ScoreDB, {classID: classVar[0].classID});
			var traineesVar = JSON.parse(JSON.stringify(traineesDump));
				// console.log(traineesVar);
			var numTrainees = traineesVar.length;

			// compute for daily average in scoresheet
			var finalAve = 0;
			var fAve = 0;
			for(var i = 0; i < numTrainees; i++){
				// get average of score skills per day
				var ave1 = (traineesVar[i].Day1[0] + traineesVar[i].Day1[1] + traineesVar[i].Day1[2] + traineesVar[i].Day1[3] + traineesVar[i].Day1[4])/5;
				var ave2 = (traineesVar[i].Day2[0] + traineesVar[i].Day2[1] + traineesVar[i].Day2[2] + traineesVar[i].Day2[3] + traineesVar[i].Day2[4])/5;
				var ave3 = (traineesVar[i].Day3[0] + traineesVar[i].Day3[1] + traineesVar[i].Day3[2] + traineesVar[i].Day3[3] + traineesVar[i].Day3[4])/5;
				var ave4 = (traineesVar[i].Day4[0] + traineesVar[i].Day4[1] + traineesVar[i].Day4[2] + traineesVar[i].Day4[3] + traineesVar[i].Day4[4])/5;
				var ave5 = (traineesVar[i].Day5[0] + traineesVar[i].Day5[1] + traineesVar[i].Day5[2] + traineesVar[i].Day5[3] + traineesVar[i].Day5[4])/5;
				var ave6 = (traineesVar[i].Day6[0] + traineesVar[i].Day6[1] + traineesVar[i].Day6[2] + traineesVar[i].Day6[3] + traineesVar[i].Day6[4])/5;
				var ave7 = (traineesVar[i].Day7[0] + traineesVar[i].Day7[1] + traineesVar[i].Day7[2] + traineesVar[i].Day7[3] + traineesVar[i].Day7[4])/5;
				var ave8 = (traineesVar[i].Day8[0] + traineesVar[i].Day8[1] + traineesVar[i].Day8[2] + traineesVar[i].Day8[3] + traineesVar[i].Day8[4])/5;

				// insert into array
				traineesVar[i].Day1[5] = ave1.toFixed(3);
				traineesVar[i].Day2[5] = ave2.toFixed(3);
				traineesVar[i].Day3[5] = ave3.toFixed(3);
				traineesVar[i].Day4[5] = ave4.toFixed(3);
				traineesVar[i].Day5[5] = ave5.toFixed(3);
				traineesVar[i].Day6[5] = ave6.toFixed(3);
				traineesVar[i].Day7[5] = ave7.toFixed(3);
				traineesVar[i].Day8[5] = ave8.toFixed(3);

				// compute for final average 
				fAve = (ave1 + ave2 + ave3 + ave4 + ave5 + ave6 + ave7 + ave8)/8;
				
				traineesVar[i].finalAve = fAve.toFixed(3);

				console.log(traineesVar[i]);
			}

			classVar[0].trainees = traineesVar;
			// console.log(classVar[0].trainees)

			res.render('tr-class-details', {
				classID: classID,
				courseName: classVar[0].courseName,
				numTrainees: numTrainees,
				trainees: classVar[0].trainees,
				date: classVar[0].startDate + " - " + classVar[0].endDate + ", 2021",
				time: classVar[0].startTime + " - " + classVar[0].endTime,
				meetLink: classVar[0].meetLink,
			});
		});
	},

	getScoresheet: async function(req, res, next) {
		var classID = req.params.classID;
		// which day?

		ClassDB.find({classID: classID}, async function(err, data) {
			var classVar = JSON.parse(JSON.stringify(data));
			// var classDet = classVar;	
			// console.log(classVar);
		
			// fix format of dates
			var sDate = formatDate(classVar[0].startDate);
			var eDate = formatDate(classVar[0].endDate);

			classVar[0].startDate = sDate;
			classVar[0].endDate = eDate;

			// fix format of time
			var sTime = formatTime(classVar[0].startTime);
			var eTime = formatTime(classVar[0].endTime);

			classVar[0].startTime = sTime;
			classVar[0].endTime = eTime;

			// count number of trainees in class
			var traineesDump = await db.findMany(ScoreDB, {classID: classVar[0].classID});
			var traineesVar = JSON.parse(JSON.stringify(traineesDump));
				// console.log(traineesVar);

			// classes[0].numTrainees = traineesVar.length;
			classVar[0].trainees = traineesVar;

			res.render('update-scoresheet', {
				classID: classID,
				startDate: classVar[0].startDate,
				endDate: classVar[0].endDate,
				courseName: classVar[0].courseName,
				trainees: classVar[0].trainees,
			});
		});
	},

	getTraineeList: async function(req, res, next) {
		var classID = req.params.classID;
		
		// find the class
		var classVar = await db.findOne(ScoreDB, {classID: classID});
			console.log(classVar);

		// get all trainees
		var traineesVar = await UserDB.find({userType: "Trainee"});
			// console.log(trainees);
				
		// divide trainees
		for(var i = 0; i < traineesVar.length; i++){
			var classTrainees = await ScoreDB.find({classID: classID, traineeID: traineesVar[i].traineeID});
		}

			res.render('manage-trainees', {
				classID: classID,
				// traineeList: trainees,
				classList: classTrainees,

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
			else {
				res.send({status: 200}); }
			});
		} catch(e){
			res.send({status: 500, mssg: 'Cannot connect to db.'});
		}
	},
	
	postEditClass: function(req, res) {
		try{
			let { classID, courseName, startDate, endDate, startTime, endTime, meetLink, classPhoto } = req.body;
	
			var sTime = new Date("Jan 01 2021 " + startTime + ":00");
			var eTime = new Date("Jan 01 2021 " + endTime + ":00");
			// console.log(sTime, eTime);

			ClassDB.findOneAndUpdate(
				{ classID: classID },
				{ $set: {
					courseName: courseName, startDate: startDate, endDate: endDate,
					startTime: startTime, endTime: endTime, meetLink: meetLink, classPhoto: classPhoto,
				}},
				{ useFindAndModify: false },
				function(err, match) {
					if (err) {
						res.send({status: 500, mssg: "Error in updating class."});
					}
					else{
						res.send({status: 200});
					}
			});
		} catch(e){
			res.send({status: 500, mssg: 'Cannot connect to db.'});
		}
	},

	postDeleteClass: function(req, res) {
		let { classID } = req.body;

		ClassDB.findOne({classID: classID}, function(err, match) {
			if (err) {
				res.send({status: 500, mssg:'Error in deleting class.'});
			}			
			else {
				match.remove();
				res.send({status: 200});
			}
		});

	},

	postEditScores: function(req, res) {

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
				
				// get all interviews under that interviewer 
				let interviews = await InterviewDB.find({}, '').populate("interviewer applicant");
				let filterIntervs = interviews.filter(elem => (elem.interviewer.userID === intervID) );
				
				// filter through interviews that have that same schedule Date
				let sameIntervs = filterIntervs.filter(elem => 
					((new Date(elem.date)).getFullYear() === new Date(schedDate).getFullYear())
					&& ((new Date(elem.date)).getMonth() === new Date(schedDate).getMonth())
					&& ((new Date(elem.date)).getDate() === new Date(schedDate).getDate()));
					
				console.log("sameIntervs length: "+ sameIntervs.length);
				// check if those Interviews has reached max capacity of the day (7)
				if (sameIntervs.length >= 7){
					console.log("Sorry, interview slots of this Interviewer is full.");
					res.send({status: 400, mssg: "Sorry, interview slots of this Interviewer is full."});
					
				} else { // if not, proceed to creating sched
				
					// format timeSlot to Date type
					let tStart = toDate(schedDate, timeStart);
					let tEnd = toDate(schedDate, timeEnd);
					console.log("tStart: " + tStart); 
					console.log("tStart: " + tEnd); 

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
					
					if(intervSched){
						let sched = await InterviewDB.findOne({intervID: intID}, '').populate("interviewer applicant");
						console.log(sched);
						res.status(200).send(sched);
					}
				}
			}
			
		} catch(e){
			console.log(e);
			res.send(e);
		}
	},
	
	postApplicStatus: async function(req, res) {
		try {    
			if(req.session.user.userType === "HRinterv"){
				let {applicIDs, stats} = req.body;
				
				console.log("applicIDs: "+ applicIDs);
				console.log("stats: "+ stats);
				
				// search for Interview phase of HR interviewer
				let intervs = await InterviewDB.find({}, '').populate("interviewer applicant");
				let phase;
				
				for(i=0; i<intervs.length;i++){
					if(intervs[i].interviewer.userID === req.session.user.userID){
						phase = intervs[i].phase;
					}
				}
				
				if (phase === "Initial")
					for(i=0; i<applicIDs.length; i++){
						let applicant = await db.updateOne(ApplicantDB, {applicantID: applicIDs[i]}, {initialStatus: stats[i]});
					}
				
				if (phase === "Final")
					for(i=0; i<applicIDs.length; i++){
						let applicant = await db.updateOne(ApplicantDB, {applicantID: applicIDs[i]}, {initialStatus: stats[i]});
					}
				  
				res.status(200).send();
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
