document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("signupForm");
  const message = document.getElementById("signupMessage");
  const year = document.getElementById("currentYear");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  if (!form || !message) return;

  const fields = {
    fullName: document.getElementById("fullName"),
    email: document.getElementById("email"),
    phone: document.getElementById("phone"),
    password: document.getElementById("password"),
    confirmPassword: document.getElementById("confirmPassword"),
    terms: document.getElementById("terms"),
  };

  const errors = {
    fullName: document.getElementById("nameError"),
    email: document.getElementById("emailError"),
    phone: document.getElementById("phoneError"),
    password: document.getElementById("passwordError"),
    confirmPassword: document.getElementById("confirmPasswordError"),
    terms: document.getElementById("termsError"),
  };

  function clearErrors() {
    Object.values(errors).forEach(function (element) {
      if (element) element.textContent = "";
    });

    message.hidden = true;
    message.textContent = "";
    message.className = "auth-message";
  }

  function setError(field, text) {
    if (errors[field]) errors[field].textContent = text;
  }

  // Show or hide password fields.
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
    clearErrors();

    let valid = true;

    const fullName = fields.fullName.value.trim();
    const email = fields.email.value.trim();
    const phone = fields.phone.value.trim();
    const password = fields.password.value;
    const confirmPassword = fields.confirmPassword.value;

    if (fullName.length < 2) {
      setError("fullName", "Please enter your full name.");
      valid = false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError("email", "Please enter a valid email address.");
      valid = false;
    }

    // Allows common Nigerian numbers and international formats.
    const phoneDigits = phone.replace(/\D/g, "");
    if (phoneDigits.length < 7 || phoneDigits.length > 15) {
      setError("phone", "Please enter a valid phone number.");
      valid = false;
    }

    if (password.length < 8) {
      setError("password", "Your password must contain at least 8 characters.");
      valid = false;
    }

    if (confirmPassword !== password || confirmPassword.length === 0) {
      setError("confirmPassword", "Your passwords do not match.");
      valid = false;
    }

    if (!fields.terms.checked) {
      setError("terms", "Please accept the terms and conditions.");
      valid = false;
    }

    if (!valid) {
      message.textContent =
        "Please correct the highlighted fields and try again.";
      message.classList.add("error");
      message.hidden = false;
      return;
    }

    message.textContent =
      "Your form passed validation. Account creation is not active yet because this website still needs a secure authentication service. No account or password has been saved.";
    message.classList.add("success");
    message.hidden = false;
  });
});
