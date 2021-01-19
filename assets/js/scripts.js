// global variables
var skillCount = 1;
var certCount = 1;

// calendar
document.addEventListener('DOMContentLoaded', function() {
  var calendarEl = document.getElementById('calendar');
  var calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    initialDate: '2020-12-07',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    // events: data
  });  

  calendar.render();
});

// collapsible
var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.maxHeight){
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
    } 
  });
}

function getApplicInfo(applicID){
	console.log("in AJAX: " + applicID);
	
	$.ajax({
		method: 'GET',
		url: '/rend-applicant',
		data: {applicantID: applicID},
        success: function(res) {
            console.log(res);
            
			$("label#applic-name").text(res.applic.fName + " " + res.applic.lName);
			
            for (let i=0; i<res.applic.sys_reqs.length; i++)
                $("input#formCheck-" + (i+1)).prop("checked", res.applic.sys_reqs[i]);
            
            $("object#resume").prop("data", "data:application/pdf;base64," + res.encoded);
            
			$('#tab-6 p').empty();
			$('#tab-7 p').empty();
			
            for (let i=0; i<res.applic.skills.length; i++){
                var skillHTML = '<label>' + res.applic.skills[i].title + '</label>'
                                + '<p>' + res.applic.skills[i].level + '</p>';
                $('#tab-6 p').append(skillHTML);
            }
            
            for (let i=0; i<res.applic.certifications.length; i++){
                var certHTML = '<label>' + res.applic.certifications[i].title + ' (' + res.applic.certifications[i].year + ')</label>'
                                + '<p>' + res.applic.certifications[i].certFrom + '</p>';
                $('#tab-7 p').append(certHTML);
            }            
        },
		error: res => console.log(res)
	});
}

$(document).ready(function() {	
	
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

  // Deactivate client-side validation
  $('button#deact-btn').click(function() {
    var deactPass = prompt("Please enter your password to deactivate.", "");
    if (deactPass == null || deactPass == "") {
      window.location.href = '/deactivate';
    } else {
      alert("Account deactivated.");
      window.location.href = '/';
    }
  });


  // View certificate
  $('button#viewCert').click(function() {
    // get data 
    window.location.href='/certificate';
  });

});
