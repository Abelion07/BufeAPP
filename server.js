const express = require("express");
const mysql = require("mysql");

const app = express();
const port = 8080;

const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "bufeDB",
});

connection.connect();

app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS"); // ← Itt engedélyezzük a DELETE metódust
  next();
});

app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.sendStatus(200);
});

//Default
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
  connection.query("SELECT megrendelesek.*, products.price FROM megrendelesek JOIN products on megrendelesek.termekneve = products.name", (error, results) => {
    if (error) {
      res.status(500).json({ error: error.message });
    } else {
      res.json(results);
    }
  });
});

app.get("/users", (req, res) => {
  connection.query("SELECT * FROM users", (error, results) => {
    if (error) {
      res.status(500).json({ error: error.message });
    } else {
      res.json(results);
    }
  });
});

app.post("/products", (req, res) => {
    const { name, price, category, pictureurl } = req.body;
    const sql = "INSERT INTO products (name, price, category, pictureurl) VALUES (?, ?, ?, ?)";
    connection.query(sql, [name, parseInt(price), category, pictureurl], (error, result) => {
      if (error) {
        console.error("Hiba a hozzáadás során:", error);
        res.status(500).json({ error: "Hiba történt" });
      } else {
        res.json({ message: "Termék hozzáadva!", productId: result.insertId });
      }
    });
  });

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

app.post("/oders/:id", (req, res) => {
  const productID = req.params.id;
  const sql = "UPDATE megrendelesek SET Kész = 1 WHERE id = ?";
  connection.query(sql, [productID], (error, result) => {
    if (error) {
      console.error("Hiba a törlés során:", error);
      res.status(500).json({ error: "Hiba történt" });
    } else {
      res.json({ message: "Termék törölve!", deletedId: productID });
    }
  })
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
