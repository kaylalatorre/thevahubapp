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
	
});
