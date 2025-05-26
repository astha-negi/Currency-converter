const BASE_URL = "https://api.frankfurter.app/latest";

// Get references to DOM elements
const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Populate currency dropdowns
for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;

    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }

    select.append(newOption);
  }

  // Update flag on currency change
  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

// Function to update exchange rate
const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;

  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }

  const from = fromCurr.value;
  const to = toCurr.value;

  const URL = `${BASE_URL}?amount=${amtVal}&from=${from}&to=${to}`;

  try {
    const response = await fetch(URL);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    const rate = data.rates[to];
    const finalAmount = rate;

    msg.innerText = `${amtVal} ${from} = ${finalAmount} ${to}`;
  } catch (error) {
    msg.innerText = "Error fetching exchange rate. Please try again.";
    console.error("Fetch error:", error);
  }
};

// Function to update flag icon
const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

// Handle button click
btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

// Load initial exchange rate
window.addEventListener("load", () => {
  updateExchangeRate();
});
