// global variables
var skillCount = 1;
var certCount = 1;

/* FRONTEND Specific Functions */
// collapsible
var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {

  coll[i].addEventListener("click", function() {
    checks[i].style.display = "none";
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.maxHeight){
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
    } 
  });
}

// hr-screening active row
function changeTab1Class(elClass) {
  var tab1Length = document.getElementsByClassName("tab1row").length;

  for (var i = 0; i < tab1Length; i++) { 
    document.getElementsByClassName("tab1row")[i].className = "tab1row tabInactive"; 
  } 
  elClass.className = "tab1row tabActive";   
}

function changeTab2Class(elClass) {
  var tab2Length = document.getElementsByClassName("tab2row").length;

  for (var i = 0; i < tab2Length; i++) { 
    document.getElementsByClassName("tab2row")[i].className = "tab2row tabInactive"; 
  } 
  elClass.className = "tab2row tabActive";   
}

function changeTab3Class(elClass) {
  var tab3Length = document.getElementsByClassName("tab3row").length;

  for (var i = 0; i < tab3Length; i++) { 
    document.getElementsByClassName("tab3row")[i].className = "tab3row tabInactive"; 
  } 

  elClass.className = "tab3row tabActive";   
}

// hr-screening update buttons
function updateButtons(tabpane) {
  var tab = tabpane.id;

  if (tab === "acceptedTab" || tab === "rejectedTab") {
	$("#acceptApplcnt").hide();
	$("#rejectApplcnt").hide();
	$("#removeApplcnt").show();

  } else { // for Pending tab
	$("#acceptApplcnt").show();
	$("#rejectApplcnt").show();
	$("#removeApplcnt").hide();
  }
}

// for deployment valist page
function switchTabContent(tabpane) {
	var tab = tabpane.id;

	if(tab === "waitlistTab") {
		$('#waitList').show();
		$('#hiredList').hide();
	}
	else if(tab === "hiredTab"){
		$('#waitList').hide();
		$('#hiredList').show();
	}
}


/* BACKEND Specific Functions */

// onclick AJAX for HR-screening main tab render
function getApplicInfo(applicID){	
	$.ajax({
		method: 'GET',
		url: '/rend-applicant',
		data: {applicantID: applicID},
        success: function(res) {
            console.log(res);
            
			$("input#hide-applicID").val(applicID);
			$("label#applic-name").text(res.applic.fName + " " + res.applic.lName);
			
            for (let i=0; i<res.applic.sys_reqs.length; i++)
                $("input#formCheck-" + (i+1)).prop("checked", res.applic.sys_reqs[i]);
            
            $("object#resume").prop("data", "data:application/pdf;base64," + res.encoded);
            
			$('#tab-6').empty();
			$('#tab-7').empty();
			
            for (let i=0; i<res.applic.skills.length; i++){
                var skillHTML = '<label style="font-weight: bold; margin-bottom: 20px;">' + res.applic.skills[i].title + '</label>'
                                + '<p>' + res.applic.skills[i].level + '</p>';
                $('#tab-6').append(skillHTML);
            }
            
            for (let i=0; i<res.applic.certifications.length; i++){
                var certHTML = '<label  style="font-weight: bold;">' + res.applic.certifications[i].title + ' (' + res.applic.certifications[i].year + ')</label>'
                                + '<p style="margin-bottom: 20px;">' + res.applic.certifications[i].certFrom + '</p>';
                $('#tab-7').append(certHTML);
            }            
        },
		error: res => console.log(res)
	});
}

// onclick AJAX for INT-applicants download resume
function downloadFile(applicID){ 
	
	let applicName = $('#applicName-row').text();
	
	$.ajax({
		method: 'GET',
		url: '/download-resume',
		cache: false,
		data: {applicID},
        success: function(res) {
			
			let byteCharacters = atob(res); 
			
			const byteNumbers = new Array(byteCharacters.length);
			for (let i = 0; i < byteCharacters.length; i++) {
				byteNumbers[i] = byteCharacters.charCodeAt(i);
			}
			
			const byteArray = new Uint8Array(byteNumbers);

			// Convert the Byte Data to BLOB object
			var blob = new Blob([byteArray], { type: "application/pdf" });

			console.log("blob: " + blob);
			console.log("[byteArray]: " + [byteArray]);

			// Download the pdf file
			var url = window.URL || window.webkitURL;
			link = url.createObjectURL(blob);
			var a = $("<a />");
			a.attr("download", "resume-" + applicID + ".pdf");
			a.attr("href", link);
			$("body").append(a);
			a[0].click();
			$("body").remove(a);

		},
		error: res => console.log(res)
	});
}

$(document).ready(function() {	
	
	let calendar;	
	let currDate = new Date();
	var calendarEl = document.getElementById('calendar');

	if(calendarEl !== null){
		calendar = new FullCalendar.Calendar(calendarEl, {
			initialView: 'dayGridMonth',
			initialDate: currDate, //set to Current date
			dayMaxEventRows: 3,
			// dayMaxEvent: 3,
			headerToolbar: {
			  left: 'prev,next today',
			  center: 'title',
			  right: 'dayGridMonth,timeGridWeek,timeGridDay'
			},

			// events: data	
			eventClick: function(info) {
				
				$('#modal-applicID').val(info.event.extendedProps.applicID);
				$('#modal-intervPhase').val(info.event.extendedProps.intervPhase);	
				
				$('#modal-applicName').html(info.event.title);
				$('#modal-schedule').html(info.event.start);
				$('#modal-meetLink').html(info.event.extendedProps.meetLink);
				$('#intervModal').modal();
				$('.modal-backdrop').remove(); //removes overlaying modal-backdrop
				
				//test for pdf viewer
				$('#modal-resume').val(info.event.extendedProps.applicID);
				console.log("in eventClick(): "+ info.event.extendedProps.applicID);
			}
		});  

		calendar.render();	
	}
	
	// for HR-schedule render
	if(window.location.pathname === "/hr-schedule"){
		let applicArrINT = [];
		let intervArrINT = [];
		let applicArrFIN = [];
		let intervArrFIN = [];
		
		$.ajax({
			method: 'GET',
			url: '/get-interviews',
			data: {},
			success: function(res) {
				
				$('div#INTapplic-filter').empty();
				$('div#INTinterv-filter').empty();		
				$('div#FINapplic-filter').empty();
				$('div#FINinterv-filter').empty();

				for (let i=0; i<res.length; i++){
					// render for main Calendar 
					var parseDate = new Date(res[i].timeStart);
					calendar.addEvent({
						title: res[i].applicant.fName + " " + res[i].applicant.lName,
						start: parseDate,
						allDay: false
					});
					
					// render for sidebar filter
					var applicHTML = '<div class="sched-list">'
//									    + '<input type="hidden" value='+ res[i].applicant.applicantID +'>'
										+ '<input class="form-check-input applicantName check-filter HRcheckbox" type="checkbox" value='+ res[i].intervID +'>'
										+ '<label class="form-check-label" for="applicantName" style="font-size: 14px;">' + res[i].applicant.fName + " " + res[i].applicant.lName + '</label>'
									+ '</div>';
					var intervHTML = '<div class="sched-list">'
//									    + '<input type="hidden" value='+ res[i].interviewer.userID +'>'
										+ '<input class="form-check-input interviewerName check-filter HRcheckbox" type="checkbox" value='+ res[i].intervID +'>'
										+ '<label class="form-check-label" for="interviewerName" style="font-size: 14px;">' + res[i].interviewer.fName + " " + res[i].interviewer.lName + '</label>'
									+ '</div>';
							
					if(res[i].phase === "Initial"){ // for INITIAL tab
						if(!applicArrINT.includes(res[i].applicant.applicantID)){
							$('div#INTapplic-filter').append(applicHTML);
							applicArrINT.push(res[i].applicant.applicantID);
						}
						
						if(!intervArrINT.includes(res[i].interviewer.userID)){
							$('div#INTinterv-filter').append(intervHTML);
							intervArrINT.push(res[i].interviewer.userID);
						}
	
					} else {
						if(!applicArrFIN.includes(res[i].applicant.applicantID)){
							$('div#FINapplic-filter').append(applicHTML);
							applicArrFIN.push(res[i].applicant.applicantID);
						}
						
						if(!intervArrFIN.includes(res[i].interviewer.userID)){
							$('div#FINinterv-filter').append(intervHTML);
							intervArrFIN.push(res[i].interviewer.userID);
						}						
					}				
				}

			},
			error: res => console.log(res)
		});
	}
	
	// int-applicants for disable/able input radio buttons in Status
	if(window.location.pathname === "/int-applicants") { 
		
		let applicPhase = $('input#applicPhase').val();
		console.log("applicPhase: "+ "/"+applicPhase+"/");
		
		// get Array of applicant IDs
		let arrIDs = [];
		$(".hidden-appID").each(function(index, elem) {
			arrIDs.push($(elem).val());
		});
		
		let arrInits = []; 
		$(".hidden-initStat").each(function(index, elem) {
			arrInits.push($(elem).val());
		});
		
		let arrFinals = []; 
		$(".hidden-finalStat").each(function(index, elem) {
			arrFinals.push($(elem).val());
		});
		
		$("tr.row-applic input").prop('disabled', true); // disabling radio buttons		
				
		for(let i=0; i<arrIDs.length; i++){
			// pre-checking radio buttons
			if (applicPhase === "Initial")
				if (arrInits[i] === "PASS")
					$("tr.row-applic input[name='applic-"+ arrIDs[i] +"']:first").attr('checked', true);
				else if (arrInits[i] === "FAIL")
					$("tr.row-applic input[name='applic-"+ arrIDs[i] +"'][value='FAIL']").attr('checked', true);
			
			if (applicPhase === "Final")
				if (arrFinals[i] === "PASS")
					$("tr.row-applic input[name='applic-"+ arrIDs[i] +"']:first").attr('checked', true);
				else if (arrFinals[i] === "FAIL")
					$("tr.row-applic input[name='applic-"+ arrIDs[i] +"'][value='FAIL']").attr('checked', true);	
				
			// enabling radio buttons
			if (arrInits[i] === "FOR REVIEW" || arrFinals[i] === "FOR REVIEW")
				$("tr.row-applic input[name='applic-"+ arrIDs[i] +"']").prop('disabled', false);
				console.log($("tr.row-applic input[name='applic-"+ arrIDs[i] +"']").val());
		}
	}
	
	// int-schedule Interviewed button
	$("button#btn-Interviewed").on("click", function() {
		let rowAppID = $('#modal-applicID').val();	
		let intPhase = $('#modal-intervPhase').val();
		
		// to do FRONTEND: update Color of this event in Calendar
		
		$.ajax({
			method: 'POST',
			url: '/post-applicStat',
			data: {appID: rowAppID, intervPhase: intPhase},
			success: function(res) {
				let applicName = $('#modal-applicName').text();
				alert("Please update Interview status of Applicant " + applicName);
			},
			error: res => console.log(res)
		});
	});
	
	

/* SEMI-FUNCTION 
	// for HR-interviewer sidebar filter
	$('.check-filter').on("click", function() {
		alert("in check-filter function()");
		if($(this).prop('checked')){
			alert("in check-filter function()");
			let filterID = $(this).val(); //get value of the checkbox input --> intervID
			console.log(filterID);
			$.ajax({
				method: 'GET',
				url: '/get-filterIntervs',
				data: filterID,
				success: function(res) {
					//empty the Calendar
					
					// render Calendar grids
					for (let i=0; i<res.length; i++){
						var parseDate = new Date(res[i].timeStart);
						calendar.addEvent({
							title: res[i].applicant.fName + " " + res[i].applicant.lName,
							start: parseDate,
							allDay: false
						});
					}
				},
				error: res => console.log(res)
			});
		}
	});
*/

	// for HR-interviewer download Resume button (in detailed modal Schedule)
	$('#modal-resumeBtn').on("click", function(){
		let applicID = $('#modal-resume').val();
		let applicName = $('#modal-applicName').text();
		
		$.ajax({
			method: 'GET',
			url: '/download-resume',
			cache: false,
			data: {applicID},
			success: function(res) {

				let byteCharacters = atob(res); 

				const byteNumbers = new Array(byteCharacters.length);
				for (let i = 0; i < byteCharacters.length; i++) {
					byteNumbers[i] = byteCharacters.charCodeAt(i);
				}

				const byteArray = new Uint8Array(byteNumbers);

				// Convert the Byte Data to BLOB object
				var blob = new Blob([byteArray], { type: "application/pdf" });

				console.log("blob: " + blob);
				console.log("[byteArray]: " + [byteArray]);

				// Download the pdf file
				var url = window.URL || window.webkitURL;
				link = url.createObjectURL(blob);
				var a = $("<a />");
				a.attr("download", "resume-" + applicID + ".pdf");
//				a.attr("download", "resume-" + applicID + "_" + applicName + ".pdf");
				a.attr("href", link);
				$("body").append(a);
				a[0].click();
				$("body").remove(a);
			},
			error: res => console.log(res)
		});
	});



	// for HR-interviewer Calendar render
	if(window.location.pathname === "/int-schedule"){
		$.ajax({
			method: 'GET',
			url: '/get-HRinterviews',
			data: {},
			success: function(res) {
				// render for main Calendar
				for (let i=0; i<res.length; i++){
					var parseDate = new Date(res[i].timeStart);
					calendar.addEvent({
						title: res[i].applicant.fName + " " + res[i].applicant.lName,
						start: parseDate,
						allDay: false,
						extendedProps: {
						  resume: 'yes', //pass encode from backend OR url to pdf viewer 
						  meetLink: res[i].meetingLink,
						  applicID: res[i].applicant.applicantID,
						  intervPhase: res[i].phase
						},
						description: 'Interview Details'
					});
				}
			},
			error: res => console.log(res)
		});
	}	
	
	$("button#save-statBtn").on("click", function() {
		
		// get Array of applicant IDs
		let arrIDs = [];
		$(".hidden-appID").each(function(index, elem) {
			console.log(".hidden-appID: " + $(elem).val());
			arrIDs.push($(elem).val());
		});

		// get Array of corresponding statuses (PASS/FAIL)
		let arrStats = [];	
		$("input:radio.applic-stat:checked").each(function(index, elem) {
			console.log("input:radio.applic-stat:checked: " + $(elem).val());
			arrStats.push($(elem).val());
		});
		
		console.log("TRACK: in save-statBtn.click: arrIDs.length: "+ arrIDs.length);
		
		$.ajax({
			method: 'POST',
			url: '/update-applicStats',
			data: {applicIDs: arrIDs, stats: arrStats}, //send both Arrays for posting
			success: function(res) {
				alert("Interview status saved.");
				 
				// disable or change the radio btn preset acc to the Applic status in the db
				$("tr.row-applic input").prop('disabled', true);	
				
				let applicPhase = $('input#applicPhase').val();
				for(let i=0; i<res.length; i++){
					// pre-checking radio buttons again after updating
					if (applicPhase === "Initial")
						if (res[i].applicant.initialStatus === "PASS")
							$("tr.row-applic input[name='applic-"+ res[i].applicant.applicantID +"']:first").attr('checked', true);
						else if (res[i].applicant.initialStatus === "FAIL")
							$("tr.row-applic input[name='applic-"+ res[i].applicant.applicantID +"'][value='FAIL']").attr('checked', true);

					if (applicPhase === "Final")
						if (res[i].applicant.finalStatus === "PASS")
							$("tr.row-applic input[name='applic-"+ res[i].applicant.applicantID +"']:first").attr('checked', true);
						else if (res[i].applicant.finalStatus === "FAIL")
							$("tr.row-applic input[name='applic-"+ res[i].applicant.applicantID +"'][value='FAIL']").attr('checked', true);
						
					// enabling radio buttons
					if (res[i].applicant.initialStatus === "FOR REVIEW" || res[i].applicant.finalStatus === "FOR REVIEW")
						$("tr.row-applic input[name='applic-"+ res[i].applicant.applicantID +"']").prop('disabled', false);
					
					window.location.reload(true);
				}
			},
			error: res => console.log(res)
		});
		
	});
	$("button#create-schedBtn").on("click", function() {
		$.ajax({
			method: 'GET',
			url: '/get-intervapplic',
			data: {},
			success: function(res) {
				console.log(res);
				
				$('select#interv-dropdown').empty();
				$('select#applic-dropdown').empty();
				
				// render interviewer names in dropdown
				for(let i=0; i<res.intervs.length; i++){
					var intervHTML = '<option class="appoption dropdown-item" value=' + res.intervs[i].userID +'>' + res.intervs[i].fName +" "+ res.intervs[i].lName + '</option>';
					$('select#interv-dropdown').append(intervHTML);
				}
				
				// render applicant names in dropdown
				for(let i=0; i<res.applics.length; i++){
					var applicHTML = '<option class="appoption dropdown-item" value=' + res.applics[i].applicantID +'>' + res.applics[i].fName +" "+ res.applics[i].lName + '</option>';
					$('select#applic-dropdown').append(applicHTML);
				}				
					
			},
			error: res => console.log(res)
		});				
	});
	
	$("button#createSched").on("click", function() {
		
		let intPhase = $("input[name='int-phase']:checked").val();
		let schDate = $('input#sched-date').val();
		let tStart = $('input#time-start').val();
		let tEnd = $('input#time-end').val();
		console.log(tStart);
		console.log(tEnd);
		
		let intervid = $("select#interv-dropdown").children("option:selected").val();
		console.log("intervID: "+ intervid);
		let applicid = $("select#applic-dropdown").children("option:selected").val();
		console.log("applicID: "+ applicid);
		
		let meetLink = $('input#meeting-link').val();
		
		$.ajax({
			method: 'POST',
			url: '/create-intsched',
			data: {intervPhase: intPhase,
					schedDate: schDate,
					timeStart: tStart,
					timeEnd: tEnd,
					intervID: intervid,
					applicID: applicid,
					meetingLink: meetLink
				},
			success: function(res) {
					console.log("res.status: "+ res.status);
				if(res.status !== 400){
					var parseDate = new Date(res.timeStart);
					calendar.addEvent({
						title: res.applicant.fName + " " + res.applicant.lName,
						start: parseDate,
						allDay: false
					});
					alert("Schedule created!");
				} else {
					alert(res.mssg);
				}
			},
			error: res => console.log(res)
		});		

	});


	$("#removeApplcnt").hide();
	
	$('button#acceptApplcnt').on("click", function() {
		let applicID = $("input#hide-applicID").val();
		
		$.ajax({
			method: 'POST',
			url: '/accept-applicant',
			data: {applicantID: applicID},
			success: window.location.reload(true),
			error: res => console.log(res)
		});
	});

	$('button#rejectApplcnt').on("click", function() {
		let applicID = $("input#hide-applicID").val();
		
		$.ajax({
			method: 'POST',
			url: '/reject-applicant',
			data: {applicantID: applicID},
			success: window.location.reload(true),
			error: res => console.log(res)
		});
	});
	
	$('button#removeApplcnt').on("click", function() {
		let applicID = $("input#hide-applicID").val();
		
		console.log("in remove applicant///");
		$.ajax({
			method: 'POST',
			url: '/remove-applicant',
			data: {applicantID: applicID},
			success: window.location.reload(true),
			error: res => console.log(res)
		});
	});	
	

	$('button#addSkill').on("click", function() {	
		skillCount++;
		var skillHTML = '<p> <input style="width: 100%;" placeholder="Skill" id="skillTitle" class="skillTitle" name="skillTitle'+ skillCount +'"> </p>'
						+ '<p>' + '<select style="width: 100%;" class="appdrop skillLevel" for="level" id="skillLevel" name="skillLevel'+ skillCount +'">'
									+ '<option value="" disabled selected>Level</option>'    
									+ '<option class="appoption dropdown-item" href="#">Professional</option>'
									+ '<option class="appoption dropdown-item" href="#">Intermediate</option>'
									+ '<option class="appoption dropdown-item" href="#">Beginner</option>'
							+ '</select>' + '</p>';
		$('#skillContainer').append(skillHTML);
		
	});	
	
	$('div button#addCert').on("click", function() {	
		certCount++;
		var certHTML = '<p><input style="width: 100%;" placeholder="Certificate or Award Title" class="certName" name="certName'+ certCount +'"></p>'
					 + '<p><input style="width: 100%;" placeholder="Certified From" class="certFrom" name="certFrom'+ certCount +'"></p>'
					 + '<p><input style="width: 100%;" placeholder="Year" class="certYear" name="certYear'+ certCount +'"></p>';
		$('#certContainer').append(certHTML);
	});

  // Log-in client-side validation
  // LOG-IN VALIDATION
  $('button#login-btn').click(function() {
    var email = validator.trim($('#email').val());
    var password = validator.trim($('#password').val());
    
    var emailEmpty = validator.isEmpty(email);
    var passEmpty = validator.isEmpty(password);
    var emailFormat = validator.isEmail(email);
    
    // resets input form when log-in button is clicked
    $('p#emailError').text('');
    $('p#pwError').text('');
    
    if (emailEmpty){
      $('p#emailError').text('Please enter your email.');
    }
    else if (!emailFormat){
      $('p#emailError').text('Invalid email format.');
    }
    
    if (passEmpty){
      $('p#pwError').text('Please enter your password.');
    }
    
    // successful client-side validation: no empty fields and valid email
    if (!emailEmpty && emailFormat && !passEmpty){
      $.post('/login', {email: email, password: password}, function(res) {
        switch (res.status){
          case 200: {
            window.location.href = '/';
            break;
          }
          case 401: {
            $('p#pwError').text('Incorrect Email and/or Password.');
            break;                
          }
          case 500: {
            $('p#pwError').text('Server Error.');
            break;
          }
          case 410: {
            $('p#pwError').text('Account inactive.');
            break;
          }
        }
      });
    }
  });

  // View certificate
  $('button#viewCert').click(function() {
    // get data 
    window.location.href='/certificate';
  });

});
