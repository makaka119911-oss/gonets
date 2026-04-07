(function () {
  var form = document.getElementById("calc-form");
  var result = document.getElementById("result");
  if (!form || !result || !window.MockApi) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var fd = new FormData(form);
    var payload = {
      distance: Number(fd.get("distance")) || 1,
      weight: Number(fd.get("weight")) || 0.5,
      type: String(fd.get("type") || "walk"),
      urgency: String(fd.get("urgency") || "asap")
    };
    result.innerHTML = '<p class="calc__label">Считаем...</p>';
    window.MockApi.calculate(payload).then(function (data) {
      result.innerHTML =
        '<p class="calc__label">Предварительный расчет</p>' +
        '<p class="calc__price">от ' + data.price + ' ₽</p>' +
        '<p class="calc__eta">ETA: ' + data.eta + "</p>";
    });
  });
})();
