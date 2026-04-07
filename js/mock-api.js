(function () {
  var root = window.APP_ROOT || ".";
  var delayMs = 220;

  function readJson(path) {
    return fetch(root + "/mocks/" + path).then(function (r) {
      if (!r.ok) throw new Error("Mock not found: " + path);
      return r.json();
    });
  }

  function wait(data) {
    return new Promise(function (resolve) {
      setTimeout(function () {
        resolve(data);
      }, delayMs);
    });
  }

  window.MockApi = {
    calculate: function (payload) {
      var base = 250;
      var perKm = payload.type === "cargo" ? 70 : payload.type === "car" ? 45 : 25;
      var perKg = payload.type === "cargo" ? 18 : 8;
      var urgency = payload.urgency === "asap" ? 1.2 : 1;
      var value = Math.round((base + payload.distance * perKm + payload.weight * perKg) * urgency);
      var eta = payload.type === "cargo" ? "90-140 мин" : payload.type === "car" ? "35-70 мин" : "45-80 мин";
      return wait({ price: value, eta: eta });
    },
    listOrders: function () {
      return readJson("orders.json").then(wait);
    },
    getOrder: function (id) {
      return Promise.all([readJson("orders.json"), readJson("tracking-events.json")]).then(function (res) {
        var order = res[0].find(function (o) {
          return o.id === id;
        });
        return wait({ order: order, events: res[1][id] || [] });
      });
    },
    login: function (phone, password) {
      return readJson("users.json").then(function (users) {
        var user = users.find(function (u) {
          return u.phone === phone && u.password === password;
        });
        if (!user) throw new Error("Неверный телефон или пароль");
        return wait({ token: "mock-jwt-token", user: user });
      });
    }
  };
})();
