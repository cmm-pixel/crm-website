document.addEventListener("DOMContentLoaded", function () {

  // =============================
  // Tower → Wing Mapping
  // =============================
  const form = document.getElementById("visitForm");
  const towerSelect = document.getElementById("tower");
  const wingSelect = document.getElementById("wing");

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
      alert("Please fill all mandatory fields.");
      return;
    }

    // Force-enable disabled fields
    form.querySelectorAll(":disabled").forEach(el => el.disabled = false);

    const formData = new FormData(form);

    // Debug proof
    console.log("FORM DATA ↓");
    for (const pair of formData.entries()) {
      console.log(pair[0], "=", pair[1]);
    }

    formData.append("sheet", "Client_Visit");

    // ✅ NEW OFFICE-ID WEB APP URL
    fetch("https://script.google.com/macros/s/AKfycbxtlqg1g6RIlnzEtuBQa3fnnQVb-1ne2Ofu9ymnDr2r5OWbBaL4tXZ_-RsNh4Mnyaji/exec", {
      method: "POST",
      body: formData
    })
      .then(res => res.text())
      .then(res => {
        alert(res);
        form.reset();
        wingSelect.disabled = true;
      })
      .catch(err => {
        alert("Network error");
        console.error(err);
      });
  });

});
