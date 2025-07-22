$(document).ready(function (e) {
    const checkbox = document.getElementById("formCompleteCheckbox");
    const nextBtn = document.getElementById("nextBtn");

    checkbox.checked = false; 
    checkbox.addEventListener("change", function() {
        if (checkbox.checked) {
            nextBtn.classList.remove("disabled");
            nextBtn.style.pointerEvents = "auto";
            //nextBtn.style.opacity = "1";
        } else {
            nextBtn.classList.add("disabled");
            nextBtn.style.pointerEvents = "none"; // disable clicking
            //nextBtn.style.opacity = "0.5"; // make it look inactive
        }
    })

});
