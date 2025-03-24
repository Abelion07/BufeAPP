fetch("https://bufeapp.onrender.com/orders")
  .then((response) => response.json())
  .then((data) => {
    tablazatFeltoltes(data);
  });

function tablazatFeltoltes(data) {
  const tablazat = document.querySelector(".tablazat");
  const processedIds = new Set(); // Set a feldolgozott id-k nyomon követésére

  data.forEach((element) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${element.megrendelo}</td>
            <td>${element.email}</td>
            <td>${element.leadas_idopont}</td>
            <td>${element.szunet}.</td>
            <td>${element.name}</td>
            <td>${element.quantity} db</td>
            <td>${element.total_price}</td>
            <td>${element.fizetes}</td>
        `;

    if (!processedIds.has(element.id)) {
      const buttonCell = document.createElement("td");
      const button = document.createElement("button");
      button.innerText = "Leadás";
      button.onclick = () => leadas(element.id);
      buttonCell.appendChild(button);
      row.appendChild(buttonCell);

      processedIds.add(element.id);
    } else {
      const emptyCell = document.createElement("td");
      row.appendChild(emptyCell);
    }

    tablazat.appendChild(row);
  });
}

function leadas(orderID) {
  if (confirm("Biztosan le szeretnéd adni a megrendelést?")) {
    fetch(`https://bufeapp.onrender.com/orders/${orderID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderID: orderID }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          alert("Hiba történt a frissítés során: " + data.error);
        } else {
          alert("Megrendelés frissítve!");
          location.reload();
        }
      })
      .catch((error) => console.error("Hiba:", error));
  }
}
