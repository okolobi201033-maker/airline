document.addEventListener("DOMContentLoaded", function () {
  const year = document.getElementById("currentYear");

  if (year) {
    year.textContent = new Date().getFullYear();
  }
});
