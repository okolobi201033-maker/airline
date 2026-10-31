// ======================================
// SKYLINK AIRWAYS - FLEET PAGE JAVASCRIPT
// ======================================

document.addEventListener("DOMContentLoaded", () => {
  // 1. Smooth scrolling
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", function (event) {
      const target = document.querySelector(this.getAttribute("href"));

      if (target) {
        event.preventDefault();

        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // 2. Aircraft card animation
  const aircraftCards = document.querySelectorAll(".aircraft-card");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show-card");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
    },
  );

  aircraftCards.forEach((card) => {
    card.classList.add("hidden-card");
    observer.observe(card);
  });

  // 3. Cabin card animation
  const cabinCards = document.querySelectorAll(".cabin-card");

  cabinCards.forEach((card) => {
    card.classList.add("hidden-card");
    observer.observe(card);
  });

  // 4. Image error handling
  document.querySelectorAll("img").forEach((image) => {
    image.addEventListener("error", () => {
      image.style.backgroundColor = "#e8edf5";
      image.style.objectFit = "contain";
      image.alt = "Aircraft image unavailable";
    });
  });

  // 5. Back to top button
  const topButton = document.createElement("button");

  topButton.innerHTML = "↑";
  topButton.className = "back-to-top";
  topButton.setAttribute("aria-label", "Back to top");

  document.body.appendChild(topButton);

  window.addEventListener("scroll", () => {
    topButton.classList.toggle("visible", window.scrollY > 400);
  });

  topButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  // 6. Current year in footer
  const footer = document.querySelector(".fleet-footer");

  if (footer) {
    const year = new Date().getFullYear();
    footer.innerHTML = footer.innerHTML.replace("2026", year);
  }
});
