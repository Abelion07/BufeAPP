fetch("http://localhost:8080/orders")
  .then((response) => response.json())
  .then((data) => {
    tablazatFeltoltes(data);
  });

function tablazatFeltoltes(data) {
  data.forEach((element) => {
    const tablazat = document.querySelector(".tablazat");

    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${element.id}</td>
            <td>${element.megrendelo}</td>
            <td>${element.email}</td>
            <td>${element.termekneve}</td>
            <td>${element.create_time}</td>
            <td>${element.szunet}</td>
            <td>${element.kp}</td>
            <td>${element.db}</td>
            <td>${element.price}</td>
            <td>${element.Kész}</td>
            <td><button onclick="leadas(${element.id})">Leadás</button></td>
        `;
    tablazat.appendChild(row);
  });
}

function leadas(orderID) {
  if (confirm("Biztosan le szeretnéd adni a megrendelést?")) {
    fetch(`http://localhost:8080/orders/${orderID}`, {
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
