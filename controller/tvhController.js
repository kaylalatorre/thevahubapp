// dbs


// main functions
const rendFunctions = {
	getLogin: function(req, res, next) {
	// if (req.session.user){
	// 	res.redirect('/');
	// } else {
		res.render('login', {
		});
	// }
	},

	// put condition kung anong usER then render '<user>-home'
	getHome: function(req, res, next) {
	// if (req.session.user){
	// 	res.redirect('/');
	// } else {
		res.render('hr-home', {
		});
	// }
	},

	getAppForm: function(req, res, next) {
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

	getHRSched: function(req, res, next) {
	// if (req.session.user){
	// 	res.redirect('/');
	// } else {
		res.render('hr-schedule', {
		});
	// }
	},

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
		res.render('deactivate', {
		});
	},

	getError: function(req, res, next) {
		res.render('error', {
		});
	},

}

module.exports = rendFunctions;