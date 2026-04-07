(function () {
  var themeToggle = document.getElementById("theme-toggle");
  var metaTheme = document.querySelector('meta[name="theme-color"]');
  var body = document.body;

  function applyTheme(theme) {
    if (theme === "light") {
      body.setAttribute("data-theme", "light");
      if (metaTheme) metaTheme.setAttribute("content", "#dfe8ef");
    } else {
      body.removeAttribute("data-theme");
      if (metaTheme) metaTheme.setAttribute("content", "#171a21");
    }
    if (themeToggle) {
      themeToggle.textContent = theme === "light" ? "Стиль Steam" : "Светлая тема";
    }
  }

  var savedTheme = localStorage.getItem("gonets-theme");
  if (savedTheme === "dark") {
    localStorage.removeItem("gonets-theme");
  }
  applyTheme(savedTheme === "light" ? "light" : "steam");

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var next = body.getAttribute("data-theme") === "light" ? "steam" : "light";
      localStorage.setItem("gonets-theme", next === "light" ? "light" : "steam");
      applyTheme(next);
    });
  }

  var calcForm = document.getElementById("calc-form");
  var calcResult = document.getElementById("calc-result");
  var calcFill = document.getElementById("calc-fill");
  if (calcForm && calcResult) {
    calcForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var formData = new FormData(calcForm);
      var distance = Number(formData.get("distance")) || 1;
      var weight = Number(formData.get("weight")) || 0.5;
      var type = String(formData.get("type") || "walk");
      var urgency = String(formData.get("urgency") || "asap");

      var base = 250;
      var perKm = type === "cargo" ? 70 : type === "car" ? 45 : 25;
      var perKg = type === "cargo" ? 18 : 8;
      var urgencyMultiplier = urgency === "asap" ? 1.2 : 1;
      var typeLabel = type === "cargo" ? "грузовой" : type === "car" ? "авто" : "пеший";
      var eta = type === "cargo" ? "90-140 мин" : type === "car" ? "35-70 мин" : "45-80 мин";

      var price = Math.round((base + distance * perKm + weight * perKg) * urgencyMultiplier);
      calcResult.innerHTML =
        '<p class="calc__label">Предварительный расчет</p>' +
        '<p class="calc__price">от ' + price + " ₽</p>" +
        '<p class="calc__eta">Курьер: ' + typeLabel + ", ETA: " + eta + "</p>" +
        '<ul class="calc__meta"><li>Маршрут: ' + distance + " км</li><li>Вес: " + weight + " кг</li><li>Точный расчет будет на шаге оплаты</li></ul>";
    });
  }

  if (calcFill && calcForm) {
    calcFill.addEventListener("click", function () {
      calcForm.elements.from.value = "Москва, ул. Правды, 24";
      calcForm.elements.to.value = "Москва, Цветной бульвар, 30";
      calcForm.elements.distance.value = "13";
      calcForm.elements.weight.value = "2.3";
      calcForm.elements.type.value = "car";
      calcForm.elements.urgency.value = "asap";
    });
  }

  var form = document.querySelector(".cta-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      alert("Демо: заявка не отправляется. Подключите сервер или форму к CRM.");
    });
  }

  var toggle = document.getElementById("nav-toggle");
  var nav = document.getElementById("site-nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", function () {
    var open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  nav.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function () {
      if (window.matchMedia("(max-width: 720px)").matches) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  });
})();
