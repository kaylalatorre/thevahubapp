const express = require('express');
const router = express();
// const middleware = require('../middleware/tvhMiddleware');
const controller = require('../controller/tvhController');

// get
router.get('/login', controller.getLogin);
router.get('/', controller.getHome);
router.get('/application', controller.getAppForm);
router.get('/form-submitted', controller.getSubmitted);
	// hr admin
router.get('/hr-schedule', controller.getHRSched);
router.get('/hr-screening', controller.getHRScreening);
// post


module.exports = router;