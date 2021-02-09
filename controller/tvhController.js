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
function createClass(classID, trainerID, trainerName, courseName, startDate, endDate, startTime, endTime, meetLink, classPhoto) {
	var tempClass = {
		classID: classID,
		trainerID: trainerID,
		trainerName: trainerName,
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

function createClassTrainee(traineeID, fName, lName, classID, courseName) {
	var tempVar = {
		traineeID: traineeID,
		fName: fName,
		lName: lName,
		classID: classID,
		courseName: courseName,
		Day1: ['0','0','0','0','0'],
		Day2: ['0','0','0','0','0'],
		Day3: ['0','0','0','0','0'],
		Day4: ['0','0','0','0','0'],
		Day5: ['0','0','0','0','0'],
		Day6: ['0','0','0','0','0'],
		Day7: ['0','0','0','0','0'],
		Day8: ['0','0','0','0','0'],
		finalAve: '0',
		traineeStatus: 'IN-PROGRESS'
	};

	return tempVar;
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

function formDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
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

/* [/] HR Screening
 */
	
	getHRScreening: async function(req, res) {
		if(req.session.user) {
			if(req.session.user.userType === "HRadmin"){				
				let applicants = await db.aggregate(ApplicantDB, [
					{'$match': {}},
					{'$sort': {lName: 1, fName: 1, sys_reqs: 1}}
				]);
				
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

/*	
	sortSysReqs: async function(req, res) {
		if(req.session.user) {
			if(req.session.user.userType === "HRadmin"){
				let applicants = await db.aggregate(ApplicantDB, [
					{'$match': {}},
					{'$sort': {sys_reqs: 1}}
				]);
				
				if (applicants.length > 0){
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

					res.send({status: 200,
						accepted: acceptApps,
						pending: pendApps,
						rejected: rejectApps
					});					
				} else {
					res.send({status: 400, mssg: "Cannot retrieve from database."});
				}
			}
		}
	},
*/
	
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
				console.log(intervs);
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
	
	getIntervFiltered: async function(req, res) {
		try {    
			if(req.session.user.userType === "HRinterv"){
				let {phase, checkStatus} = req.query;
				
				// search for Interview phase of HR interviewer
				let intervs = await InterviewDB.find({}, '').populate("interviewer applicant");
				let filtered = intervs.filter(elem => elem.interviewer.userID === req.session.user.userID);
				let filterIntervs = [];

				if (checkStatus === "Done") {
					if (phase === "Initial")
						for (i=0; i<filtered.length; i++){
							if (!(filtered[i].applicant.initialStatus === "FOR REVIEW"))
								filterIntervs.push(filtered[i]);
						}
					else if (phase === "Final")
						for (i=0; i<filtered.length; i++){
							if (!(filtered[i].applicant.finalStatus === "FOR REVIEW"))
								filterIntervs.push(filtered[i]);
						}		
					
				} else if (checkStatus === "Pending") {
					if (phase === "Initial")
						for (i=0; i<filtered.length; i++){
							if (filtered[i].applicant.initialStatus === "FOR REVIEW")
								filterIntervs.push(filtered[i]);
						}
					else if (phase === "Final")
						for (i=0; i<filtered.length; i++){
							if (filtered[i].applicant.finalStatus === "FOR REVIEW")
								filterIntervs.push(filtered[i]);
						}						
				} else 
					for (i=0; i<filtered.length; i++)
						filterIntervs.push(filtered[i]);				
				
				console.log("filterIntervs: "+ filterIntervs);
				res.status(200).send(filterIntervs);
			}	
		} catch(e){
			console.log(e);
			res.send(e);
		}
	},
	
//// non-functional
//	getApplicPDF: async function(req, res){
//
//		let applic = await db.findOne(ApplicantDB, {applicantID: req.query.applicID}, '');
//		console.log(req.query.applicID);
//		let encodePDF = Buffer.from(applic.resume_cv.buffer).toString('base64');
//		 console.log(encodePDF);
//		res.status(200).send(encodePDF);
//	
//	},
//	
//	getPDF: function(req, res){
//		res.render('testpdf', {});
//	},
////	

	getHRReports: async function(req, res) {

		var initApplics = await db.findMany(ApplicantDB, {});
		var applicList = [];
		var screenPass = [];
		var screenFail = [];
		var initialPass = [];
		var initialFail = [];
		var finalPass = [];
		var finalFail = [];
		
		// exclude PENDING, FOR REVIEW statuses..
		for (let j=0; j<initApplics.length; j++)
			if (!(initApplics[j].screenStatus === "PENDING") && !(initApplics[j].initialStatus === "FOR REVIEW") && !(initApplics[j].finalStatus === "FOR REVIEW"))
				applicList.push(initApplics[j]);
		
		for(var i=0; i < applicList.length; i++) {
			if(applicList[i].screenStatus === "ACCEPTED") 
				screenPass.push(applicList[i]);
			else if(applicList[i].screenStatus === "REJECTED") 
				screenFail.push(applicList[i]);
		}

		for(var i=0; i < applicList.length; i++) {
			if(applicList[i].initialStatus === "PASS") 
				initialPass.push(applicList[i]);
			else if(applicList[i].initialStatus === "FAIL") 
				initialFail.push(applicList[i]);
		}

		for(var i=0; i < applicList.length; i++) {
			if(applicList[i].finalStatus === "PASS") 
				finalPass.push(applicList[i]);
			else if(applicList[i].finalStatus === "FAIL") 
				finalFail.push(applicList[i]);
		}

		res.render('application-reports', {
			applicants: applicList,
			spLength: screenPass.length,
			sfLength: screenFail.length,
			ipLength: initialPass.length,
			ifLength: initialFail.length,
			fpLength: finalPass.length,
			ffLength: finalFail.length,
			screenTotal: screenPass.length + screenFail.length,
			initialTotal: initialPass.length + initialFail.length,
			finalTotal: finalPass.length + finalFail.length
		});
	},
	
	getHRFilterReports: async function(req, res) {
		let {appStatus, dStart, dEnd} = req.query;
		
		// format Dates for db
		let dateStart = new Date(dStart);
		let dateEnd = new Date(dEnd);
		
		// placeholder array for rendering
		let applics = [];
		let applicList = [];
		
		// >= dateStart, <= dateEnd -- e.g. 2021/02/05 to 2021/02/10 
		let initApplics = await db.aggregate(ApplicantDB, [
			{'$match': {
				applicDate: {
					$gte: dateStart,
					$lte: dateEnd
				}
			}},
			{'$sort': {lName: 1, fName: 1}}
		]);			
		
		// exclude PENDING, FOR REVIEW statuses..
		for (let j=0; j<initApplics.length; j++)
			if (!(initApplics[j].screenStatus === "PENDING") && !(initApplics[j].initialStatus === "FOR REVIEW") && !(initApplics[j].finalStatus === "FOR REVIEW"))
				applics.push(initApplics[j]);
		
		// count stats for total breakdowns
		let spCount = sfCount = ipCount = ifCount = fpCount = ffCount = 0;	
		
		for (let k=0; k<applics.length; k++){
			// screening 
			if (applics[k].screenStatus === "ACCEPTED")
				spCount++;
			else if (applics[k].screenStatus === "REJECTED")
				sfCount++;
			
			// initialInterv
			if (applics[k].initialStatus === "PASS")
				ipCount++;
			else if (applics[k].initialStatus === "FAIL")
				ifCount++;	
			
			// finalInterv
			if (applics[k].finalStatus === "PASS")
				fpCount++;
			else if (applics[k].finalStatus === "FAIL")
				ffCount++;				
		}
		
		
		if (appStatus === "Endorsed"){
			for (let i=0; i<applics.length; i++)
				if (applics[i].finalStatus === "PASS")	
					applicList.push(applics[i]);			
		} else if (appStatus === "Failed") {
			for (let i=0; i<applics.length; i++)
				if (applics[i].screenStatus === "REJECTED" || applics[i].initialStatus === "FAIL" || applics[i].finalStatus === "FAIL")	
					applicList.push(applics[i]);		
		} else
			for (let i=0; i<applics.length; i++)
				applicList.push(applics[i]);			
		
		//counts                          
		/* total passed				(screening, initialInterv, finalInterv)
		 * total failed				(screening, initialInterv, finalInterv)
		 * no. of all applicants	(screening, initialInterv, finalInterv)
		 */
		
		res.status(200).send({applics: applicList,
					spLength: spCount,
					sfLength: sfCount,
					ipLength: ipCount,
					ifLength: ifCount,
					fpLength: fpCount,
					ffLength: ffCount		
				});
	},

	getTraineeProf: function(req, res, next) {
		if (req.session.user){
		var now = new Date();
		var teStatus = "IN-PROGRESS";

			//collect classes of the trainee
			ScoreDB.find({traineeID: req.session.user.userID}, async function(err, data) {
				var classes = JSON.parse(JSON.stringify(data));
				console.log(classes);

				// fix format of dates
				var trainerName = "";
				var statusCount = 0;
				var traineeGraduated = false;
				for(let i = 0; i < classes.length; i++) {
					var classDummy = await db.findOne(ClassDB, {classID: classes[i].classID});
					var classVar = JSON.parse(JSON.stringify(classDummy));
					// console.log(classVar);

					var sDate = formatShortDate(classVar.startDate);
					var eDate = formatShortDate(classVar.endDate);

					classes[i].sDate = sDate;
					classes[i].eDate = eDate;

					// find trainer name					
					var trainerDummy = await db.findOne(UserDB, {userID: classVar.trainerID});
					var trainerVar = JSON.parse(JSON.stringify(trainerDummy));
					console.log(trainerVar);

					var tName = trainerVar.fName + " " + trainerVar.lName;
					classes[i].trainerName = tName;

					var end = new Date(classVar.endDate);
					// determine trainee status
					if(end < now){ // class is over
						if(classes[i].finalAve > 7) { // check to see if trainee passed 
							classes[i].traineeStatus = "PASSED";
							statusCount += 1;
						}
						else{
							classes[i].traineeStatus = "FAILED";
							teStatus = "FAILED";
						}
					}
					else{
						classes[i].traineeStatus = "IN-PROGRESS";
						teStatus = "IN-PROGRESS"
					}
				}

				// if both classes were passed, trainee has graduated
				if(statusCount === 2){
					traineeGraduated = true;
					teStatus = "GRADUATED";
				}

				res.render('trainee-profile', {
					classList: classes,
					trainingStatus: teStatus,
					traineeGraduated: traineeGraduated,
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


					console.log(classes[i]);
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
			var userID = req.params.userID;
			var sumAve = 0;
			//collect all
			ScoreDB.find({traineeID: req.params.userID}, async function(err, data) {
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

					sumAve += Number(classes[i].finalAve);
				}

				var gradAve = sumAve/classes.length;

				res.render('certificate', {
					fName: req.session.user.fName,
					lName: req.session.user.lName,
					userID: userID,
					gradAve: gradAve,
					endDate: classes[0].eDate + ", 2021",
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

			// check if there are trainees who do not belong to a class yet
				// collect all trainees 
			var allTR = await db.findMany(UserDB, {userType: "Trainee"});
			var VAtrainees = JSON.parse(JSON.stringify(allTR));
			var freeTrainees = 0; // number of trainees who doesn't belong to a class
			// console.log(VAtrainees);
			for(var x = 0; x < VAtrainees.length; x++){
				ScoreDB.findOne({traineeID: VAtrainees[x].traineeID}, function(err, match) {
					if (match) {
						console.log(VAtrainees[x].traineeID);
					}
					else{
						freeTrainees += 1; // increment number of trainees without a class
					}
				});
			}
			console.log(freeTrainees);
			var addClass = false;
			if(freeTrainees >= 10){
				addClass = true;
			}

			//collect classes under current trainer
			ClassDB.find({trainerID: req.session.user.userID}, async function(err, data) {
				var classes = JSON.parse(JSON.stringify(data));

				// fix format of dates
				for(let i = 0; i < classes.length; i++) {
					var start = new Date(classes[i].startDate);
					var now = new Date();
					var classEditable = false;

					if(start.getTime() > now.getTime()){
						//class is editable if it hasn't started yet
						classes[i].classEditable = true; 
					}

					var sDate = formatShortDate(classes[i].startDate);
					var eDate = formatShortDate(classes[i].endDate);

					classes[i].sDate = sDate;
					classes[i].eDate = eDate;

					// not working
					var SD = formDate(classes[i].startDate);
					var ED = formDate(classes[i].endDate);
					classes[i].inputSD = SD;
					classes[i].inputED = ED;

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
						addClass: addClass,
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
			
			var start = new Date(classVar[0].startDate);
			var now = new Date();
			var classDone = false;

			if(start.getTime() > now.getTime()){
				//class is editable if it hasn't started yet
				classVar[0].classDone = true; 
			}
		
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
				classDone: classVar[0].classDone,
			});
		});
	},

	// SCORESHEETS
	getScoresheet1: async function(req, res, next) {
		var classID = req.params.classID;

		ClassDB.find({classID: classID}, async function(err, data) {
			var classVar = JSON.parse(JSON.stringify(data));

			// find trainees in class
			var traineesDump = await db.findMany(ScoreDB, {classID: classVar[0].classID});
			var traineesVar = JSON.parse(JSON.stringify(traineesDump));

			classVar[0].trainees = traineesVar;

			res.render('update-scoresheet1', {
				classID: classID,
				startDate: classVar[0].startDate,
				endDate: classVar[0].endDate,
				courseName: classVar[0].courseName,
				trainees: classVar[0].trainees,
			});
		});
	},

	getScoresheet2: async function(req, res, next) {
		var classID = req.params.classID;

		ClassDB.find({classID: classID}, async function(err, data) {
			var classVar = JSON.parse(JSON.stringify(data));

			// find trainees in class
			var traineesDump = await db.findMany(ScoreDB, {classID: classVar[0].classID});
			var traineesVar = JSON.parse(JSON.stringify(traineesDump));

			classVar[0].trainees = traineesVar;

			res.render('update-scoresheet2', {
				classID: classID,
				startDate: classVar[0].startDate,
				endDate: classVar[0].endDate,
				courseName: classVar[0].courseName,
				trainees: classVar[0].trainees,
			});
		});
	},

	getScoresheet3: async function(req, res, next) {
		var classID = req.params.classID;

		ClassDB.find({classID: classID}, async function(err, data) {
			var classVar = JSON.parse(JSON.stringify(data));

			// find trainees in class
			var traineesDump = await db.findMany(ScoreDB, {classID: classVar[0].classID});
			var traineesVar = JSON.parse(JSON.stringify(traineesDump));

			classVar[0].trainees = traineesVar;

			res.render('update-scoresheet3', {
				classID: classID,
				startDate: classVar[0].startDate,
				endDate: classVar[0].endDate,
				courseName: classVar[0].courseName,
				trainees: classVar[0].trainees,
			});
		});
	},

	getScoresheet4: async function(req, res, next) {
		var classID = req.params.classID;

		ClassDB.find({classID: classID}, async function(err, data) {
			var classVar = JSON.parse(JSON.stringify(data));

			// find trainees in class
			var traineesDump = await db.findMany(ScoreDB, {classID: classVar[0].classID});
			var traineesVar = JSON.parse(JSON.stringify(traineesDump));

			classVar[0].trainees = traineesVar;

			res.render('update-scoresheet4', {
				classID: classID,
				startDate: classVar[0].startDate,
				endDate: classVar[0].endDate,
				courseName: classVar[0].courseName,
				trainees: classVar[0].trainees,
			});
		});
	},

	getScoresheet5: async function(req, res, next) {
		var classID = req.params.classID;

		ClassDB.find({classID: classID}, async function(err, data) {
			var classVar = JSON.parse(JSON.stringify(data));

			// find trainees in class
			var traineesDump = await db.findMany(ScoreDB, {classID: classVar[0].classID});
			var traineesVar = JSON.parse(JSON.stringify(traineesDump));

			classVar[0].trainees = traineesVar;

			res.render('update-scoresheet5', {
				classID: classID,
				startDate: classVar[0].startDate,
				endDate: classVar[0].endDate,
				courseName: classVar[0].courseName,
				trainees: classVar[0].trainees,
			});
		});
	},

	getScoresheet6: async function(req, res, next) {
		var classID = req.params.classID;

		ClassDB.find({classID: classID}, async function(err, data) {
			var classVar = JSON.parse(JSON.stringify(data));

			// find trainees in class
			var traineesDump = await db.findMany(ScoreDB, {classID: classVar[0].classID});
			var traineesVar = JSON.parse(JSON.stringify(traineesDump));

			classVar[0].trainees = traineesVar;

			res.render('update-scoresheet6', {
				classID: classID,
				startDate: classVar[0].startDate,
				endDate: classVar[0].endDate,
				courseName: classVar[0].courseName,
				trainees: classVar[0].trainees,
			});
		});
	},

	getScoresheet7: async function(req, res, next) {
		var classID = req.params.classID;

		ClassDB.find({classID: classID}, async function(err, data) {
			var classVar = JSON.parse(JSON.stringify(data));

			// find trainees in class
			var traineesDump = await db.findMany(ScoreDB, {classID: classVar[0].classID});
			var traineesVar = JSON.parse(JSON.stringify(traineesDump));

			classVar[0].trainees = traineesVar;

			res.render('update-scoresheet7', {
				classID: classID,
				startDate: classVar[0].startDate,
				endDate: classVar[0].endDate,
				courseName: classVar[0].courseName,
				trainees: classVar[0].trainees,
			});
		});
	},

	getScoresheet8: async function(req, res, next) {
		var classID = req.params.classID;

		ClassDB.find({classID: classID}, async function(err, data) {
			var classVar = JSON.parse(JSON.stringify(data));

			// find trainees in class
			var traineesDump = await db.findMany(ScoreDB, {classID: classVar[0].classID});
			var traineesVar = JSON.parse(JSON.stringify(traineesDump));

			classVar[0].trainees = traineesVar;

			res.render('update-scoresheet8', {
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
		if (req.session.user.userType === "Trainer") {
			//collect classes under current trainer
			ClassDB.find({trainerID: req.session.user.userID}, async function(err, data) {
				var classes = JSON.parse(JSON.stringify(data));
				var totalPassed = 0;
				var totalFailed = 0;
				var totalTrainees = 0;
				var numTrainees = 0;
				var classStatus = "";
				// fix format of dates
				for(let i = 0; i < classes.length; i++) {
					var numPassed = 0;
					var numFailed = 0;
					var now = new Date();
					var sDate = formatShortDate(classes[i].startDate);
					var eDate = formatShortDate(classes[i].endDate);

					classes[i].sDate = sDate;
					classes[i].eDate = eDate;

					var end = new Date(classes[i].endDate);
					var start = new Date(classes[i].startDate);
					if(end.getTime() <= now.getTime()){ //class is over
						classes[i].classStatus = "COMPLETED";
					}
					else {
						if (start.getTime() <= now.getTime() && end.getTime() > now.getTime()){
							classes[i].classStatus = "ONGOING";
						}
						else{ // (start.getTime() > now.getTime())
							classes[i].classStatus = "NOT YET STARTED";
						}
					}

					// collect all trainees under each class
					var traineesDump = await db.findMany(ScoreDB, {classID: classes[i].classID});
					var traineesVar = JSON.parse(JSON.stringify(traineesDump));
						// console.log(traineesVar);
					var pass = 0;
					var fail = 0;
					for(var y = 0; y < traineesVar.length; y++){
						if(classes[i].classStatus === "ONGOING" || classes[i].classStatus === "NOT YET STARTED"){
							pass = 0;
							fail = 0;
						}
						else{
							if(traineesVar[y].traineeStatus === "PASSED"){ // trainees passed
								pass += 1;
							}
							else{
								fail += 1;
							}
						}
					}
					// console.log("pass: " + pass + "; fail: " + fail);
					classes[i].numTrainees = traineesVar.length;
					
					classes[i].numPassed = pass;
					classes[i].numFailed = fail;

					// accumulate
					totalPassed += pass;
					totalFailed += fail;
					totalTrainees += traineesVar.length;
				}

				console.log("tPass: " + totalPassed);
				console.log("tFail: " + totalFailed);
				console.log("tTrain: " + totalTrainees);

				// console.log(classes);
				CourseDB.find({}, function(err, data) {
					var courses = JSON.parse(JSON.stringify(data));
					
					res.render('trainer-reports', {
						classList: classes,
						courseList: courses,
						totalPassed: totalPassed,
						totalFailed: totalFailed,
						totalTrainees: totalTrainees,
					});
				});	
			});
		}
		else {
			res.redirect('/');
		}
	},

	// filtered trainee reports
	getFTRReports: async function(req, res) {
		let {courseFilter, sDateFilter, eDateFilter} = req.query;
	},

	getTRSchedule: function(req, res, next) {
		if (req.session.user.userType === "Trainer"){
			res.render('tr-schedule', {
			});
		} else {
			res.redirect('/');
		}
	},

	getSchedule: async function(req, res) {
		try {
			var classes = await ClassDB.find({trainerID: req.session.user.userID}, '');
			res.send(classes);
			
		} catch(e) {
			console.log(e);
			res.send(e);			
		}
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
					screenStatus: "PENDING",
					applicDate: new Date()
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

	postCreateClass: async function(req, res) {
		let { courseName, startDate, endDate, startTime, endTime, meetLink, classPhoto } = req.body;

			// generate classID
			var classID = generateClassID();

			var sTime = new Date("Jan 01 2021 " + startTime + ":00");
			var eTime = new Date("Jan 01 2021 " + endTime + ":00");

			var trainerName = req.session.user.fName + " " + req.session.user.lName;

			// create the class
			var tempClass = createClass(classID, req.session.user.userID, trainerName, courseName, startDate, endDate, sTime, eTime, meetLink, classPhoto);
			
			// add into Class model
			ClassDB.create(tempClass, async function(error) {
			if (error) {
				res.send({status: 500, mssg: 'Error in adding class.'});
				console.log("create-class error: " + error);
			}
			else {
				res.send({status: 200}); 

				// getting trainees with no classes
					// collect all trainees 
				var allTR = await db.findMany(UserDB, {userType: "Trainee"});
				var VAtrainees = JSON.parse(JSON.stringify(allTR));
				
				for(var x = 0; x < VAtrainees.length; x++){
					ScoreDB.findOne({traineeID: VAtrainees[x].traineeID}, function(err, match) {
						if (!match) {
							var trainee = createClassTrainee(VAtrainees[x].traineeID, VAtrainees[x].fName, VAtrainees[x].lName, classID, courseName);
							var startDate = formatDate(startDate);
							var endDate = formatDate(endDate);
							var sTime = formatTime(sTime);
							var eTime = formatTime(eTime);

							// add into Score model
							ScoreDB.create(trainee, function(error) {
								if (error) {
									console.log("adding-trainees error: " + error);
								}
								else {
									// SEND EMAIL to trainees when added to class
									var smtpTransport = nodemailer.createTransport({
										service: 'Gmail',
										auth: {
											user: 'training.tvh@gmail.com',
											pass: 'tvhtraining'
										}
									});

									// content
									var mailOptions = {
										from: 'training.tvh@gmail.com',
										to: sched.applicant.email,
										subject: '[TRAINING] Class Details and Schedule',
										html: `<div style="box-sizing: border-box; background: #6dc63f; width: 500px; margin: auto; padding: 20px;">`
												+`<div style="background-color: #ebf5ee; padding: 80px;">`
													+`<div style="text-align: center;">`
														+`<img style="height: 124px; align-items: center;"src="cid:signature"/> <!-- change to path in our app ehe -->`
													+`</div>`
													+`<section style="text-align: justify; margin-bottom: 40px;">`
														+`<p> Greetings, ${VAtrainees[x].fName}! You have been selected as one of the few to enter the second phase of our application. </p>`
														+`<br><br>`
														+`<p> The following are your class details:</p>`
														+`<p> Section: ${classID} </p>`
														+`<p> Trainer: ${trainerName} </p>`
														+`<p> Date: ${startDate} to ${endDate}, 2021 </p>`
														+`<p> Time: ${sTime} to ${eTime} </p>`
													+`</section>`
												+`</div>`
												+`<footer style="font-size: 10px; color: #ebf5ee; text-align:center; margin-top: 5px;">Copyright © 2021 TVH System</footer>`
												+`</div>`,
										attachments: [{
												filename: 'tvh-logo-square.png',
												path: __dirname+'/tvh-logo-square.png',
												cid: 'signature'
										}]
									};

									smtpTransport.sendMail(mailOptions, function(error) {
										if (error){
											res.send({status: 500});
											console.log(error);
										}
										else{
											res.status(200).send(sched);
										} 

										smtpTransport.close();
									});
								}
						
							});
						}
					});
				}
			}
		});
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

	postSaveScores1: async function(req, res) {
		let { classID, scores1, scores2, scores3, scores4, scores5 } = req.body;
		
		var traineesDump = await db.findMany(ScoreDB, {classID: classID});
		var traineesVar = JSON.parse(JSON.stringify(traineesDump));
		console.log("hi");
		for(var i = 0; i < traineesVar.length; i++){
			ScoreDB.findOneAndUpdate(
				{ classID: classID, traineeID: traineesVar[i].traineeID },
				{ $set: {
					scores1: scores1[i], scores2: scores2[i], scores3: scores3[i],
						scores4: scores4[i], scores5: scores5[i],
				}},
				{ useFindAndModify: false },
				function(err, match) {
					if(err){
						console.log(err);
						res.send({status: 500})
					}
					else{
						res.send({status: 200});
					}
				})
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

						let date = formatDate(sched.date);
						let timeStart = formatTime(sched.timeStart);
						let timeEnd = formatTime(sched.timeEnd);

						// SEND EMAIL to applicant (interview schedule)
						var smtpTransport = nodemailer.createTransport({
							service: 'Gmail',
							auth: {
								user: 'training.tvh@gmail.com',
								pass: 'tvhtraining'
							}
						});

						// content
						var mailOptions = {
							from: 'training.tvh@gmail.com',
							to: sched.applicant.email,
							subject: '[APPLICATION] Initial Interview Schedule',
							html: `<div style="box-sizing: border-box; background: #6dc63f; width: 500px; margin: auto; padding: 20px;">`
									+`<div style="background-color: #ebf5ee; padding: 80px;">`
										+`<div style="text-align: center;">`
											+`<img style="height: 124px; align-items: center;"src="cid:signature"/> <!-- change to path in our app ehe -->`
										+`</div>`
										+`<section style="text-align: justify; margin-bottom: 40px;">`
											+`<p> Greetings, ${sched.applicant.fName}! You have been selected as one of the few to enter the second phase of our application. </p>`
											+`<br><br>`
											+`<p> Here is your interview schedule:</p>`
											+`<p> Date: ${date}, 2021 </p>`
											+`<p> Time: ${timeStart} to ${timeEnd} </p>`
										+`</section>`
									+`</div>`
									+`<footer style="font-size: 10px; color: #ebf5ee; text-align:center; margin-top: 5px;">Copyright © 2021 TVH System</footer>`
								    +`</div>`,
							attachments: [{
									filename: 'tvh-logo-square.png',
									path: __dirname+'/tvh-logo-square.png',
									cid: 'signature'
							}]
						};

						smtpTransport.sendMail(mailOptions, function(error) {
							if (error){
								res.send({status: 500});
								console.log(error);
							}
							else{
								res.status(200).send(sched);
							} 

							smtpTransport.close();
						});
						// res.status(200).send(sched);
					}
				}
			}
			
		} catch(e){
			console.log(e);
			res.send(e);
		}
	},
	
	postApplicStatuses: async function(req, res) {
		try {    
			if(req.session.user.userType === "HRinterv"){
				let {applicIDs, stats} = req.body;
				
				console.log("applicIDs: "+ applicIDs);
				console.log("stats: "+ stats);
				
				// search for Interview phase of HR interviewer
				let intervs = await InterviewDB.find({}, '').populate("interviewer applicant");
				let filterIntervs = intervs.filter(elem => elem.interviewer.userID === req.session.user.userID);
				
				let phase;
				for(i=0; i<filterIntervs.length;i++){
					if(filterIntervs[i].interviewer.userID === req.session.user.userID){
						phase = filterIntervs[i].phase;
					}
				}
				
				if (phase === "Initial")
					for(i=0; i<applicIDs.length; i++){
						let applicant = await db.updateOne(ApplicantDB, {applicantID: applicIDs[i]}, {initialStatus: stats[i]});
						let findApplic = await db.findOne(ApplicantDB, {applicantID: applicIDs[i]}, "");  
					
						// SEND EMAIL to applicant [initial phase] interview results
						if (stats[i] === "PASS"){
							var smtpTransport = nodemailer.createTransport({
								service: 'Gmail',
								auth: {
									user: 'training.tvh@gmail.com',
									pass: 'tvhtraining'
								}
							});

							// content
							var mailOptions = {
								from: 'training.tvh@gmail.com',
								to: findApplic.email, 
								subject: '[APPLICATION] Initial Interview Result',
								html: `<div style="box-sizing: border-box; background: #6dc63f; width: 500px; margin: auto; padding: 20px;">`
								+`<div style="background-color: #ebf5ee; padding: 80px;">`
									+`<div style="text-align: center;">`
										+`<img style="height: 124px; align-items: center;"src="cid:signature"/> <!-- change to path in our app ehe -->`
									+`</div>`
									+`<section style="text-align: justify; margin-bottom: 40px;">`
										+`<p> Greetings, ${findApplic.fName}! Based on your initial interview, we are glad to inform you that you have passed and will be proceeding to the next phase. </p>`
										+`<br><br>`
										+`<p> We wish you the best of luck.</p>`
									+`</section>`
								+`</div>`
								+`<footer style="font-size: 10px; color: #ebf5ee; text-align:center; margin-top: 5px;">Copyright © 2021 TVH System</footer>`
								+`</div>`,
								attachments: [{
									filename: 'tvh-logo-square.png',
									path: __dirname+'/tvh-logo-square.png',
									cid: 'signature'
								}]
							};

							smtpTransport.sendMail(mailOptions, function(error) {
								if (error){
									res.send({status: 500});
									console.log(error);
								}
								else{
									res.status(200).send(filterIntervs);
								} 

								smtpTransport.close();
							});
						}
							
						else if (stats[i] === "FAIL"){
							var smtpTransport = nodemailer.createTransport({
								service: 'Gmail',
								auth: {
									user: 'training.tvh@gmail.com',
									pass: 'tvhtraining'
								}
							});

							// content
							var mailOptions = {
								from: 'training.tvh@gmail.com',
								to: findApplic.email, 
								subject: '[APPLICATION] Initial Interview Result',
								html: `<div style="box-sizing: border-box; background: #6dc63f; width: 500px; margin: auto; padding: 20px;">`
								+`<div style="background-color: #ebf5ee; padding: 80px;">`
									+`<div style="text-align: center;">`
										+`<img style="height: 124px; align-items: center;"src="cid:signature"/> <!-- change to path in our app ehe -->`
									+`</div>`
									+`<section style="text-align: justify; margin-bottom: 40px;">`
										+`<p> Greetings, ${findApplic.fName}! Based on your initial interview, we regret to inform you that we will not be moving forward with your application. </p>`
										+`<br><br>`
										+`<p> We thank you for your effort and we wish you the best of luck in your future endeavors.</p>`
									+`</section>`
								+`</div>`
								+`<footer style="font-size: 10px; color: #ebf5ee; text-align:center; margin-top: 5px;">Copyright © 2021 TVH System</footer>`
								+`</div>`,
								attachments: [{
									filename: 'tvh-logo-square.png',
									path: __dirname+'/tvh-logo-square.png',
									cid: 'signature'
								}]
							};

							smtpTransport.sendMail(mailOptions, function(error) {
								if (error){
									res.send({status: 500});
									console.log(error);
								}
								else{
									res.status(200).send(filterIntervs);
								} 

								smtpTransport.close();
							});
						}
	
						
					}
				
				if (phase === "Final")
					for(i=0; i<applicIDs.length; i++){
						let applicant = await db.updateOne(ApplicantDB, {applicantID: applicIDs[i]}, {finalStatus: stats[i]});
						
						// SEND EMAIL to applicant [final phase] interview results
						if (stats[i] === "PASS"){
							var smtpTransport = nodemailer.createTransport({
								service: 'Gmail',
								auth: {
									user: 'training.tvh@gmail.com',
									pass: 'tvhtraining'
								}
							});

							// content
							var mailOptions = {
								from: 'training.tvh@gmail.com',
								to: findApplic.email, 
								subject: '[APPLICATION] Final Interview Result',
								html: `<div style="box-sizing: border-box; background: #6dc63f; width: 500px; margin: auto; padding: 20px;">`
								+`<div style="background-color: #ebf5ee; padding: 80px;">`
									+`<div style="text-align: center;">`
										+`<img style="height: 124px; align-items: center;"src="cid:signature"/> <!-- change to path in our app ehe -->`
									+`</div>`
									+`<section style="text-align: justify; margin-bottom: 40px;">`
										+`<p> Greetings, ${findApplic.fName}! Based on your last interview, we are glad to inform you that you have passed and will be proceeding to the training phase. </p>`
										+`<br><br>`
										+`<p> Please wait for our next email for your class schedule. </p>`
									+`</section>`
								+`</div>`
								+`<footer style="font-size: 10px; color: #ebf5ee; text-align:center; margin-top: 5px;">Copyright © 2021 TVH System</footer>`
								+`</div>`,
								attachments: [{
									filename: 'tvh-logo-square.png',
									path: __dirname+'/tvh-logo-square.png',
									cid: 'signature'
								}]
							};

							smtpTransport.sendMail(mailOptions, function(error) {
								if (error){
									res.send({status: 500});
									console.log(error);
								}
								else{
									res.status(200).send(filterIntervs);
								} 

								smtpTransport.close();
							});
						}
							
						else if (stats[i] === "FAIL"){
							var smtpTransport = nodemailer.createTransport({
								service: 'Gmail',
								auth: {
									user: 'training.tvh@gmail.com',
									pass: 'tvhtraining'
								}
							});

							// content
							var mailOptions = {
								from: 'training.tvh@gmail.com',
								to: findApplic.email, 
								subject: '[APPLICATION] Final Interview Result',
								html: `<div style="box-sizing: border-box; background: #6dc63f; width: 500px; margin: auto; padding: 20px;">`
								+`<div style="background-color: #ebf5ee; padding: 80px;">`
									+`<div style="text-align: center;">`
										+`<img style="height: 124px; align-items: center;"src="cid:signature"/> <!-- change to path in our app ehe -->`
									+`</div>`
									+`<section style="text-align: justify; margin-bottom: 40px;">`
										+`<p> Greetings, ${findApplic.fName}! Based on your initial interview, we regret to inform you that we will not be moving forward with your application. </p>`
										+`<br><br>`
										+`<p> We thank you for your effort and we wish you the best of luck in your future endeavors.</p>`
									+`</section>`
								+`</div>`
								+`<footer style="font-size: 10px; color: #ebf5ee; text-align:center; margin-top: 5px;">Copyright © 2021 TVH System</footer>`
								+`</div>`,
								attachments: [{
									filename: 'tvh-logo-square.png',
									path: __dirname+'/tvh-logo-square.png',
									cid: 'signature'
								}]
							};

							smtpTransport.sendMail(mailOptions, function(error) {
								if (error){
									res.send({status: 500});
									console.log(error);
								}
								else{
									res.status(200).send(filterIntervs);
								} 

								smtpTransport.close();
							});
						}
					}

				// res.status(200).send(filterIntervs);
			}	
		} catch(e){
			console.log(e);
			res.send(e);
		}
	},

	postOneStatus: async function(req, res) {
		try {    
			if(req.session.user.userType === "HRinterv"){
				let {appID, intervPhase} = req.body;
				let applicant;
				
				console.log("in postOneStatus() appID: "+ appID);
				console.log("in postOneStatus() intervPhase: "+ intervPhase);
				
				if(intervPhase === "Initial")
					applicant = await db.updateOne(ApplicantDB, {applicantID: appID}, {initialStatus: "FOR REVIEW"}); 
				
				if(intervPhase === "Final")
					applicant = await db.updateOne(ApplicantDB, {applicantID: appID}, {finalStatus: "FOR REVIEW"});
				
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
