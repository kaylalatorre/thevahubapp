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
router.get('/rend-applicant', controller.getApplicInfo);

router.get('/get-intervapplic', controller.getIntervApplic);
router.get('/get-interviews', controller.getInterviews);
router.get('/get-filterIntervs', controller.getFilterIntervs);

router.get('/application-reports', controller.getHRReports);

// interviewer
router.get('/int-applicants', controller.getApplicList);
router.get('/int-schedule', controller.getIntSchedule);
router.get('/get-HRinterviews', controller.getHRInterviews);
router.get('/get-applicPDF', controller.getApplicPDF);
router.get('/view-resume', controller.getPDF);

	// trainee
router.get('/trainee-profile', controller.getTraineeProf);
router.get('/trainee-classes', controller.getTraineeClasses);
router.get('/trainee-class-details', controller.getTEClassDet);
router.get('/deactivate', controller.getDeactivate);
router.get('/certificate', controller.getCertificate);

	// trainer
router.get('/trainer-classes', controller.getTrainerClasses);
router.get('/tr-class-details/:classID', controller.getTRClassDetails);
router.get('/trainer-schedule', controller.getTRSchedule);
router.get('/update-scoresheet', controller.getScoresheet);
router.get('/manage-trainees/:classID', controller.getTraineeList);
router.get('/update-scoresheet/:classID', controller.getScoresheet);
router.get('/trainer-reports', controller.getTrainingReports);


	// sales admin screen prototypes 
router.get('/sales-valist', controller.getVAList);
router.get('/sales-clientlist', controller.getClientList);

/* POST */

// *for testing
router.get('/test', controller.getTest);

// post routes
router.post('/logout', controller.postLogout);
router.post('/login', controller.postLogin);
router.post('/register', controller.postRegister);
router.post('/submit-applic', controller.postApplication);
router.post('/login-test', controller.postLogin);

	//hr admin
router.post('/accept-applicant', controller.postAcceptApplic);	
router.post('/reject-applicant', controller.postRejectApplic);	
router.post('/remove-applicant', controller.postRemoveApplic);

router.post('/create-intsched', controller.postIntervSched);	

	//trainees
router.post('/deactivate', controller.postDeactivate);

	//trainers
router.post('/create-class', controller.postCreateClass);
router.post('/edit-class', controller.postEditClass);
router.post('/delete-class', controller.postDeleteClass);



module.exports = router;
