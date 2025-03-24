const adatok = document.querySelector(".adatok");

fetch("https://bufeapp.onrender.com/felhasznaloklekeres")
  .then((response) => response.json())
  .then((data) => {
    feltoltes(data);
  });

function feltoltes(data) {
  data.forEach((element) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${element.id}</td> 
            <td>${element.username}</td> 
            <td>${element.pw}</td>
            <td><button id="removeuserbtn" onclick="removeUser(${element.id})">Törlés</button></td>
        `;
    adatok.appendChild(row);
  });
}

const addbtn = document.querySelector(".addbtn");

addbtn.addEventListener("click", () => {
  let username = document.getElementById("username").value;
  let pw = document.getElementById("pw").value;
  if (username != "" && pw != "") {
    fetch("https://bufeapp.onrender.com/addUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, pw }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          alert("Hiba történt a frissítés során: " + data.error);
        } else {
          alert("Felhasználók frissítve!");
          location.reload();
        }
      });
  } else {
    alert("Kérem, töltse ki a mezőket!");
  }
});

function removeUser(userid) {
  if (confirm("Biztosan törölni szeretnéd?")) {
    fetch(`https://bufeapp.onrender.com/users/${userid}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          alert("Hiba történt a törlés során: " + data.error);
        } else {
          alert("Felhasználó törölve!");
          location.reload();
        }
      })
      .catch((error) => console.error("Hiba:", error));
  }
}
