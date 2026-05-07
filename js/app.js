document.getElementById("date").valueAsDate =
  new Date();

function showTab(tabId, button){

  document
    .querySelectorAll(".tab-content")
    .forEach(tab => {
      tab.classList.add("hidden");
    });

  document
    .getElementById(tabId)
    .classList.remove("hidden");

  document
    .querySelectorAll(".tab-btn")
    .forEach(btn => {
      btn.classList.remove("active");
    });

  button.classList.add("active");
}

function addEntry(){

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

  if(!date || !amount || amount <= 0){

    alert("Please enter valid details");

    return;
  }

  const entry = {
    id: Date.now(),
    date,
    type,
    amount,
    comment
  };

  addEntryToDB(entry);

  setTimeout(() => {
    loadAllEntries();
    filterEntries();
    loadSummary();
  }, 100);

  document.getElementById("amount").value = "";
  document.getElementById("comment").value = "";
}

function loadAllEntries(){

  getAllEntries(entries => {

    const table =
      document.getElementById(
        "latestEntriesTable"
      );

    table.innerHTML = "";

    entries
      .sort(
        (a,b) =>
          new Date(b.date) -
          new Date(a.date)
      )
      .forEach(entry => {

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
  });
}

function filterEntries(){

  getAllEntries(entries => {

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

    filtered.forEach(entry => {

      if(entry.type === "Credit"){
        totalCredit += entry.amount;
      }
      else{
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

    document.getElementById(
      "filterCredit"
    ).innerText = "₹" + totalCredit;

    document.getElementById(
      "filterDebit"
    ).innerText = "₹" + totalDebit;
  });
}

function deleteEntry(id){

  deleteEntryFromDB(id);

  setTimeout(() => {
    loadAllEntries();
    filterEntries();
    loadSummary();
  }, 100);
}

function loadSummary(){

  getAllEntries(entries => {

    const today =
      new Date()
      .toISOString()
      .split("T")[0];

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

    document.getElementById(
      "todayCredit"
    ).innerText = "₹" + todayCredit;

    document.getElementById(
      "todayDebit"
    ).innerText = "₹" + todayDebit;

    document.getElementById(
      "monthCredit"
    ).innerText = "₹" + monthCredit;

    document.getElementById(
      "monthDebit"
    ).innerText = "₹" + monthDebit;
  });
}

if("serviceWorker" in navigator){

  navigator.serviceWorker.register("sw.js");
}
