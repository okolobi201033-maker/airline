document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("loginForm");
  const message = document.getElementById("loginMessage");
  const year = document.getElementById("currentYear");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  if (!form || !message) return;

  document.querySelectorAll(".password-toggle").forEach(function (button) {
    button.addEventListener("click", function () {
      const input = document.getElementById(button.dataset.target);
      if (!input) return;

      const showing = input.type === "text";
      input.type = showing ? "password" : "text";
      button.textContent = showing ? "Show" : "Hide";
      button.setAttribute(
        "aria-label",
        showing ? "Show password" : "Hide password",
      );
    });
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    message.textContent =
      "Sign-in is not active yet because this demo does not have a secure authentication service. Your password has not been sent or saved.";
    message.className = "auth-message error";
    message.hidden = false;
  });
});
