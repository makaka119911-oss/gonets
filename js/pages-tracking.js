(function () {
  var el = document.getElementById("tracking-card");
  if (!el || !window.MockApi) return;

  window.MockApi.getOrder("GN-20481").then(function (data) {
    if (!data.order) {
      el.textContent = "Заказ не найден";
      return;
    }
    var o = data.order;
    var steps = data.events
      .map(function (e) {
        return "<li><strong>" + e.time + "</strong> — " + e.title + "</li>";
      })
      .join("");
    el.innerHTML =
      "<h3>" +
      o.id +
      "</h3>" +
      "<p>" +
      o.from +
      " → " +
      o.to +
      "</p>" +
      "<p>Категория: " +
      (o.shipmentCategoryLabel || o.shipmentCategory || "—") +
      "</p>" +
      "<p>Статус: " +
      (o.statusLabel || o.status) +
      ", осталось ~" +
      o.etaMin +
      " мин</p>" +
      "<ul>" +
      steps +
      "</ul>";
  });
})();
