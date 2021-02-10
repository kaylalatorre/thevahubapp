function calculateHours(startTime, endTime) {
	hours = endTime.split(':')[0] - startTime.split(':')[0],
    minutes = endTime.split(':')[1] - startTime.split(':')[1];

    minutes = minutes.toString().length<2?'0'+minutes:minutes;
    
    if(minutes<0) { 
        hours--;
        minutes = 60 + minutes;
    }

    hours = hours.toString().length<2?'0'+hours:hours;

    return hours + (minutes*100);
}

$(document).ready(function() {

	var calendarEl = document.getElementById('tr-calendar');
	var today = new Date();

	if(calendarEl !== null){
		var calendar = new FullCalendar.Calendar(calendarEl, {
		initialView: 'dayGridMonth',
		initialDate: today, //set to Current date
		headerToolbar: {
			left: 'prev,next today',
			center: 'title',
			right: 'dayGridMonth,timeGridWeek,timeGridDay'
		},

		});
	
		calendar.render();
	}

	// RENDER TRAINER SCHEDULE
	if(window.location.pathname === "/trainer-schedule"){
		var trClassesSched = [];

		$.ajax({
			method: 'GET',
			url: '/get-schedule',
			data: {},
			success: function(res){

				$('div#TRSched').empty();

				// loop through classes to get dates and add to calendar
				for (var i = 0; i < res.length; i++){
					var start = new Date(res[i].startDate);
					var end = new Date(res[i].endDate);

					calendar.addEvent({
						title: res[i].courseName + " " + res[i].classID,
						start: start,
						end: end,
						allDay: true,
					});

					// add classes to sidetab
					var classHTML = '<div class="sched-list">'
									// + '<input class="form-check-input" type="checkbox">'
									+ '<label class="form-check-label" for="formCheck-1" style="font-size: 14px;">' + res[i].classID + '</label>'
									+ '</div>';

					$('div#TRSched').append(classHTML);
						trClassesSched.push(res[i].classID);
				}

			},
			error: res => console.log(res)
		});
	}

	// ADD CLASSES TO TRAINER LIST
	$('button#createClass').click(function() {
        var courseName = $('#courseName').val();
        var dateToday = new Date();
		var startDate = new Date($('#startDate').val());
		var endDate = new Date($('#endDate').val());
		var startTime = $('#startTime').val();
		var endTime = $('#endTime').val();
        var meetLink = $('#meetLink').val();
        var classPhoto = $('#classPhoto').val();

		// just to check to see if data is received
		console.log(courseName, dateToday, startDate, endDate, startTime, endTime, meetLink);

        // values for error-checking
        var numDays = Math.round(endDate- startDate) / (1000 * 60 * 60 * 24) + 1;
		var numHours = (calculateHours(startTime, endTime) * 0.1);

		console.log(numDays, numHours);

		var dateErrors = true,
            timeErrors = true;
            
            // check if date fields are empty
		if ((startDate == "Invalid Date") || (endDate == "Invalid Date") || (!startDate || !endDate)) {
			if (startDate == "Invalid Date" || !startDate) alert('Set date.');
		
			if (endDate =="Invalid Date" || !startDate) alert('Set date.');
		}
			/* check if classes meet the criteria of eight (8) days and if selected start and end
				dates are not earlier than today */
		else if (startDate && endDate) {
			if ((numDays != 8) || (startDate < dateToday) || (startDate > endDate)) {
				if (numDays != 8) alert('Classes should last for eight (8) days.');

				if (startDate < dateToday) alert('Date should not be earlier than today.');

				if (startDate > endDate) alert('Start Date should be earlier than End Date.'); 
			}
			else dateErrors = false;
		}
		else dateErrors = false;
		
			// check if time fields are empty
		if (!startTime || !endTime) {
			if (!startTime) alert('Set time.');
			if (!endTime) alert('Set time.');
		}
			/* check if submitted timeslot meets the criteria of six (6) hours a day and if selected
				end time is not earlier than start time */
		else if (startTime && endTime) {
			if ((numHours != 6) || (startTime > endTime)) {
				if (numHours != 6) alert('Classes should last for 6 hours a day.');

				if (startTime > endTime) alert('Start Time should be earlier than End Time.');
			}
			else timeErrors = false;
		}
		else timeErrors = false;

		// if no errors, submit to backend
		if (!dateErrors && !timeErrors) {
			console.log("no errors");
			$.post('/create-class', {courseName: courseName, startDate: startDate, endDate: endDate,
				startTime: startTime, endTime: endTime, meetLink: meetLink, classPhoto: classPhoto}, function(res) {
				switch (res.status){
					case 200: {
						alert("Class added successfully.");
						window.location.href = '/trainer-classes';
                        break;
					}
					case 500: {
						alert(res.mssg);
						break;
					}
				}
			});
		}

	});

	$('#updateClass').click(function() {
		var classID = $('#classID').text();
		var courseName = $('#courseName').val();
        var dateToday = new Date();
		var startDate = new Date($('#startDate').val());
		var endDate = new Date($('#endDate').val());
		var startTime = $('#startTime').val();
		var endTime = $('#endTime').val();
        var meetLink = $('#meetLink').val();
        // var classPhoto = $('#classPhoto').val();

		// just to check to see if data is received
		console.log(courseName, dateToday, startDate, endDate, startTime, endTime, meetLink);

        // values for error-checking
        var numDays = Math.round(endDate- startDate) / (1000 * 60 * 60 * 24) + 1;
		var numHours = (calculateHours(startTime, endTime) * 0.1);

		console.log(numDays, numHours);

		var dateErrors = true,
            timeErrors = true;
            
            // check if date fields are empty
		if ((startDate == "Invalid Date") || (endDate == "Invalid Date") || (!startDate || !endDate)) {
			if (startDate == "Invalid Date" || !startDate) alert('Set date.');
		
			if (endDate =="Invalid Date" || !startDate) alert('Set date.');
		}
			/* check if classes meet the criteria of eight (8) days and if selected start and end
				dates are not earlier than today */
		else if (startDate && endDate) {
			if ((numDays != 8) || (startDate < dateToday) || (startDate > endDate)) {
				if (numDays != 8) alert('Classes should last for eight (8) days.');

				if (startDate < dateToday) alert('Date should not be earlier than today.');

				if (startDate > endDate) alert('Start Date should be earlier than End Date.'); 
			}
			else dateErrors = false;
		}
		else dateErrors = false;
		
			// check if time fields are empty
		if (!startTime || !endTime) {
			if (!startTime) alert('Set time.');
			if (!endTime) alert('Set time.');
		}
			/* check if submitted timeslot meets the criteria of six (6) hours a day and if selected
				end time is not earlier than start time */
		else if (startTime && endTime) {
			if ((numHours != 6) || (startTime > endTime)) {
				if (numHours != 6) alert('Classes should last for 6 hours a day.');

				if (startTime > endTime) alert('Start Time should be earlier than End Time.');
			}
			else timeErrors = false;
		}
		else timeErrors = false;

		// if no errors, submit to backend
		if (!dateErrors && !timeErrors) {
			console.log("no errors");
			$.post('/edit-class', { classID: classID, courseName: courseName, startDate: startDate, endDate: endDate,
				startTime: startTime, endTime: endTime, meetLink: meetLink }, function(res) {
				switch (res.status){
					case 200: {
						alert("Class updated successfully.");
						window.location.href = '/trainer-classes';
                        break;
					}
					case 500: {
						alert(res.mssg);
						break;
					}
				}
			});
		}

	}); 

	$('#deleteClass').click(function() {
		var classID = $('#classID').text();
		// alert(classID);

		$.post('/delete-class', { classID: classID }, function(res) {
			switch (res.status){
				case 200: {
					alert("Class deleted successfully.");
					window.location.href = '/trainer-classes';
					break;
				}
				case 500: {
					alert(res.mssg);
					break;
				}
			}
		});
	}); 

	// Hide scores and "Edit" button
	$('#theScores').click(function() {
		var theScore = document.getElementsByClassName('theScore');
		var editScore = document.getElementsByClassName('editScore');
		// var saveBTN = document.getElementById('saveScores');
		// var today = new Date();
		// var endDate = $('#endhide').text()
		// var compareDate = new Date(endDate);

		// console.log(endDate);
		// if(compareDate < today) {
		// 	alert("This class ended in " + getDate(compareDate) + ". You cannot edit the scores for this class anymore.");
		// }
		// else {
			// hide text, show editor
			for(var i = 0; i < theScore.length; i++) 
				theScore[i].style.display = 'none';
			
			for(var i = 0; i < editScore.length; i++) 
				editScore[i].style.display = 'inline';
			
			// editScore.style.display = 'inline';
		// }
	});

	$('#saveScores1').click(function() {
		var classID = $('#classID').text();
		var S1 = document.getElementsByClassName('S1');
		var S2 = document.getElementsByClassName('S2');
		var S3 = document.getElementsByClassName('S3');
		var S4 = document.getElementsByClassName('S4');
		var S5 = document.getElementsByClassName('S5');

		var scores1 = [];
		var scores2 = [];
		var scores3 = [];
		var scores4 = [];
		var scores5 = [];

		for(var i = 0; i < S1.length; i++){
			scores1.push(S1[i].value);
			scores2.push(S2[i].value);
			scores3.push(S3[i].value);
			scores4.push(S4[i].value);
			scores5.push(S5[i].value);
		}

		$.post('/save-scores1', { classID: classID, scores1: scores1, scores2: scores2, scores3: scores3,
									scores4: scores4, scores5: scores5  }, function(res) {
			switch (res.status){
				case 200: {
					window.location.reload();
					alert("Scores updated successfully.");
					break;
				}
				case 500: {
					alert("Error in updating scores.");
					break;
				}
			}
		});
	}); 
	
	$('#saveScores2').click(function() {
		var classID = $('#classID').text();
		var S1 = document.getElementsByClassName('S1');
		var S2 = document.getElementsByClassName('S2');
		var S3 = document.getElementsByClassName('S3');
		var S4 = document.getElementsByClassName('S4');
		var S5 = document.getElementsByClassName('S5');

		var scores1 = [];
		var scores2 = [];
		var scores3 = [];
		var scores4 = [];
		var scores5 = [];

		for(var i = 0; i < S1.length; i++){
			scores1.push(S1[i].value);
			scores2.push(S2[i].value);
			scores3.push(S3[i].value);
			scores4.push(S4[i].value);
			scores5.push(S5[i].value);
		}

		$.post('/save-scores2', { classID: classID, scores1: scores1, scores2: scores2, scores3: scores3,
									scores4: scores4, scores5: scores5  }, function(res) {
			switch (res.status){
				case 200: {
					window.location.reload();
					alert("Scores updated successfully.");
					break;
				}
				case 500: {
					alert("Error in updating scores.");
					break;
				}
			}
		});
	}); 

	$('#saveScores3').click(function() {
		var classID = $('#classID').text();
		var S1 = document.getElementsByClassName('S1');
		var S2 = document.getElementsByClassName('S2');
		var S3 = document.getElementsByClassName('S3');
		var S4 = document.getElementsByClassName('S4');
		var S5 = document.getElementsByClassName('S5');

		var scores1 = [];
		var scores2 = [];
		var scores3 = [];
		var scores4 = [];
		var scores5 = [];

		for(var i = 0; i < S1.length; i++){
			scores1.push(S1[i].value);
			scores2.push(S2[i].value);
			scores3.push(S3[i].value);
			scores4.push(S4[i].value);
			scores5.push(S5[i].value);
		}

		$.post('/save-scores3', { classID: classID, scores1: scores1, scores2: scores2, scores3: scores3,
									scores4: scores4, scores5: scores5  }, function(res) {
			switch (res.status){
				case 200: {
					window.location.reload();
					alert("Scores updated successfully.");
					break;
				}
				case 500: {
					alert("Error in updating scores.");
					break;
				}
			}
		});
	}); 

	$('#saveScores4').click(function() {
		var classID = $('#classID').text();
		var S1 = document.getElementsByClassName('S1');
		var S2 = document.getElementsByClassName('S2');
		var S3 = document.getElementsByClassName('S3');
		var S4 = document.getElementsByClassName('S4');
		var S5 = document.getElementsByClassName('S5');

		var scores1 = [];
		var scores2 = [];
		var scores3 = [];
		var scores4 = [];
		var scores5 = [];

		for(var i = 0; i < S1.length; i++){
			scores1.push(S1[i].value);
			scores2.push(S2[i].value);
			scores3.push(S3[i].value);
			scores4.push(S4[i].value);
			scores5.push(S5[i].value);
		}

		$.post('/save-scores4', { classID: classID, scores1: scores1, scores2: scores2, scores3: scores3,
									scores4: scores4, scores5: scores5  }, function(res) {
			switch (res.status){
				case 200: {
					window.location.reload();
					alert("Scores updated successfully.");
					break;
				}
				case 500: {
					alert("Error in updating scores.");
					break;
				}
			}
		});
	}); 
	
	$('#saveScores5').click(function() {
		var classID = $('#classID').text();
		var S1 = document.getElementsByClassName('S1');
		var S2 = document.getElementsByClassName('S2');
		var S3 = document.getElementsByClassName('S3');
		var S4 = document.getElementsByClassName('S4');
		var S5 = document.getElementsByClassName('S5');

		var scores1 = [];
		var scores2 = [];
		var scores3 = [];
		var scores4 = [];
		var scores5 = [];

		for(var i = 0; i < S1.length; i++){
			scores1.push(S1[i].value);
			scores2.push(S2[i].value);
			scores3.push(S3[i].value);
			scores4.push(S4[i].value);
			scores5.push(S5[i].value);
		}

		$.post('/save-scores5', { classID: classID, scores1: scores1, scores2: scores2, scores3: scores3,
									scores4: scores4, scores5: scores5  }, function(res) {
			switch (res.status){
				case 200: {
					window.location.reload();
					alert("Scores updated successfully.");
					break;
				}
				case 500: {
					alert("Error in updating scores.");
					break;
				}
			}
		});
	}); 

	$('#saveScores6').click(function() {
		var classID = $('#classID').text();
		var S1 = document.getElementsByClassName('S1');
		var S2 = document.getElementsByClassName('S2');
		var S3 = document.getElementsByClassName('S3');
		var S4 = document.getElementsByClassName('S4');
		var S5 = document.getElementsByClassName('S5');

		var scores1 = [];
		var scores2 = [];
		var scores3 = [];
		var scores4 = [];
		var scores5 = [];

		for(var i = 0; i < S1.length; i++){
			scores1.push(S1[i].value);
			scores2.push(S2[i].value);
			scores3.push(S3[i].value);
			scores4.push(S4[i].value);
			scores5.push(S5[i].value);
		}

		$.post('/save-scores6', { classID: classID, scores1: scores1, scores2: scores2, scores3: scores3,
									scores4: scores4, scores5: scores5  }, function(res) {
			switch (res.status){
				case 200: {
					window.location.reload();
					alert("Scores updated successfully.");
					break;
				}
				case 500: {
					alert("Error in updating scores.");
					break;
				}
			}
		});
	}); 

	$('#saveScores7').click(function() {
		var classID = $('#classID').text();
		var S1 = document.getElementsByClassName('S1');
		var S2 = document.getElementsByClassName('S2');
		var S3 = document.getElementsByClassName('S3');
		var S4 = document.getElementsByClassName('S4');
		var S5 = document.getElementsByClassName('S5');

		var scores1 = [];
		var scores2 = [];
		var scores3 = [];
		var scores4 = [];
		var scores5 = [];

		for(var i = 0; i < S1.length; i++){
			scores1.push(S1[i].value);
			scores2.push(S2[i].value);
			scores3.push(S3[i].value);
			scores4.push(S4[i].value);
			scores5.push(S5[i].value);
		}

		$.post('/save-scores7', { classID: classID, scores1: scores1, scores2: scores2, scores3: scores3,
									scores4: scores4, scores5: scores5  }, function(res) {
			switch (res.status){
				case 200: {
					window.location.reload();
					alert("Scores updated successfully.");
					break;
				}
				case 500: {
					alert("Error in updating scores.");
					break;
				}
			}
		});
	}); 
	
	$('#saveScores8').click(function() {
		var classID = $('#classID').text();
		var S1 = document.getElementsByClassName('S1');
		var S2 = document.getElementsByClassName('S2');
		var S3 = document.getElementsByClassName('S3');
		var S4 = document.getElementsByClassName('S4');
		var S5 = document.getElementsByClassName('S5');

		var scores1 = [];
		var scores2 = [];
		var scores3 = [];
		var scores4 = [];
		var scores5 = [];

		for(var i = 0; i < S1.length; i++){
			scores1.push(S1[i].value);
			scores2.push(S2[i].value);
			scores3.push(S3[i].value);
			scores4.push(S4[i].value);
			scores5.push(S5[i].value);
		}

		$.post('/save-scores8', { classID: classID, scores1: scores1, scores2: scores2, scores3: scores3,
									scores4: scores4, scores5: scores5  }, function(res) {
			switch (res.status){
				case 200: {
					window.location.reload();
					alert("Scores updated successfully.");
					break;
				}
				case 500: {
					alert("Error in updating scores.");
					break;
				}
			}
		});
	}); 

	// APPLY FILTERS for Trainer Report
	$('button#applyTRFilter').click(function() {
		var courseFilter = $('#statusFilter option:selected').text();
		var statusFilter = $('#clStatus option:selected').text();

        var dateToday = new Date();
		var sDateFilter = $('input#sDateFilter').val();
		var eDateFilter = $('input#eDateFilter').val();

		$.ajax({
			method: 'GET',
			url: '/filteredtr-greports',
			data: {courseFilter: courseFilter, sDateFilter: sDateFilter, eDateFilter: eDateFilter},
			success: function(res) {
				$('#label-date').text("Period Covered: " + dateStart + " to " + dateEnd);
				$('#classTable').empty();
				console.log(res);
				// console.log("Updated reports");				
			},
			error: res => console.log(res)
		});
	});

});