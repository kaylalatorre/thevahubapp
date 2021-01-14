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

//function submitAppForm() {
//	var appForm = $('#appForm').serializeArray();
//	var skillsArr = [];
//	var certsArr = [];
//	
//	$('.skillTitle').each((i, object) => {
//		let lvl = $('.skillLevel')[i]; 
//		skillsArr.push({title: $(object).val(), level: lvl});
//	});
//	
//	$('.certName').each((i, object) => {
//		let cFrom = $('.certFrom')[i];
//		let cYear = $('.certYear')[i];
//		certsArr.push({title: $(object).val(), certFrom: cFrom, year: cYear});
//	});
//	
//	appForm.push({name: "skills", value: JSON.stringify(skillsArr)});
//	appForm.push({name: "certifications", value: JSON.stringify(certsArr)});
//	
//	console.log(appForm);
//
//	$.ajax({
//		method: 'POST',
//		url: '/submit-applic',
//		data: appForm,
//		success: () => window.location.href = '/form-submitted',
//		error: res => console.log(res)
//	});	
//}


$(document).ready(function() {	

	$('button#addSkill').on("click", function() {		
		var skillHTML = '<p> <input style="width: 100%;" placeholder="Skill" id="skillTitle" class="skillTitle"> </p>'
						+ '<p>' + '<select style="width: 100%;" class="appdrop skillLevel" for="level" id="skillLevel">'
									+ '<option value="" disabled selected>Level</option>'    
									+ '<option class="appoption dropdown-item" href="#">Professional</option>'
									+ '<option class="appoption dropdown-item" href="#">Intermediate</option>'
									+ '<option class="appoption dropdown-item" href="#">Beginner</option>'
							+ '</select>' + '</p>';
		$('#skillContainer').append(skillHTML);
	});	
	
	$('div button#addCert').on("click", function() {		
		var certHTML = '<p><input style="width: 100%;" placeholder="Certificate or Award Title" class="certName"></p>'
					 + '<p><input style="width: 100%;" placeholder="Certified From" class="certFrom"></p>'
					 + '<p><input style="width: 100%;" placeholder="Year" class="certYear"></p>';
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
