const express = require('express');
const router = express();
// const middleware = require('../middleware/tvhMiddleware');
const controller = require('../controller/tvhController');

/* GET */
router.get('/login', controller.getLogin);
router.get('/', controller.getHome);
router.get('/application', controller.getAppForm);
router.get('/form-submitted', controller.getSubmitted);
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

	// trainer
router.get('/trainer-classes', controller.getTrainerClasses);
router.get('/trainer-schedule', controller.getTRSchedule);
router.get('/trainer-class-details', controller.getTRClassDet);
router.get('/update-scoresheet', controller.getScoresheet);
router.get('/manage-trainees', controller.getTraineeList);

/* POST */


module.exports = router;