$(document).ready(function() {

	// DEACTIVATE ACCOUNT
	$('button#deact-btn').click(function() {
        let deact = confirm('Deactivate account?');
		
		if(deact == true){
			$.post('/deactivate', function(result) {
				switch(result.status) {
					case 200: {
						window.location.href = '/login';
						alert(result.mssg);
						break;
					}
					case 500: {
						alert(result.mssg);
						break;
					}
				}
			});
		}			
	});

});