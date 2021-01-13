// Get the modal
var modal = document.getElementsByClassName("modal");

// Get the button that opens the modal
var btn = document.getElementsByClassName("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close");

console.log(btn.length);
// When the user clicks the button, open the modal 
btn[0].onclick = function() {
  modal[0].style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span[0].onclick = function() {
	var r = confirm("Canges you made will not be saved.");
	if (r == true) 
		modal[0].style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
	if (event.target == modal[0]) {
		var r = confirm("Canges you made will not be saved.");
		if (r == true)
			modal[0].style.display = "none";
	}
}

// When the user clicks the button, open the modal 
btn[1].onclick = function() {
  modal[1].style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span[1].onclick = function() {
	modal[1].style.display = "none";
}





