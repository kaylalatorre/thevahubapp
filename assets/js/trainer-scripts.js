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

	$('#editClass').click(function() {
		var classID = $('#classID').val();
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
			$.post('/edit-class', { classID: classID, courseName: courseName, startDate: startDate, endDate: endDate,
				startTime: startTime, endTime: endTime, meetLink: meetLink, classPhoto: classPhoto}, function(res) {
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

	$('#saveScores').click(function() {
		var classID = $('#classID').text();
		var trName = document.getElementsByClassName('trName');

		$.post('/save-scores', { classID: classID }, function(res) {
			switch (res.status){
				case 200: {
					alert("Scores updated successfully.");
					window.location.href = '/update-scoresheet/classID';
					break;
				}
				case 500: {
					alert(res.mssg);
					break;
				}
			}
		});
	}); 	

});