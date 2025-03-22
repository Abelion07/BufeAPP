const addbtn = document.querySelector('.addbtn')
        addbtn.addEventListener('click', () => {
            const productname = document.getElementById("name").value.trim();
            const productprice = parseFloat(document.getElementById("price").value);
            const productcategory = document.getElementById("category").value.trim();
            const producturl = document.getElementById("pictureurl").value.trim();

            if (!productname || !productcategory || !producturl || isNaN(productprice) || productprice <= 0) {
                alert("Kérlek, töltsd ki helyesen az összes mezőt, és érvényes árat adj meg!");
                return;
            }

            addProduct(productname, productprice, productcategory, producturl);
        })

        fetch('http://localhost:8080/products')
            .then(response => response.json())
            .then(data => {
                getproducts(data);
            })

        const termekek = document.querySelector('.termekek')
        function getproducts(products) {
            products.forEach(product => {
                // console.log(product.name);
                const row = document.createElement('tr');
                row.innerHTML = `
                <td>${product.name}</td>
                <td>${product.price}</td>
                <td>${product.category}</td>
                <td>${product.pictureurl}</td>
                <td><button onclick ='deleteProduct(${product.id})'>Törlés</button></td>
                `
                termekek.appendChild(row);
            });
        }

        function addProduct(name, price, category, pictureurl) {
            fetch("http://localhost:8080/products", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    price: price,
                    category: category,
                    pictureurl: pictureurl
                })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.error) {
                        alert("Hiba történt a hozzáadás során: " + data.error);
                    } else {
                        alert('Termék hozzáadva!');
                        location.reload();
                    }
                })
                .catch(error => console.error('Hiba:', error));
        }

        function deleteProduct(productID) {
            if (confirm("Biztosan törölni szeretnéd?")) {
                fetch(`http://localhost:8080/products/${productID}`, {
                    method: 'DELETE'
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.error) {
                            alert("Hiba történt a törlés során: " + data.error);
                        } else {
                            alert('Termék törölve!');
                            location.reload();
                        }
                    })
                    .catch(error => console.error('Hiba:', error));
            }
        }