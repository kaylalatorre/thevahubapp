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
	 getHome: function(req, res, next) {
		// if (req.session.user){
		// 	res.redirect('/');
		// } else {
			res.render('hr-home', {
			});
		// }
	 },
}

module.exports = rendFunctions;