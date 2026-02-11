// =============================
// Tower → Wing Mapping
// =============================
const towerSelect = document.getElementById("tower");
const wingSelect = document.getElementById("wing");
const form = document.getElementById("callForm");
const submitBtn = form.querySelector("button");

const wingsByTower = {
  TAPI: ["A Wing"],
  AMAZON: ["A Wing", "B Wing"],
  DANUBE: ["A Wing", "B Wing", "C Wing", "D Wing"]
};

towerSelect.addEventListener("change", function () {
  wingSelect.innerHTML = '<option value="">Select</option>';
  wingSelect.disabled = true;

  const selectedTower = this.value;

  if (selectedTower && wingsByTower[selectedTower]) {
    wingsByTower[selectedTower].forEach(wing => {
      const option = document.createElement("option");
      option.value = wing;
      option.textContent = wing;
      wingSelect.appendChild(option);
    });

    wingSelect.disabled = false;
  }
});


// =============================
// Form Submit
// =============================
form.addEventListener("submit", function (e) {
  e.preventDefault();

  // Browser validation
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const formData = new FormData(form);

  // Ensure optional fields send blank values
  formData.set("visitDate", formData.get("visitDate") || "");
  formData.set("visitTime", formData.get("visitTime") || "");

  formData.append("sheet", "Call_Log");

  // Disable button while submitting
  submitBtn.disabled = true;
  submitBtn.textContent = "Saving...";

  fetch("https://script.google.com/macros/s/AKfycbxtlqg1g6RIlnzEtuBQa3fnnQVb-1ne2Ofu9ymnDr2r5OWbBaL4tXZ_-RsNh4Mnyaji/exec", {
    method: "POST",
    body: formData
  })
  .then(response => response.text())
  .then(data => {

    console.log("Server Response:", data);

    // 🔴 SAME DAY DUPLICATE CASE
    if (data === "SAME_DAY_DUPLICATE") {
      alert("⚠ This Booking ID already has an entry today.");
      document.getElementById("bookingId").focus();
      return;
    }

    // 🟢 SUCCESS CASE
    if (data === "SUCCESS") {
      alert("Call log saved successfully");
      form.reset();
      wingSelect.disabled = true;
      return;
    }

    // 🟡 Backend error
    if (data.startsWith("ERROR")) {
      alert("Server Error: " + data);
      return;
    }

    // 🟠 Unexpected response
    alert("Unexpected server response: " + data);

  })
  .catch(error => {
    console.error("Network Error:", error);
    alert("Failed to save. Please check internet connection.");
  })
  .finally(() => {
    submitBtn.disabled = false;
    submitBtn.textContent = "Save Call Log";
  });
});
