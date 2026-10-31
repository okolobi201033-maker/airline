document.addEventListener("DOMContentLoaded", () => {
  const referenceElement = document.getElementById("confirmationReference");

  const params = new URLSearchParams(window.location.search);
  const requestedReference = params.get("ref");

  let booking = null;

  try {
    const latestBooking = JSON.parse(
      sessionStorage.getItem("skylinkLatestDemoBooking") || "null",
    );

    const previousBookings = JSON.parse(
      sessionStorage.getItem("skylinkDemoBookings") || "[]",
    );

    if (requestedReference) {
      booking =
        previousBookings.find(
          (item) => item.reference === requestedReference,
        ) || null;

      if (
        !booking &&
        latestBooking &&
        latestBooking.reference === requestedReference
      ) {
        booking = latestBooking;
      }
    } else {
      booking = latestBooking;
    }
  } catch (error) {
    console.warn("Could not read the demo booking from this browser.");
  }

  const setText = (id, value) => {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
  };

  const formatNaira = (amount) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(Number(amount) || 0);

  if (!booking) {
    referenceElement.textContent = "NO BOOKING FOUND";

    setText("confirmationPassenger", "No demonstration booking found");

    setText("confirmationDate", "Create a demo booking first");

    setText("confirmationTotal", "Not available");

    const card = document.querySelector(".confirmation-card");

    if (card) {
      const notice = document.createElement("p");
      notice.className = "confirmation-warning";
      notice.textContent =
        "No matching demonstration booking was found in this browser session. " +
        "Return to the booking page and submit the demo form first.";

      card.prepend(notice);
    }

    return;
  }

  setText("confirmationReference", booking.reference);
  setText("confirmationFrom", booking.from || "Not selected");
  setText("confirmationTo", booking.to || "Not selected");

  setText("confirmationDepartureTime", booking.departureTime || "Not selected");

  setText("confirmationArrivalTime", booking.arrivalTime || "Not selected");

  setText("confirmationFlightNumber", booking.flightNumber || "Sample flight");

  const dateText =
    booking.date && booking.date !== "Demo date not selected"
      ? new Date(`${booking.date}T12:00:00`).toLocaleDateString("en-NG", {
          weekday: "short",
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "Not selected";

  setText("confirmationDate", dateText);

  setText(
    "confirmationPassenger",
    `${booking.firstName || ""} ${booking.lastName || ""}`.trim() ||
      "Passenger",
  );

  setText("confirmationCabin", booking.cabin || "Economy");

  setText("confirmationPassengers", String(booking.passengers || 1));

  setText("confirmationTotal", formatNaira(booking.total));

  const printButton = document.getElementById("printConfirmation");

  printButton?.addEventListener("click", () => {
    window.print();
  });
});
