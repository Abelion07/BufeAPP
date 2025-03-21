const express = require("express");
const mysql = require("mysql");
const bcrypt = require("bcryptjs");

const app = express();
const port = 8080;

const connection = mysql.createConnection({
  host: "sql7.freesqldatabase.com",
  user: "sql7769011",
  password: "ZKPtyqQVpu",
  database: "sql7769011",
  port: 3306
});

connection.connect();

app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.sendStatus(200);
});

// Default
app.get("/", (req, res) => {
  res.send("Welcome on my server!");
});

// Külön végpontok
app.get("/products", (req, res) => {
  connection.query(
    "SELECT * FROM products ORDER BY category, name ASC",
    (error, results) => {
      if (error) {
        res.status(500).json({ error: error.message });
      } else {
        res.json(results);
      }
    }
  );
});

app.get("/orders", (req, res) => {
  connection.query(
    `
    SELECT 
    megrendelesek.*, 
    products.name, 
    (megrendeles_tetelek.mennyiseg * products.price) AS total_price, 
    megrendeles_tetelek.mennyiseg AS quantity 
    FROM 
    megrendelesek 
    JOIN 
    megrendeles_tetelek ON megrendelesek.id = megrendeles_tetelek.order_id 
    JOIN 
    products ON megrendeles_tetelek.termek_id = products.id
    WHERE Kesz != 1;
    `,
    (error, results) => {
      if (error) {
        res.status(500).json({ error: error.message });
      } else {
        res.json(results);
      }
    }
  );
});

// Termék hozzáadása
app.post("/products", (req, res) => {
  const { name, price, category, pictureurl } = req.body;
  const sql =
    "INSERT INTO products (name, price, category, pictureurl) VALUES (?, ?, ?, ?)";
  connection.query(
    sql,
    [name, parseInt(price), category, pictureurl],
    (error, result) => {
      if (error) {
        console.error("Hiba a hozzáadás során:", error);
        res.status(500).json({ error: "Hiba történt" });
      } else {
        res.json({ message: "Termék hozzáadva!", productId: result.insertId });
      }
    }
  );
});

// Termék törlése
app.delete("/products/:id", (req, res) => {
  const productID = req.params.id;
  const sql = "DELETE FROM products WHERE id = ?";
  connection.query(sql, [productID], (error, result) => {
    if (error) {
      console.error("Hiba a törlés során:", error);
      res.status(500).json({ error: "Hiba történt" });
    } else {
      res.json({ message: "Termék törölve!", deletedId: productID });
    }
  });
});

// Megrendelés leadása
app.put("/orders/:id", (req, res) => {
  const orderID = req.params.id;
  const sql = "UPDATE megrendelesek SET Kesz = 1 WHERE id = ?";
  connection.query(sql, [orderID], (error, result) => {
    if (error) {
      console.error("Hiba a frissítés során:", error);
      res.status(500).json({ error: "Hiba történt" });
    } else {
      res.json({ message: "Megrendelés frissítve!", updatedId: orderID });
    }
  });
});

// Rendelés hozzáadása
app.post("/addOrders", (req, res) => {
  const { nev, email, szunet, fizetes, cart } = req.body;
  const sqlOrder =
    "INSERT INTO megrendelesek (megrendelo, email, szunet, fizetes) VALUES (?, ?, ?, ?)";
  connection.query(sqlOrder, [nev, email, szunet, fizetes], (error, result) => {
    if (error) {
      console.error("Hiba a rendelés beszúrása során:", error);
      res
        .status(500)
        .json({ error: "Hiba történt a rendelés beszúrása során" });
    } else {
      const orderId = result.insertId;

      // Ezután beszúrjuk a kosár tartalmát a megrendeles_tetelek táblába
      const sqlOrderItems =
        "INSERT INTO megrendeles_tetelek (order_id, termek_id, mennyiseg) VALUES ?";
      const orderItems = cart.map((item) => [orderId, item.id, item.quantity]);

      connection.query(sqlOrderItems, [orderItems], (error, result) => {
        if (error) {
          console.error("Hiba a rendelés tételeinek beszúrása során:", error);
          res.status(500).json({
            error: "Hiba történt a rendelés tételeinek beszúrása során",
          });
        } else {
          res.json({ message: "Rendelés sikeresen leadva!" });
        }
      });
    }
  });
});

// Bejelentkezés
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const sql = "SELECT * FROM felhasznalok WHERE username = ?";
  connection.query(sql, [username], (error, results) => {
    if (error) {
      console.error("Hiba a bejelentkezés során:", error);
      return res.status(500).json({ error: "Szerverhiba" });
    }

    if (results.length === 0) {
      return res
        .status(401)
        .json({ success: false, message: "Hibás felhasználónév vagy jelszó" });
    }

    const foundUser = results[0];

    if (password === foundUser.pw) {
      // Csak sima string-összehasonlítás
      return res.json({ success: true });
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Hibás felhasználónév vagy jelszó" });
    }
  });
});

app.get("/felhasznaloklekeres", (req, res) => {
  connection.query(
    "SELECT * FROM felhasznalok",
    (error, results) => {
      if (error) {
        res.status(500).json({ error: error.message });
      } else {
        res.json(results);
      }
    }
  );
});

app.post("/addUser", (req, res) => {
  const { username, pw } = req.body;
  const sql =
    "INSERT INTO felhasznalok (username, pw) VALUES (?, ?)";
  connection.query(
    sql,
    [username, pw],
    (error, result) => {
      if (error) {
        console.error("Hiba a hozzáadás során:", error);
        res.status(500).json({ error: "Hiba történt" });
      } else {
        res.json({ message: "Felhasználó hozzáadva!", productId: result.insertId });
      }
    }
  );
});

app.delete("/users/:id", (req, res) => {
  const productID = req.params.id;
  const sql = "DELETE FROM felhasznalok WHERE id = ?";
  connection.query(sql, [productID], (error, result) => {
    if (error) {
      console.error("Hiba a törlés során:", error);
      res.status(500).json({ error: "Hiba történt" });
    } else {
      res.json({ message: "Felhasználó törölve!", deletedId: productID });
    }
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
