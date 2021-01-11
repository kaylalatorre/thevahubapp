const express = require('express');
const router = express();
// const middleware = require('../middleware/tvhMiddleware');
const controller = require('../controller/tvhController');

// get routes
router.get('/login', controller.getLogin);
router.get('/', controller.getHome);
router.get('/application', controller.getAppForm);
router.get('/form-submitted', controller.getFormSubmitted);
	
    // hr admin
router.get('/hr-schedule', controller.getHRSched);
router.get('/hr-screening', controller.getHRScreening);

// *for testing
router.get('/test', controller.getTest);

// post routes
router.post('/register', controller.postRegister);
router.post('/submit-applic', controller.postApplication);

module.exports = router;