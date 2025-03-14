var http = require('http');
var mysql = require('mysql');

var connection = mysql.createConnection({
    host     : '127.0.0.1',
    user     : 'root',
    password : '',
    database : 'bufeDB'
});

connection.connect();

function getDatabaseData() {
    let queries = [
        'SELECT * FROM products ORDER BY name ASC',
        'SELECT * FROM orders',
        'SELECT * FROM customers'
    ];

    let promises = queries.map(query => {
        return new Promise((resolve, reject) => {
            connection.query(query, (error, results) => {
                if (error) reject(error);
                resolve(results);
            });
        });
    });

    return Promise.all(promises).then(results => {
        return {
            products: results[0],
            orders: results[1],
            customers: results[2]
        };
    });
}

http.createServer(async function (req, res) {
    res.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' 
    });
    try {
        let data = await getDatabaseData(); // Meghívja a függvényt és lekéri az adatokat
        res.write(JSON.stringify(data));
    } catch (error) {
        res.write(JSON.stringify({ error: error.message }));
    }
    res.end();
}).listen(8080, () => {
    console.log("Server running at http://localhost:8080");
    
});