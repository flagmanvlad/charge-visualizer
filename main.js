const batteryTotal = 73;
const wattsValue = document.getElementById("wattsValue");
const voltInput = document.getElementById("voltInput");
const ampInput = document.getElementById("ampInput");
const batteryInput = document.getElementById("batteryInput");
const batteryPercent = document.getElementById("batteryPercent");

const rangeChill = document.getElementById("rangeChill");
const rangeNormal = document.getElementById("rangeNormal");
const rangeSport = document.getElementById("rangeSport");

function buildTable() {
  const tbody = document.querySelector("#powerTable tbody");
  const thead = document.querySelector("#powerTable thead tr");

  // Очистити таблицю
  thead.innerHTML = "<th>V / A</th>";
  tbody.innerHTML = "";

  // Додати ампери у заголовки стовпців
  for (let a = 5; a <= 20; a++) {
    const th = document.createElement("th");
    th.textContent = a;
    thead.appendChild(th);
  }

  // Для кожного вольта — новий рядок
  for (let v = 200; v <= 240; v++) {
    const row = document.createElement("tr");
    const label = document.createElement("th");
    label.textContent = v;
    row.appendChild(label);

    for (let a = 5; a <= 20; a++) {
      const cell = document.createElement("td");
      const watts = v * a;
      cell.textContent = watts;
      cell.setAttribute("data-amp", a);
      cell.setAttribute("data-volt", v);
      row.appendChild(cell);
    }

    tbody.appendChild(row);
  }
}


function highlightCell() {
  const amp = parseInt(ampInput.value);
  const volt = parseInt(voltInput.value);
  const scrollContainer = document.getElementById("tableScroll");

  document.querySelectorAll("td").forEach(cell => {
    const a = parseInt(cell.getAttribute("data-amp"));
    const v = parseInt(cell.getAttribute("data-volt"));
    if (a === amp && v === volt) {
      cell.classList.add("highlight");
      void cell.offsetWidth; // reset animation
      cell.classList.remove("highlight");
      setTimeout(() => cell.classList.add("highlight"), 0);
      // Auto scroll
      cell.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    } else {
      cell.classList.remove("highlight");
    }
    if (!isNaN(amp) && !isNaN(volt)) {
  const power = amp * volt;
  wattsValue.textContent = power;
} else {
  wattsValue.textContent = "–";
}
  });
}

function updateFromkWh() {
  const kWh = parseFloat(batteryInput.value.replace(",", "."));
  if (!kWh || kWh < 0 || kWh > batteryTotal) return;
  batteryPercent.value = Math.round((kWh / batteryTotal) * 100);
  updateRange(kWh);
}

function updateFromPercent() {
  const percent = parseFloat(batteryPercent.value.replace(",", "."));
  if (!percent || percent < 0 || percent > 100) return;
  const kWh = (percent / 100) * batteryTotal;
  batteryInput.value = kWh.toFixed(1);
  updateRange(kWh);
}

function updateRange(kWh) {
  const Wh = kWh * 1000;
  rangeChill.textContent = Math.round(Wh / 180) + " км";
  rangeNormal.textContent = Math.round(Wh / 220) + " км";
  rangeSport.textContent = Math.round(Wh / 250) + " км";
}

// Ініціалізація
buildTable();
highlightCell();

// Події
voltInput.addEventListener("input", highlightCell);
ampInput.addEventListener("input", highlightCell);

batteryInput.addEventListener("input", updateFromkWh);
batteryPercent.addEventListener("input", updateFromPercent);
