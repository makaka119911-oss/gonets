(function () {
  var form = document.getElementById("login-form");
  var result = document.getElementById("login-result");
  if (!form || !result || !window.MockApi) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var fd = new FormData(form);
    window.MockApi.login(String(fd.get("phone")), String(fd.get("password")))
      .then(function (resp) {
        result.textContent = "Успешный вход: " + resp.user.name + " (" + resp.user.role + ")";
      })
      .catch(function (err) {
        result.textContent = err.message;
      });
  });
})();
