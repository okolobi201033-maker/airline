// ==================================
// SKYLINK AIRWAYS
// HOMEPAGE INTERACTIONS
// ==================================

document.addEventListener("DOMContentLoaded", function () {

    // CURRENT YEAR
    const currentYear = document.getElementById("currentYear");

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    // MOBILE NAVIGATION
    const menuToggle = document.getElementById("menuToggle");
    const navigation = document.getElementById("navigation");

    if (menuToggle && navigation) {
        menuToggle.addEventListener("click", function () {
            const isOpen = navigation.classList.toggle("open");

            menuToggle.setAttribute("aria-expanded", String(isOpen));
            menuToggle.setAttribute(
                "aria-label",
                isOpen ? "Close navigation" : "Open navigation"
            );

            menuToggle.textContent = isOpen ? "✕" : "☰";
        });
    }

    // FLIGHT SEARCH ELEMENTS
    const flightSearchForm = document.getElementById("flightSearchForm");
    const departure = document.getElementById("departure");
    const destination = document.getElementById("destination");
    const departureDate = document.getElementById("departureDate");
    const returnDate = document.getElementById("returnDate");
    const returnField = document.getElementById("returnField");
    const swapLocations = document.getElementById("swapLocations");
    const tripTypeInputs = document.querySelectorAll(
        'input[name="tripType"]'
    );

    // FORMAT A DATE FOR THE DATE INPUT
    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }

    // SET THE EARLIEST DEPARTURE DATE TO TODAY
    const today = formatDate(new Date());

    if (departureDate) {
        departureDate.min = today;
        departureDate.value = today;
    }

    if (returnDate) {
        returnDate.min = today;
    }

    // RETURN DATE MUST NOT BE BEFORE DEPARTURE
    function updateReturnDateMinimum() {
        if (!departureDate || !returnDate) {
            return;
        }

        returnDate.min = departureDate.value || today;

        if (
            returnDate.value &&
            departureDate.value &&
            returnDate.value < departureDate.value
        ) {
            returnDate.value = departureDate.value;
        }
    }

    if (departureDate) {
        departureDate.addEventListener("change", updateReturnDateMinimum);
    }

    // SHOW OR HIDE RETURN DATE
    function updateTripType() {
        const selectedTrip = document.querySelector(
            'input[name="tripType"]:checked'
        );

        if (!selectedTrip || !returnField || !returnDate) {
            return;
        }

        const isRoundTrip = selectedTrip.value === "round-trip";

        returnField.style.display = isRoundTrip ? "" : "none";
        returnDate.required = isRoundTrip;

        if (!isRoundTrip) {
            returnDate.value = "";
        } else if (
            departureDate.value &&
            (!returnDate.value || returnDate.value < departureDate.value)
        ) {
            returnDate.value = departureDate.value;
        }
    }

    tripTypeInputs.forEach(function (input) {
        input.addEventListener("change", updateTripType);
    });

    updateTripType();

    // SWAP DEPARTURE AND DESTINATION
    if (swapLocations && departure && destination) {
        swapLocations.addEventListener("click", function () {
            const previousDeparture = departure.value;

            departure.value = destination.value;
            destination.value = previousDeparture;
        });
    }

    // FLIGHT SEARCH FORM
    if (flightSearchForm) {
        flightSearchForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const selectedTrip = document.querySelector(
                'input[name="tripType"]:checked'
            );

            const tripType = selectedTrip
                ? selectedTrip.value
                : "round-trip";

            const from = departure.value;
            const to = destination.value;
            const departDate = departureDate.value;
            const arriveDate = returnDate.value;
            const passengers = document.getElementById("passengers").value;
            const cabinClass = document.getElementById("cabinClass").value;

            // VALIDATE ROUTE
            if (from === to) {
                alert("Your departure and destination cannot be the same.");
                return;
            }

            // VALIDATE DEPARTURE DATE
            if (!departDate || departDate < today) {
                alert("Please select a valid departure date.");
                return;
            }

            // VALIDATE RETURN DATE
            if (
                tripType === "round-trip" &&
                (!arriveDate || arriveDate < departDate)
            ) {
                alert("Your return date must be on or after your departure date.");
                return;
            }

            // SAVE SEARCH DETAILS FOR THE FLIGHTS PAGE
            const searchDetails = {
                tripType: tripType,
                departure: from,
                destination: to,
                departureDate: departDate,
                returnDate: tripType === "round-trip" ? arriveDate : "",
                passengers: Number(passengers),
                cabinClass: cabinClass
            };

            sessionStorage.setItem(
                "skyLinkFlightSearch",
                JSON.stringify(searchDetails)
            );

            /*
             * This opens the dedicated flights page.
             * We will create that page in the next stage.
             */
            window.location.href =
                "pages/flights.html?" +
                new URLSearchParams(searchDetails).toString();
        });
    }

    console.log("SkyLink Airways homepage is ready.");
});
