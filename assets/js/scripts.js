// global variables
var skillCount = 1;
var certCount = 1;

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

function getApplicInfo(applicID){
	console.log("in AJAX: " + applicID);
	
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

$(document).ready(function() {	
	
	let calendar;	
	let currDate = new Date();
	var calendarEl = document.getElementById('calendar');
	if(calendarEl !== null){
		calendar = new FullCalendar.Calendar(calendarEl, {
		  initialView: 'dayGridMonth',
		  initialDate: currDate, //set to Current date
		  headerToolbar: {
			left: 'prev,next today',
			center: 'title',
			right: 'dayGridMonth,timeGridWeek,timeGridDay'
		  }
		  // events: data
		});  

		calendar.render();			
	}
	
	console.log(window.location.href);
	if(window.location.pathname === "/hr-schedule"){
		console.log("in AJAX get interv()");
		$.ajax({
			method: 'GET',
			url: '/get-interviews',
			data: {},
			success: function(res) {
				
				for (let i=0; i<res.length; i++){
					// render for main Calendar 
					var parseDate = new Date(res[i].timeStart);
					calendar.addEvent({
						title: res[i].applicant.fName + " " + res[i].applicant.lName,
						start: parseDate,
						allDay: false
					});
					
					// render for sidebar filter
					$('div#INTapplic-filter').empty();
					$('div#INTinterv-filter').empty();		
					$('div#FINapplic-filter').empty();
					$('div#FINinterv-filter').empty();
					
					var applicHTML = '<div class="sched-list">'
										+ '<input class="form-check-input applicantName" type="checkbox">'
										+ '<label class="form-check-label" for="applicantName" style="font-size: 14px;">' + res[i].applicant.fName + " " + res[i].applicant.lName + '</label>'
									+ '</div>';
					var intervHTML = '<div class="sched-list">'
										+ '<input class="form-check-input interviewerName" type="checkbox">'
										+ '<label class="form-check-label" for="interviewerName" style="font-size: 14px;">' + res[i].interviewer.fName + " " + res[i].interviewer.lName + '</label>'
									+ '</div>';
							
					if(res[i].phase === "Initial"){
						$('div#INTapplic-filter').append(applicHTML);
						$('div#INTinterv-filter').append(intervHTML);							
					} else {
						$('div#FINapplic-filter').append(applicHTML);
						$('div#FINinterv-filter').append(intervHTML);							
					}				
				}

			},
			error: res => console.log(res)
		});
	}

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
					var intervHTML = '<option class="appoption dropdown-item" value=' + res.intervs[i].userID +'>' + res.intervs[i].fName +" "+ res.intervs[i].lName + '</option>'
					$('select#interv-dropdown').append(intervHTML);
				}
				
				// render applicant names in dropdown
				for(let i=0; i<res.applics.length; i++){
					var applicHTML = '<option class="appoption dropdown-item" value=' + res.applics[i].applicantID +'>' + res.applics[i].fName +" "+ res.applics[i].lName + '</option>'
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
				
				var parseDate = new Date(res.timeStart);
				calendar.addEvent({
					title: res.applicant.fName + " " + res.applicant.lName,
					start: parseDate,
					allDay: false
				});
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
