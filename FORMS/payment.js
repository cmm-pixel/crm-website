// =============================
// Element references
// =============================
const towerSelect = document.getElementById("tower");
const wingSelect = document.getElementById("wing");
const modeSelect = document.getElementById("mode");
const paymentMethodSelect = document.getElementById("paymentMethod");

// =============================
// Tower → Wing Mapping
// =============================
const wingsByTower = {
  TAPI: ["A Wing"],
  AMAZON: ["A Wing", "B Wing"],
  DANUBE: ["A Wing", "B Wing", "C Wing", "D Wing"]
};

// Tower → Wing logic
towerSelect.addEventListener("change", function () {
  wingSelect.innerHTML = '<option value="">Select</option>';
  wingSelect.disabled = true;

  if (this.value && wingsByTower[this.value]) {
    wingsByTower[this.value].forEach(wing => {
      const option = document.createElement("option");
      option.value = wing;
      option.textContent = wing;
      wingSelect.appendChild(option);
    });
    wingSelect.disabled = false;
  }
});

// =============================
// Mode → Payment Method logic
// =============================
modeSelect.addEventListener("change", function () {
  if (this.value === "FLAT_COST" || this.value === "GST") {
    paymentMethodSelect.disabled = false;
  } else {
    paymentMethodSelect.disabled = true;
    paymentMethodSelect.value = "";
  }
});

// =============================
// Payment Form → Google Sheet
// =============================
document.getElementById("paymentForm").addEventListener("submit", function (e) {
  e.preventDefault();

  if (!this.checkValidity()) {
    alert("Please fill all mandatory fields.");
    return;
  }

  const formData = new FormData(this);
  formData.append("sheet", "Payment_Record"); // EXACT sheet name

  // ✅ OFFICE-ID WEB APP URL (FINAL)
  fetch("https://script.google.com/macros/s/AKfycbxtlqg1g6RIlnzEtuBQa3fnnQVb-1ne2Ofu9ymnDr2r5OWbBaL4tXZ_-RsNh4Mnyaji/exec", {
    method: "POST",
    body: formData
  })
    .then(res => res.text())
    .then(() => {
      alert("Payment record saved successfully");
      this.reset();
      wingSelect.disabled = true;
      paymentMethodSelect.disabled = true;
    })
    .catch(() => {
      alert("Network error. Please check internet connection.");
    });
});
