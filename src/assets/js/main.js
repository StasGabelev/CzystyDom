(function () {
  var slides = document.querySelectorAll(".hero-slide");
  var dots = document.querySelectorAll("[data-hero-dots] .hero-dot");
  if (slides.length > 1) {
    var current = 0;
    var timer;

    function goTo(index) {
      slides[current].classList.remove("is-active");
      dots[current] && dots[current].classList.remove("is-active");
      current = index;
      slides[current].classList.add("is-active");
      dots[current] && dots[current].classList.add("is-active");
    }

    function next() {
      goTo((current + 1) % slides.length);
    }

    function restart() {
      clearInterval(timer);
      timer = setInterval(next, 5000);
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        goTo(i);
        restart();
      });
    });

    restart();
  }

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
    status.querySelector("[data-form-status-text]").textContent = message;
    status.querySelector("[data-form-status-icon]").textContent = isError ? "!" : "✓";
    status.dataset.state = isError ? "error" : "success";
    status.hidden = false;
    status.scrollIntoView({ behavior: "smooth", block: "center" });
  }
})();
