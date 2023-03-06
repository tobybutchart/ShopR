function showModal(id) {
    document.getElementById(id).style.display = "block";
}

function hideModal(id) {
    document.getElementById(id).style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
     if (settings.allowModalBGClick) {
        if (event.target.id == "settings-modal") {
            hideModal(event.target.id);
        }
     }
}
