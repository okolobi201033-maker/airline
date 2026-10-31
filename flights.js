// SKYLINK AIRWAYS — flight results demo with distinct aircraft photos
document.addEventListener("DOMContentLoaded", function () {
  const flightList = document.getElementById("flightList");
  const routeTitle = document.getElementById("routeTitle");
  const searchSummary = document.getElementById("searchSummary");
  const resultsCount = document.getElementById("resultsCount");
  const emptyResults = document.getElementById("emptyResults");
  const sortFlights = document.getElementById("sortFlights");
  const resetFilters = document.getElementById("resetFilters");
  if (!flightList) return;

  // Photos are remote Unsplash images. Internet is required to display them.
  // Each displayed option gets its own photo URL, rather than reusing one image.
  const photoUrls = [
    "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1517479149777-5f3b1511d5ad?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1542296332-2e4473faf563?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1556388158-158ea5ccacbd?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1521727857535-28d204c4c1a5?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1570710891163-6d3b5c47248b?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1504198322253-cfa87a0ff25f?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1474302770737-173ee21bab63?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80&sat=-25",
    "https://images.unsplash.com/photo-1517479149777-5f3b1511d5ad?auto=format&fit=crop&w=1200&q=80&sat=-25",
    "https://images.unsplash.com/photo-1542296332-2e4473faf563?auto=format&fit=crop&w=1200&q=80&sat=-25",
    "https://images.unsplash.com/photo-1556388158-158ea5ccacbd?auto=format&fit=crop&w=1200&q=80&sat=-25",
    "https://images.unsplash.com/photo-1521727857535-28d204c4c1a5?auto=format&fit=crop&w=1200&q=80&sat=-25",
    "https://images.unsplash.com/photo-1570710891163-6d3b5c47248b?auto=format&fit=crop&w=1200&q=80&sat=-25",
    "https://images.unsplash.com/photo-1504198322253-cfa87a0ff25f?auto=format&fit=crop&w=1200&q=80&sat=-25",
    "https://images.unsplash.com/photo-1474302770737-173ee21bab63?auto=format&fit=crop&w=1200&q=80&sat=-25",
    "https://images.unsplash.com/photo-1517479149777-5f3b1511d5ad?auto=format&fit=crop&w=1200&q=75&crop=entropy",
    "https://images.unsplash.com/photo-1542296332-2e4473faf563?auto=format&fit=crop&w=1200&q=75&crop=entropy",
    "https://images.unsplash.com/photo-1556388158-158ea5ccacbd?auto=format&fit=crop&w=1200&q=75&crop=entropy",
    "https://images.unsplash.com/photo-1521727857535-28d204c4c1a5?auto=format&fit=crop&w=1200&q=75&crop=entropy",
    "https://images.unsplash.com/photo-1570710891163-6d3b5c47248b?auto=format&fit=crop&w=1200&q=75&crop=entropy",
  ];

  const demonstrationFlights = [
    {
      id: "SL101",
      departure: "Lagos",
      destination: "London",
      time: "06:00",
      arrival: "12:00",
      duration: "6h 00m",
      aircraft: "SL-101",
      cabins: { Economy: 120000, Business: 350000, First: 650000 },
    },
    {
      id: "SL102",
      departure: "Lagos",
      destination: "London",
      time: "09:00",
      arrival: "15:00",
      duration: "6h 00m",
      aircraft: "SL-102",
      cabins: { Economy: 135000, Business: 370000, First: 680000 },
    },
    {
      id: "SL103",
      departure: "Lagos",
      destination: "London",
      time: "12:00",
      arrival: "18:00",
      duration: "6h 00m",
      aircraft: "SL-103",
      cabins: { Economy: 145000, Business: 390000, First: 710000 },
    },
    {
      id: "SL104",
      departure: "Lagos",
      destination: "London",
      time: "15:00",
      arrival: "21:00",
      duration: "6h 00m",
      aircraft: "SL-104",
      cabins: { Economy: 150000, Business: 410000, First: 730000 },
    },
    {
      id: "SL105",
      departure: "Lagos",
      destination: "London",
      time: "18:00",
      arrival: "00:00",
      duration: "6h 00m",
      aircraft: "SL-105",
      cabins: { Economy: 160000, Business: 430000, First: 750000 },
    },
    {
      id: "SL106",
      departure: "Lagos",
      destination: "London",
      time: "21:00",
      arrival: "03:00",
      duration: "6h 00m",
      aircraft: "SL-106",
      cabins: { Economy: 165000, Business: 450000, First: 780000 },
    },
    {
      id: "SL107",
      departure: "Lagos",
      destination: "London",
      time: "00:00",
      arrival: "06:00",
      duration: "6h 00m",
      aircraft: "SL-107",
      cabins: { Economy: 170000, Business: 470000, First: 800000 },
    },
  ];

  const params = new URLSearchParams(window.location.search);
  let savedSearch = {};
  try {
    savedSearch = JSON.parse(
      sessionStorage.getItem("skyLinkFlightSearch") || "{}",
    );
  } catch {}
  const departure = params.get("departure") || savedSearch.departure || "Lagos";
  const destination =
    params.get("destination") || savedSearch.destination || "London";
  const departureDate =
    params.get("departureDate") || savedSearch.departureDate || "";
  const returnDate = params.get("returnDate") || savedSearch.returnDate || "";
  const tripType =
    params.get("tripType") || savedSearch.tripType || "round-trip";
  const passengers = Number(
    params.get("passengers") || savedSearch.passengers || 1,
  );
  const currency = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  });
  const cabinNames = {
    Economy: "Economy Class",
    Business: "Business Class",
    First: "First Class",
  };

  function escapeHTML(value) {
    return String(value).replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#039;",
        })[c],
    );
  }
  function formatDate(value) {
    if (!value) return "Date not selected";
    const date = new Date(value + "T12:00:00");
    return Number.isNaN(date.getTime())
      ? "Date not selected"
      : date.toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
  }
  function getTimeCategory(time) {
    const hour = Number(time.split(":")[0]);
    if (hour >= 6 && hour < 12) return "morning";
    if (hour >= 12 && hour < 18) return "afternoon";
    if (hour >= 18) return "evening";
    return "night";
  }
  const routeFlights = demonstrationFlights
    .filter(
      (flight) =>
        flight.departure.toLowerCase() === departure.toLowerCase() &&
        flight.destination.toLowerCase() === destination.toLowerCase(),
    );
  const allOptions = (routeFlights.length
    ? routeFlights
    : demonstrationFlights.map((flight) => ({
        ...flight,
        departure,
        destination,
      }))
  )
    .flatMap((f) =>
      Object.entries(f.cabins).map(([cabin, price]) => ({
        ...f,
        cabin,
        price,
      })),
    );

  if (departure.toLowerCase() === destination.toLowerCase()) {
    routeTitle.textContent = "Choose a different destination";
    searchSummary.textContent =
      "Departure and destination must be different airports.";
  } else {
    routeTitle.textContent = `${departure} → ${destination}`;
    searchSummary.textContent = `${formatDate(departureDate)} · ${passengers} passenger(s) · ${tripType === "one-way" ? "One way" : "Round trip"}${tripType === "round-trip" && returnDate ? ` · Return ${formatDate(returnDate)}` : ""}`;
  }

  function getVisibleOptions() {
    const cabins = [...document.querySelectorAll(".cabin-filter:checked")].map(
      (i) => i.value,
    );
    const times = [...document.querySelectorAll(".time-filter:checked")].map(
      (i) => i.value,
    );
    const visible = allOptions.filter(
      (f) =>
        cabins.includes(f.cabin) && times.includes(getTimeCategory(f.time)),
    );
    const sortBy = sortFlights.value;
    if (sortBy === "price-low") visible.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-high") visible.sort((a, b) => b.price - a.price);
    else if (sortBy === "departure")
      visible.sort((a, b) => a.time.localeCompare(b.time));
    else
      visible.sort((a, b) => a.time.localeCompare(b.time) || a.price - b.price);
    return visible;
  }

  function renderFlights() {
    const visible = getVisibleOptions();
    resultsCount.textContent = `${visible.length} demonstration option(s)`;
    emptyResults.hidden = visible.length !== 0;
    flightList.innerHTML = visible
      .map(function (flight, visibleIndex) {
        const imageUrl = photoUrls[visibleIndex % photoUrls.length];
        const bookingURL = new URL("booking.html", window.location.href);
        bookingURL.searchParams.set("from", flight.departure);
        bookingURL.searchParams.set("to", flight.destination);
        bookingURL.searchParams.set("date", departureDate);
        bookingURL.searchParams.set("returnDate", returnDate);
        bookingURL.searchParams.set("tripType", tripType);
        bookingURL.searchParams.set("departureTime", flight.time);
        bookingURL.searchParams.set("arrivalTime", flight.arrival);
        bookingURL.searchParams.set("flight", flight.id);
        bookingURL.searchParams.set("cabin", flight.cabin);
        bookingURL.searchParams.set("passengers", String(passengers));
        bookingURL.searchParams.set("fare", String(flight.price));

        return `
        <article class="flight-card">
          <div class="flight-card-image-wrap">
            <img class="flight-card-image" src="${imageUrl}" alt="Aircraft photograph for sample flight ${escapeHTML(flight.id)}" loading="lazy"
              onerror="this.style.display='none'; this.parentElement.classList.add('image-fallback');">
            <span class="flight-image-caption">SKYLINK JOURNEY · ${escapeHTML(flight.aircraft)}</span>
          </div>
          <div class="flight-card-main">
            <div class="flight-card-top">
              <div>
                <div class="flight-code">Example flight ${escapeHTML(flight.id)}</div>
                <div class="flight-aircraft">Aircraft reference: ${escapeHTML(flight.aircraft)}</div>
              </div>
              <span class="demo-tag">SAMPLE DATA</span>
            </div>
            <div class="flight-timing">
              <div class="flight-time"><h3>${escapeHTML(flight.time)}</h3><p>${escapeHTML(flight.departure)}</p></div>
              <div><div class="flight-route-line"><span>✈</span></div><p class="flight-stops">${escapeHTML(flight.duration)} · Example</p></div>
              <div class="flight-time"><h3>${escapeHTML(flight.arrival)}</h3><p>${escapeHTML(flight.destination)}</p></div>
            </div>
          </div>
          <div class="flight-card-bottom">
            <div class="flight-cabin-name">${escapeHTML(cabinNames[flight.cabin])}</div>
            <div><span class="flight-price-label">Illustrative fare per passenger</span><div class="flight-price">${currency.format(flight.price)} <small>/ person</small></div></div>
            <a class="button choose-flight" href="${escapeHTML(bookingURL.href)}">Book this sample flight →</a>
          </div>
        </article>`;
      })
      .join("");
  }

  document
    .querySelectorAll(".cabin-filter, .time-filter")
    .forEach((input) => input.addEventListener("change", renderFlights));
  sortFlights.addEventListener("change", renderFlights);
  resetFilters.addEventListener("click", function () {
    document
      .querySelectorAll(".cabin-filter, .time-filter")
      .forEach((input) => (input.checked = true));
    sortFlights.value = "recommended";
    renderFlights();
  });
  renderFlights();

  // ============================================
  // FOUR-HOUR DEMONSTRATION AVAILABILITY CYCLE
  // ============================================

  (function startAvailabilityTimer() {
    const countdown = document.getElementById("availabilityCountdown");

    if (!countdown) return;

    const REFRESH_INTERVAL = 4 * 60 * 60 * 1000;
    const STORAGE_KEY = "skyLinkNextAvailabilityRefresh";

    function getNextRefresh() {
      let nextRefresh;

      try {
        nextRefresh = Number(localStorage.getItem(STORAGE_KEY));
      } catch (error) {
        console.warn("Could not read the demo availability timer:", error);
      }

      if (!Number.isFinite(nextRefresh) || nextRefresh <= 0) {
        nextRefresh = Date.now() + REFRESH_INTERVAL;
        try {
          localStorage.setItem(STORAGE_KEY, String(nextRefresh));
        } catch (error) {
          console.warn("Could not save the demo availability timer:", error);
        }
      }

      return nextRefresh;
    }

    function updateCountdown() {
      let nextRefresh = getNextRefresh();
      let remaining = nextRefresh - Date.now();

      if (remaining <= 0) {
        nextRefresh = Date.now() + REFRESH_INTERVAL;
        try {
          localStorage.setItem(STORAGE_KEY, String(nextRefresh));
        } catch (error) {
          console.warn("Could not restart the demo availability timer:", error);
        }

        remaining = REFRESH_INTERVAL;
        countdown.title =
          "The demonstration availability cycle has restarted.";
      }

      const totalSeconds = Math.ceil(remaining / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      countdown.textContent = [
        String(hours).padStart(2, "0"),
        String(minutes).padStart(2, "0"),
        String(seconds).padStart(2, "0"),
      ].join(":");
    }

    updateCountdown();
    window.setInterval(updateCountdown, 1000);
  })();
});
