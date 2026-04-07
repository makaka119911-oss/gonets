(function () {
  var list = document.getElementById("history-list");
  if (!list || !window.MockApi) return;

  window.MockApi.listOrders().then(function (orders) {
    list.innerHTML = orders
      .map(function (o) {
        return (
          '<article class="card">' +
          '<h3 class="card__title">' + o.id + "</h3>" +
          '<p class="card__text">' + o.from + " → " + o.to + "</p>" +
          '<p class="card__text">Статус: ' + o.status + ", цена: " + o.price + " ₽</p>" +
          '<a class="card__link" href="../calculate/">Повторить заказ</a>' +
          "</article>"
        );
      })
      .join("");
  });
})();
