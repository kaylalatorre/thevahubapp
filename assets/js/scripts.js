document.addEventListener('DOMContentLoaded', function() {
	var calendarEl = document.getElementById('calendar');
	var calendar = new FullCalendar.Calendar(calendarEl, {
	  initialView: 'dayGridMonth'
	});
	calendar.render();
});

function submitAppForm() {
	var appForm = $('#appForm').serialize();
	var skillsArr = [];
	
	$('.skillTitle').each((i, object) => {
		let lvl = $('.skillLevel')[i]; 
		skillsArr.push({title: object.val(), level: lvl});
	});
	
	appForm.skills = skillsArr;
	console.log(appForm);
	
//	$.ajax({
//		method: 'POST',
//		url: '/submit-applic',
//		data: appForm,
//		success: () => window.location.href = '/form-submitted',
//		error: res => console.log(res)
//	});	
}


$(document).ready(function() {	
	$('button#addSkill').click(function() {		
		var skillHTML = '<p> <input style="width: 100%;" placeholder="Skill" id="skillTitle" class="skillTitle"> </p>'
						+ '<p>' 
							+ '<select style="width: 100%;" class="appdrop skillLevel" for="level" id="skillLevel">'
									+ '<option value="" disabled selected>Level</option>'    
									+ '<option class="appoption dropdown-item" href="#">Professional</option>'
									+ '<option class="appoption dropdown-item" href="#">Intermediate</option>'
									+ '<option class="appoption dropdown-item" href="#">Beginner</option>'
							+ '</select>' + '</p>';
		$('#skillContainer').append(skillHTML);
	});	
});