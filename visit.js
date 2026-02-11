document.addEventListener("DOMContentLoaded", function () {

  // =============================
  // Tower → Wing Mapping
  // =============================
  const form = document.getElementById("visitForm");
  const towerSelect = document.getElementById("tower");
  const wingSelect = document.getElementById("wing");
  const submitBtn = form.querySelector("button");

  const wingsByTower = {
    TAPI: ["A Wing"],
    AMAZON: ["A Wing", "B Wing"],
    DANUBE: ["A Wing", "B Wing", "C Wing", "D Wing"]
  };

  wingSelect.disabled = true;

  towerSelect.addEventListener("change", function () {
    wingSelect.innerHTML = '<option value="">Select</option>';
    wingSelect.disabled = true;

    if (this.value && wingsByTower[this.value]) {
      wingsByTower[this.value].forEach(wing => {
        wingSelect.add(new Option(wing, wing));
      });
      wingSelect.disabled = false;
    }
  });

  // =============================
  // Form submit
  // =============================
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const formData = new FormData(form);

    formData.append("sheet", "Client_Visit");

    // Disable button while saving
    submitBtn.disabled = true;
    submitBtn.textContent = "Saving...";

    fetch("https://script.google.com/macros/s/AKfycbxtlqg1g6RIlnzEtuBQa3fnnQVb-1ne2Ofu9ymnDr2r5OWbBaL4tXZ_-RsNh4Mnyaji/exec", {
      method: "POST",
      body: formData
    })
    .then(res => res.text())
    .then(response => {

      console.log("Server Response:", response);

      // 🔴 SAME DAY DUPLICATE
      if (response === "SAME_DAY_DUPLICATE") {
        alert("⚠ This Booking ID already has a visit entry today.");
        document.getElementById("bookingId").focus();
        return;
      }

      // 🟢 SUCCESS
      if (response === "SUCCESS") {
        alert("Visit entry saved successfully");
        form.reset();
        wingSelect.disabled = true;
        return;
      }

      // 🟡 Backend error
      if (response.startsWith("ERROR")) {
        alert("Server Error: " + response);
        return;
      }

      // Unexpected response
      alert(response);

    })
    .catch(err => {
      alert("Network error");
      console.error(err);
    })
    .finally(() => {
      submitBtn.disabled = false;
      submitBtn.textContent = "Save Visit";
    });

  });

});
