const voltInput = document.getElementById("voltInput");
const ampInput = document.getElementById("ampInput");
const batteryInput = document.getElementById("batteryInput");

const rangeChill = document.getElementById("rangeChill");
const rangeNormal = document.getElementById("rangeNormal");
const rangeSport = document.getElementById("rangeSport");

const powerTableBody = document.querySelector("#powerTable tbody");
const powerTableHead = document.querySelector("#powerTable thead tr");

const voltMin = 200, voltMax = 240;
const ampMin = 5, ampMax = 20;

// --- Зберігати значення в localStorage
function saveInput(id, value) {
  localStorage.setItem(id, value);
}

function loadInputs() {
  ["voltInput", "ampInput", "batteryInput"].forEach(id => {
    const saved = localStorage.getItem(id);
    if (saved !== null) document.getElementById(id).value = saved;
  });
}

// --- Побудова таблиці
function buildTable() {
  // Створюємо заголовки
  for (let v = voltMin; v <= voltMax; v++) {
    const th = document.createElement("th");
    th.textContent = v;
    powerTableHead.appendChild(th);
  }

  // Створюємо рядки
  for (let a = ampMin; a <= ampMax; a++) {
    const row = document.createElement("tr");
    const labelCell = document.createElement("th");
    labelCell.textContent = a;
    row.appendChild(labelCell);

    for (let v = voltMin; v <= voltMax; v++) {
      const cell = document.createElement("td");
      cell.textContent = a * v;
      cell.setAttribute("data-amp", a);
      cell.setAttribute("data-volt", v);
      row.appendChild(cell);
    }

    powerTableBody.appendChild(row);
  }
}

// --- Підсвітити відповідну клітинку
function highlightCell() {
  const amp = parseInt(ampInput.value);
  const volt = parseInt(voltInput.value);

  document.querySelectorAll("#powerTable td").forEach(cell => {
    const a = parseInt(cell.getAttribute("data-amp"));
    const v = parseInt(cell.getAttribute("data-volt"));
    cell.classList.toggle("highlight", a === amp && v === volt);
  });
}

// --- Оновлення віджету пробігу
function updateRange() {
  const kWh = parseFloat(batteryInput.value.replace(",", "."));
  if (!kWh || kWh <= 0) {
    rangeChill.textContent = "–";
    rangeNormal.textContent = "–";
    rangeSport.textContent = "–";
    return;
  }

  const Wh = kWh * 1000;
  rangeChill.textContent = Math.round(Wh / 180) + " км";
  rangeNormal.textContent = Math.round(Wh / 220) + " км";
  rangeSport.textContent = Math.round(Wh / 250) + " км";
}

// --- Обробники подій
[voltInput, ampInput].forEach(input => {
  input.addEventListener("input", () => {
    highlightCell();
    saveInput(input.id, input.value);
  });
});

batteryInput.addEventListener("input", () => {
  updateRange();
  saveInput("batteryInput", batteryInput.value);
});

// --- Ініціалізація
buildTable();
loadInputs();
highlightCell();
updateRange();

const batteryTotal = 73; // Tesla Y LR 2020

function updateRange() {
  const input = batteryInput.value.replace(",", ".");
  const kWh = parseFloat(input);
  const Wh = kWh * 1000;
  const percent = Math.round((kWh / batteryTotal) * 100);

  if (!kWh || kWh <= 0 || kWh > batteryTotal) {
    percentCharge.textContent = "–";
    rangeChill.textContent = "–";
    rangeNormal.textContent = "–";
    rangeSport.textContent = "–";
    return;
  }

  percentCharge.textContent = `${kWh.toFixed(1)} / ${batteryTotal} кВт·год (${percent}%)`;
  rangeChill.textContent = Math.round(Wh / 180) + " км";
  rangeNormal.textContent = Math.round(Wh / 220) + " км";
  rangeSport.textContent = Math.round(Wh / 250) + " км";
}

