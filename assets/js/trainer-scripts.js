$(document).ready(function() {

	// ADD CLASSES TO TRAINER LIST
	$('button#createClass').click(function() {
        var course = $("#courseName").val();
        var dateToday = new Date();
		var startDate = new Date($('#startDate').val());
		var endDate = new Date($('#endDate').val());
		var startTime = $('#startTime').val();
		var endTime = $('#endTime').val();
        var meetLink = $('#meetLink').val();
        // var coursePhoto = ;

        // values for error-checking
        var numDays = Math.round(endDate- startDate) / (1000 * 60 * 60 * 24) + 1;
		var numHours = calculateHours(startTime, endTime);

		var dateErrors = true,
            timeErrors = true;
            
            // check if date fields are empty
		if ((startDate == "Invalid Date") || (endDate == "Invalid Date") || (!startDate || !endDate)) {
			if (startDate == "Invalid Date" || !startDate) $('p#sDate').text('Set date.');
		
			if (endDate =="Invalid Date" || !startDate) $('p#eDate').text('Set date.');
		}
			/* check if classes meet the criteria of eight (8) days and if selected start and end
				dates are not earlier than today */
		else if (startDate && endDate) {
			if ((numDays != 8) || (startDate < dateToday) || (startDate > endDate)) {
				if (numDays != 8) $('p#eDate').text('Classes should last for eight (8) days.');
				console.log("numDays: " + numDays);
				if (startDate < dateToday) $('p#sDate').text('Date should not be earlier than today.');

				if (startDate > endDate) $('p#sDate').text('Start Date should be earlier than End Date.'); 
			}
			else dateErrors = false;
		}
		else dateErrors = false;
		
			// check if time fields are empty
		if (!startTime || !endTime) {
			if (!startTime) $('p#sTime').text('Set time.');
			if (!endTime) $('p#eTime').text('Set time.');
		}
			/* check if submitted timeslot meets the criteria of six (6) hours a day and if selected
				end time is not earlier than start time */
		else if (startTime && endTime) {
			if ((numHours != 6) || (startTime > endTime)) {
				if (numHours != 6) $('p#eTime').text('Classes should last for 6 hours a day.');

				if (startTime > endTime) $('p#eTime').text('Start Time should be earlier than End Time.');
			}
			else timeErrors = false;
		}
		else timeErrors = false;

		// if no errors, submit to backend
		if (!dateErrors && !timeErrors) {
			$.post('/create-class', {course: course, startDate: startDate, endDate: endDate,
				startTime: startTime, endTime: endTime, meetLink: meetLink}, function(res) {
				switch (res.status){
					case 200: {
						alert(res.mssg);
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

});