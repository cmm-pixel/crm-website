document.addEventListener("DOMContentLoaded", function () {

  const form = document.getElementById("visitForm");
  const submitBtn = form.querySelector("button");

  const bookingInput = document.getElementById("bookingId");
  const searchBtn = document.getElementById("searchBtn");
  const statusText = document.getElementById("bookingStatus");

  const clientNameInput = document.getElementById("clientName");
  const towerSelect = document.getElementById("tower");
  const wingSelect = document.getElementById("wing");
  const unitInput = document.getElementById("unit");

  const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxtlqg1g6RIlnzEtuBQa3fnnQVb-1ne2Ofu9ymnDr2r5OWbBaL4tXZ_-RsNh4Mnyaji/exec";

  // =============================
  // Tower → Wing Mapping
  // =============================
  const wingsByTower = {
    TAPI: ["A Wing"],
    AMAZON: ["A Wing", "B Wing"],
    DANUBE: ["A Wing", "B Wing", "C Wing", "D Wing"]
  };

  function populateWings(towerValue, selectedWing = "") {

    wingSelect.innerHTML = '<option value="">Select</option>';
    wingSelect.disabled = true;

    if (!towerValue || !wingsByTower[towerValue]) return;

    wingsByTower[towerValue].forEach(wing => {
      const option = new Option(wing, wing);
      wingSelect.add(option);
    });

    wingSelect.disabled = false;

    if (selectedWing) {
      wingSelect.value = selectedWing;
    }
  }

  towerSelect.addEventListener("change", function () {
    populateWings(this.value);
  });

  // =============================
  // SEARCH FUNCTION
  // =============================
  function searchBooking() {

    const bookingId = bookingInput.value.trim();
    if (!bookingId) return;

    statusText.textContent = "Searching...";
    statusText.style.color = "#555";

    searchBtn.disabled = true;

    fetch(WEB_APP_URL + "?bookingId=" + encodeURIComponent(bookingId))
      .then(res => res.json())
      .then(data => {

        if (data.error) {

          statusText.textContent = "❌ Booking ID not found";
          statusText.style.color = "red";

          clientNameInput.value = "";
          towerSelect.value = "";
          wingSelect.innerHTML = '<option value="">Select</option>';
          wingSelect.disabled = true;
          unitInput.value = "";
          return;
        }

        clientNameInput.value = data.clientName || "";
        towerSelect.value = (data.tower || "").toUpperCase();

        populateWings(towerSelect.value, data.wing || "");

        unitInput.value = data.unit || "";

        statusText.textContent = "✅ Booking Verified";
        statusText.style.color = "green";
      })
      .catch(err => {
        console.error(err);
        statusText.textContent = "⚠ Server error";
        statusText.style.color = "red";
      })
      .finally(() => {
        searchBtn.disabled = false;
      });
  }

  // ENTER KEY SEARCH
  bookingInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      searchBooking();
    }
  });

  // SEARCH BUTTON
  if (searchBtn) {
    searchBtn.addEventListener("click", searchBooking);
  }

  // =============================
  // FORM SUBMIT
  // =============================
  form.addEventListener("submit", function (e) {

    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const formData = new FormData(form);
    formData.append("sheet", "Client_Visit");

    submitBtn.disabled = true;
    submitBtn.textContent = "Saving...";

    fetch(WEB_APP_URL, {
      method: "POST",
      body: formData
    })
      .then(res => res.text())
      .then(response => {

        console.log("Server Response:", response);

        if (response === "SAME_DAY_DUPLICATE") {
          alert("⚠ This Booking ID already has a visit entry today.");
          bookingInput.focus();
          return;
        }

        if (response === "SUCCESS") {
          alert("Visit entry saved successfully");
          form.reset();
          wingSelect.innerHTML = '<option value="">Select</option>';
          wingSelect.disabled = true;
          statusText.textContent = "";
          return;
        }

        if (response.startsWith("ERROR")) {
          alert("Server Error: " + response);
          return;
        }

        alert(response);
      })
      .catch(err => {
        console.error(err);
        alert("Network error");
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = "Save Visit";
      });

  });

});
