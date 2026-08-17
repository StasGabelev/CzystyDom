(function () {
  var toggle = document.querySelector("[data-nav-toggle]");
  var nav = document.querySelector("[data-main-nav]");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });
    nav.addEventListener("click", function (event) {
      if (event.target.tagName === "A") {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  var form = document.querySelector("[data-contact-form]");
  if (form) {
    var status = form.querySelector("[data-form-status]");
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      if (form.querySelector('[name="company_website"]').value) {
        return;
      }

      var submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;

      var data = Object.fromEntries(new FormData(form).entries());

      fetch(form.action, {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json", Accept: "application/json" },
      })
        .then(function (res) {
          if (!res.ok) throw new Error("Request failed");
          form.reset();
          showStatus(form.dataset.success, false);
        })
        .catch(function () {
          showStatus(form.dataset.error, true);
        })
        .finally(function () {
          submitBtn.disabled = false;
        });
    });
  }

  function showStatus(message, isError) {
    if (!status) return;
    status.textContent = message;
    status.hidden = false;
    status.style.color = isError ? "#b3261e" : "#0f5c56";
  }
})();
