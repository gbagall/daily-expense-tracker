let entries =
  JSON.parse(localStorage.getItem("expenseEntries")) || [];

document.getElementById("date").valueAsDate =
  new Date();

function saveData() {

  localStorage.setItem(
    "expenseEntries",
    JSON.stringify(entries)
  );

  loadSummary();
}

function addEntry() {

  const date =
    document.getElementById("date").value;

  const type =
    document.getElementById("type").value;

  const amount =
    parseFloat(
      document.getElementById("amount").value
    );

  const comment =
    document.getElementById("comment").value;

  if (!date || !amount || amount <= 0) {

    alert("Please enter valid details");

    return;
  }

  entries.push({
    id: Date.now(),
    date,
    type,
    amount,
    comment
  });

  saveData();

  document.getElementById("amount").value = "";
  document.getElementById("comment").value = "";

  filterEntries();
}

function filterEntries() {

  const fromDate =
    document.getElementById("fromDate").value;

  const toDate =
    document.getElementById("toDate").value;

  const table =
    document.getElementById("entriesTable");

  table.innerHTML = "";

  let totalCredit = 0;
  let totalDebit = 0;

  const filtered = entries.filter(entry => {

    return (
      (!fromDate || entry.date >= fromDate) &&
      (!toDate || entry.date <= toDate)
    );

  });

  filtered.sort(
    (a,b) =>
      new Date(b.date) - new Date(a.date)
  );

  filtered.forEach(entry => {

    if (entry.type === "Credit") {
      totalCredit += entry.amount;
    }
    else {
      totalDebit += entry.amount;
    }

    table.innerHTML += `

      <tr>

        <td>${entry.date}</td>

        <td class="${
          entry.type === "Credit"
          ? "credit-text"
          : "debit-text"
        }">

          ${entry.type}

        </td>

        <td>₹${entry.amount}</td>

        <td>${entry.comment}</td>

        <td>

          <button
            class="delete-btn"
            onclick="deleteEntry(${entry.id})"
          >
            Delete
          </button>

        </td>

      </tr>

    `;
  });

  if(filtered.length === 0){

    table.innerHTML = `
      <tr>
        <td colspan="5">
          No Entries Found
        </td>
      </tr>
    `;
  }

  document.getElementById("filterCredit").innerText =
    "₹" + totalCredit;

  document.getElementById("filterDebit").innerText =
    "₹" + totalDebit;
}

function deleteEntry(id) {

  const confirmDelete =
    confirm("Delete this entry?");

  if (!confirmDelete) return;

  entries =
    entries.filter(entry => entry.id !== id);

  saveData();

  filterEntries();
}

function loadSummary() {

  const today =
    new Date().toISOString().split("T")[0];

  const currentMonth =
    today.substring(0,7);

  let todayCredit = 0;
  let todayDebit = 0;

  let monthCredit = 0;
  let monthDebit = 0;

  entries.forEach(entry => {

    if(entry.date === today){

      if(entry.type === "Credit"){
        todayCredit += entry.amount;
      }
      else{
        todayDebit += entry.amount;
      }
    }

    if(entry.date.startsWith(currentMonth)){

      if(entry.type === "Credit"){
        monthCredit += entry.amount;
      }
      else{
        monthDebit += entry.amount;
      }
    }

  });

  document.getElementById("todayCredit").innerText =
    "₹" + todayCredit;

  document.getElementById("todayDebit").innerText =
    "₹" + todayDebit;

  document.getElementById("monthCredit").innerText =
    "₹" + monthCredit;

  document.getElementById("monthDebit").innerText =
    "₹" + monthDebit;
}

loadSummary();

filterEntries();