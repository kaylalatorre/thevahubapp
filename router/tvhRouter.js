const express = require('express');
const router = express();
// const middleware = require('../middleware/tvhMiddleware');
const controller = require('../controller/tvhController');

/* GET */
router.get('/login', controller.getLogin);
router.get('/', controller.getHome);
router.get('/application', controller.getAppForm);
router.get('/form-submitted', controller.getFormSubmitted);
router.get('/error', controller.getError);

	// hr admin
router.get('/hr-schedule', controller.getHRSched);
router.get('/hr-screening', controller.getHRScreening);

	// interviewer
router.get('/int-applicants', controller.getIntApplicants);
router.get('/int-schedule', controller.getIntSchedule);

	// trainee
router.get('/trainee-profile', controller.getTraineeProf);
router.get('/trainee-classes', controller.getTraineeClasses);
router.get('/trainee-class-details', controller.getTEClassDet);
router.get('/deactivate', controller.getDeactivate);
router.get('/certificate', controller.getCertificate);

	// trainer
router.get('/trainer-classes', controller.getTrainerClasses);
router.get('/trainer-schedule', controller.getTRSchedule);
router.get('/trainer-class-details', controller.getTRClassDet);
router.get('/update-scoresheet', controller.getScoresheet);
router.get('/manage-trainees', controller.getTraineeList);
router.get('/trainer-reports', controller.getSummaryReport);

/* POST */

// *for testing
router.get('/test', controller.getTest);

// post routes
router.post('/logout', controller.postLogout);
router.post('/login', controller.postLogin);
router.post('/register', controller.postRegister);
router.post('/submit-applic', controller.postApplication);
router.post('/login-test', controller.postLogin);

	//trainees
router.post('/deactivate', controller.postDeactivate);

module.exports = router;
