const elkuld = document.querySelector(".elkuld");
elkuld.addEventListener("click", () => {
  const nev = document.getElementById("nev").value;
  const email = document.getElementById("email").value;
  const szunet = document.getElementById("szunet").value;
  const fizetes = document.getElementById("fizetes").value;
  const cart = JSON.parse(localStorage.getItem("cart") || []);

  if (cart.length === 0) {
    alert("A kosár tartalma üres");
    return;
  }

  const orderData = {
    nev,
    email,
    szunet,
    fizetes,
    cart,
  };

  fetch("https://bufeapp.onrender.com/addOrders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData),
  })
    .then((response) => response.json()) // Corrected this line
    .then((data) => {
      if (data.error) {
        alert("Hiba történt a rendelés leadása során: " + data.error);
      } else {
        alert("Rendelés sikeresen leadva!");
        localStorage.removeItem("cart");
        window.location.href = "index.html";
      }
    });
});
