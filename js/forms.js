
document.addEventListener("DOMContentLoaded", function () {
  const form1 = document.getElementById("fiac-name-form");
  const form2 = document.getElementById("fiac-typed-form");
  const form3 = document.getElementById("fiac-upload-form");

  // --- Step 1 Logic ---
  if (form1) {
    form1.addEventListener("submit", function (e) {
      e.preventDefault();
      const bizName = form1.querySelector('[id="biz-name-input"]').value.trim();
      sessionStorage.setItem("fiacForm", JSON.stringify({ bizName }));
      window.location.href = "fiac-step2.html";
    });
  }

  // --- Step 2 Logic ---
  if (form2) {
    const data = JSON.parse(sessionStorage.getItem("fiacForm")) || {};
    if (data.contactEmail) {
      form2.querySelector('[name="contactEmail"]').value = data.contactEmail;
    }

    form2.addEventListener("submit", function (e) {
      e.preventDefault();
      data.honeAddress = form2.querySelector('[id="homeAddress"]').value.trim();
      sessionStorage.setItem("fiacForm", JSON.stringify(data));
      window.location.href = "fiac-step3.html";
    });
  }

  // --- Step 3 Logic ---
  if (form3) {
    form3.addEventListener("submit", function (e) {
        e.preventDefault();
        alert("Submission successful!");
        sessionStorage.removeItem("fiacForm");
    });
  }
});

// Upload error & progress notifications
