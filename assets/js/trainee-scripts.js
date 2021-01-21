$(document).ready(function() {

	// DEACTIVATE ACCOUNT
	$('button#deact-btn').click(function() {
		var deactPass = prompt("Please enter your password to deactivate.", "");
		
		if(deactPass == null || deactPass ==""){
			alert("Must fill in password.")
			window.location.href = '/deactivate';
		}
		else{
			$.post('/deactivate', {password: deactPass}, function(result) {
				switch(result.status) {
					case 200: {
						alert("Account deactivated succesfully.");
						window.location.href = '/login';
						break;
					}
					case 401: {
						alert("Wrong password.");
						break;
					}
					case 500: {
						alert("There has been an error in deactivating your account.");
						break;
					}
				}
			});
		}			
	});

});