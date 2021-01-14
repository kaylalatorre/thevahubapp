// Get the modal
let modals = document.getElementsByClassName('modal');
let modalBtns = document.getElementsByClassName('myBtn');
let closeBtns = document.getElementsByClassName('close');

for(let modalBtn of modalBtns) {
    modalBtn.onclick = function(event) {
        document.querySelector(event.target.getAttribute('href') ).style.display = 'block';
    }
}

for(let closeBtn of closeBtns) {
    closeBtn.onclick = function(event) {
        event.target.parentNode.parentNode.parentNode.style.display = 'none';
    }
}

window.onclick = function(event) {
    if(event.target.classList.contains('modal') ) {
        for(let modal of modals) {
            if(typeof modal.style !== 'undefined') {
                modal.style.display = 'none';    
            }
        }
    }
}

/*
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


*/