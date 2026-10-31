const searchInput = document.getElementById("destinationSearch");
const destinationCards = document.querySelectorAll(".destination-card");
const filterButtons = document.querySelectorAll(".filter-btn");
const noResults = document.getElementById("noResults");

let selectedRegion = "all";

function filterDestinations() {
  const searchValue = searchInput.value.toLowerCase();

  let visibleCount = 0;

  destinationCards.forEach((card) => {
    const destinationName = card.textContent.toLowerCase();
    const cardRegion = card.dataset.region;

    const matchesSearch = destinationName.includes(searchValue);

    const matchesRegion =
      selectedRegion === "all" || cardRegion === selectedRegion;

    if (matchesSearch && matchesRegion) {
      card.style.display = "block";
      visibleCount++;
    } else {
      card.style.display = "none";
    }
  });

  noResults.style.display = visibleCount === 0 ? "block" : "none";
}

// SEARCH

searchInput.addEventListener("input", filterDestinations);

// REGION FILTERS

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => {
      btn.classList.remove("active");
    });

    button.classList.add("active");

    selectedRegion = button.dataset.region;

    filterDestinations();
  });
});

// IMAGE ERROR HANDLING

document.querySelectorAll(".destination-card img").forEach((image) => {
  image.addEventListener("error", () => {
    image.style.background = "#dce7f2";

    image.alt = "Destination image unavailable";
  });
});

// SIMPLE CARD ANIMATION

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");

        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.1,
  },
);

destinationCards.forEach((card) => {
  observer.observe(card);
});

console.log("SkyLink Destinations page loaded successfully.");
