// =============================
// Tower → Wing Mapping
// =============================
const towerSelect = document.getElementById("tower");
const wingSelect = document.getElementById("wing");

const wingsByTower = {
  TAPI: ["A Wing"],
  AMAZON: ["A Wing", "B Wing"],
  DANUBE: ["A Wing", "B Wing", "C Wing", "D Wing"]
};

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
// Form submit
// =============================
document.getElementById("callForm").addEventListener("submit", function (e) {
  e.preventDefault();

  if (!this.checkValidity()) {
    alert("Please fill all required fields");
    return;
  }

  const formData = new FormData(this);
  formData.append("sheet", "Call_Log");

  // ✅ UPDATED OFFICE-ID WEB APP URL
  fetch("https://script.google.com/macros/s/AKfycbxtlqg1g6RIlnzEtuBQa3fnnQVb-1ne2Ofu9ymnDr2r5OWbBaL4tXZ_-RsNh4Mnyaji/exec", {
    method: "POST",
    body: formData
  })
    .then(res => res.text())
    .then(text => {
      console.log(text);
      alert("Call log saved successfully");
      this.reset();
      wingSelect.disabled = true;
    })
    .catch(err => {
      console.error(err);
      alert("Network error");
    });
});
