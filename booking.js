document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);

  const cabinPrices = {
    economy: 120000,
    business: 350000,
    first: 650000,
    "first class": 650000
  };

  const formatNaira = amount =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0
    }).format(amount);

  const getParam = (names, fallback = "") => {
    for (const name of names) {
      const value = params.get(name);
      if (value !== null && value.trim() !== "") {
        return value.trim();
      }
    }
    return fallback;
  };

  const cabinInput = getParam(
    ["cabin", "class"],
    "Economy"
  );

  const cabinKey = cabinInput.toLowerCase();
  const cabin = cabinPrices[cabinKey] ? cabinInput : "Economy";
  const requestedFare = Number(params.get("fare"));
  const fare =
    Number.isFinite(requestedFare) && requestedFare > 0
      ? requestedFare
      : cabinPrices[cabinKey] || cabinPrices.economy;

  const from = getParam(["from", "origin"], "Lagos (LOS)");
  const to = getParam(["to", "destination"], "Abuja (ABV)");
  const date = getParam(["date", "departureDate"], "");
  const departureTime = getParam(["departureTime", "time"], "08:00");
  const arrivalTime = getParam(["arrivalTime"], "09:30");
  const flightNumber = getParam(["flight", "flightNumber"], "SL-101");
  const returnDate = getParam(["returnDate"]);
  const tripType = getParam(["tripType"], "one-way");

  const passengerValue = Number(
    getParam(["passengers", "adults"], "1")
  );

  const passengers = Number.isInteger(passengerValue)
    ? Math.min(9, Math.max(1, passengerValue))
    : 1;

  const total = fare * passengers;

  const setText = (id, value) => {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
  };

  const readableDate = date
    ? new Date(`${date}T12:00:00`).toLocaleDateString("en-NG", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric"
      })
    : "Demo date — select a flight first";

  setText("summaryRoute", `${from} → ${to}`);
  setText("summaryDate", readableDate);
  setText("summaryFrom", from);
  setText("summaryTo", to);
  setText("summaryDepartureTime", departureTime);
  setText("summaryArrivalTime", arrivalTime);
  setText("summaryFlightNumber", flightNumber);
  setText("summaryCabin", cabin);
  setText(
    "summaryPassengers",
    `${passengers} ${passengers === 1 ? "passenger" : "passengers"}`
  );
  setText("summaryFare", formatNaira(fare));
  setText("summarySubtotal", formatNaira(total));
  setText("summaryTotal", formatNaira(total));

  const form = document.getElementById("bookingForm");
  const message = document.getElementById("formMessage");

  const birthDateInput = document.getElementById("dateOfBirth");

  if (birthDateInput) {
    birthDateInput.max = new Date().toISOString().split("T")[0];
  }

  form.addEventListener("submit", event => {
    event.preventDefault();

    message.textContent = "";
    message.className = "form-message";

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const birthDate = new Date(birthDateInput.value + "T12:00:00");

    if (birthDate > new Date()) {
      message.textContent = "Date of birth cannot be in the future.";
      message.classList.add("error");
      return;
    }

    const formData = new FormData(form);

    const firstName = String(formData.get("firstName")).trim();
    const lastName = String(formData.get("lastName")).trim();
    const email = String(formData.get("email")).trim();

    const reference =
      "SL-DEMO-" +
      Math.random().toString(36).substring(2, 8).toUpperCase();

    const demoBooking = {
      reference,
      firstName,
      lastName,
      email,
      from,
      to,
      date: date || "Demo date not selected",
      returnDate,
      tripType,
      departureTime,
      arrivalTime,
      flightNumber,
      cabin,
      passengers,
      total,
      createdAt: new Date().toISOString()
    };

    // Demo only: keep this booking in this browser.
    // Do not store real passenger information in this prototype.
    try {
      const previousBookings = JSON.parse(
        sessionStorage.getItem("skylinkDemoBookings") || "[]"
      );

      previousBookings.push(demoBooking);

      sessionStorage.setItem(
        "skylinkDemoBookings",
        JSON.stringify(previousBookings)
      );
    } catch (error) {
      console.warn("Demo booking could not be saved in this browser.");
    }

    const confirmation = new URL("confirmation.html", window.location.href);
    confirmation.searchParams.set("ref", reference);

    try {
      sessionStorage.setItem(
        "skylinkLatestDemoBooking",
        JSON.stringify(demoBooking)
      );
    } catch (error) {
      // The confirmation page can still show the reference.
    }

    window.location.href = confirmation.href;
  });
});
