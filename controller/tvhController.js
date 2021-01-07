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

}

module.exports = rendFunctions;