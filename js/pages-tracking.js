(function () {
  var el = document.getElementById("tracking-card");
  if (!el || !window.MockApi) return;

  window.MockApi.getOrder("GN-20481").then(function (data) {
    if (!data.order) {
      el.textContent = "Заказ не найден";
      return;
    }
    var steps = data.events
      .map(function (e) {
        return "<li><strong>" + e.time + "</strong> — " + e.title + "</li>";
      })
      .join("");
    el.innerHTML =
      "<h3>" + data.order.id + "</h3>" +
      "<p>" + data.order.from + " → " + data.order.to + "</p>" +
      "<p>Статус: " + data.order.status + ", осталось ~" + data.order.etaMin + " мин</p>" +
      "<ul>" + steps + "</ul>";
  });
})();
