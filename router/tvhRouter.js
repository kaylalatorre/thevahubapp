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
//router.get('/sort-sysreqs', controller.sortSysReqs);
router.get('/rend-applicant', controller.getApplicInfo);

router.get('/get-intervapplic', controller.getIntervApplic);
router.get('/get-interviews', controller.getInterviews);
router.get('/get-filterIntervs', controller.getFilterIntervs);

router.get('/application-reports', controller.getHRReports);
router.get('/applic-filterReports', controller.getHRFilterReports);


// interviewer
router.get('/int-applicants', controller.getApplicList);
router.get('/int-schedule', controller.getIntSchedule);
router.get('/get-HRinterviews', controller.getHRInterviews);
//router.get('/get-applicPDF', controller.getApplicPDF);
//router.get('/view-resume', controller.getPDF);
router.get('/download-resume', controller.getResumeDL);
router.get('/get-filterIntervList', controller.getIntervFiltered);

	// trainee
router.get('/trainee-profile', controller.getTraineeProf);
router.get('/trainee-classes', controller.getTraineeClasses);
router.get('/te-class-details/:classID', controller.getTEClassDet);
router.get('/deactivate', controller.getDeactivate);
router.get('/certificate/:userID', controller.getCertificate);

	// trainer
router.get('/trainer-classes', controller.getTrainerClasses);
router.get('/tr-class-details/:classID', controller.getTRClassDetails);
router.get('/get-schedule', controller.getSchedule);
router.get('/trainer-schedule', controller.getTRSchedule);
router.get('/manage-trainees/:classID', controller.getTraineeList);
router.get('/trainer-reports', controller.getTrainingReports);
router.get('/filteredtr-reports', controller.getFTRReports);

router.get('/update-scoresheet/1/:classID', controller.getScoresheet1);
router.get('/update-scoresheet/2/:classID', controller.getScoresheet2);
router.get('/update-scoresheet/3/:classID', controller.getScoresheet3);
router.get('/update-scoresheet/4/:classID', controller.getScoresheet4);
router.get('/update-scoresheet/5/:classID', controller.getScoresheet5);
router.get('/update-scoresheet/6/:classID', controller.getScoresheet6);
router.get('/update-scoresheet/7/:classID', controller.getScoresheet7);
router.get('/update-scoresheet/8/:classID', controller.getScoresheet8);


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

//interviewer
router.post('/update-applicStats', controller.postApplicStatuses);
router.post('/post-applicStat', controller.postOneStatus);


	//trainees
router.post('/deactivate', controller.postDeactivate);

	//trainers
router.post('/create-class', controller.postCreateClass);
router.post('/edit-class', controller.postEditClass);
router.post('/delete-class', controller.postDeleteClass);

router.post('/save-scores1', controller.postSaveScores1);
// router.post('/save-scores2', controller.postSaveScores2);
// router.post('/save-scores3', controller.postSaveScores3);
// router.post('/save-scores4', controller.postSaveScores4);
// router.post('/save-scores5', controller.postSaveScores5);
// router.post('/save-scores6', controller.postSaveScores6);
// router.post('/save-scores7', controller.postSaveScores7);
// router.post('/save-scores8', controller.postSaveScores8);




module.exports = router;
