const termekek_lista = document.querySelector(".termekek-lista");
const kosarbtn = document.querySelector(".kosarbtn");
const kosarWindow = document.querySelector(".kosarban");
const categoryList = document.querySelector(".category-list");

fetch("http://localhost:8080/products")
  .then((response) => response.json())
  .then((data) => {
    termekKiiras(data, "Gyümölcs"); //Default
    createCategoryList(data);
  });

function termekKiiras(csomag, selectedCategory = "Gyümölcs") {
  termekek_lista.innerHTML = "";
  const categories = {};

  // Csoportosítás kategóriák szerint
  csomag.forEach((item) => {
    if (!categories[item.category]) {
      categories[item.category] = [];
    }
    categories[item.category].push(item);
  });

  for (const category in categories) {
    if (selectedCategory && category !== selectedCategory) continue;

    const categoryDiv = document.createElement("div");
    categoryDiv.classList.add("category");

    categories[category].forEach((item) => {
      const termek = document.createElement("div");
      termek.innerHTML = `<h2>${item.name}</h2><p>${item.price} Ft</p><img src="foods-pics/${item.pictureurl}" class="termek-kep">`;
      termek.classList.add("termek");
      const kosarba_btn = document.createElement("button");
      kosarba_btn.innerText = "Kosárba";
      kosarba_btn.classList.add("kosárba-btn");
      kosarba_btn.setAttribute("data-id", item.id);
      kosarba_btn.addEventListener('click', () => {
        addtocart(item);
      })

      termek.appendChild(kosarba_btn);
      categoryDiv.appendChild(termek);
    });

    termekek_lista.appendChild(categoryDiv);
  }
}

function createCategoryList(csomag) {
  const categories = new Set();

  csomag.forEach((item) => {
    categories.add(item.category);
  });

  categories.forEach((category) => {
    const li = document.createElement("li");
    li.innerHTML = `<button class="categorybtn">${category}</button>`;
    li.addEventListener("click", () => {
      termekKiiras(csomag, category);
    });
    categoryList.appendChild(li);
  });
}

kosarbtn.addEventListener("click", () => {
  kosarWindow.classList.toggle("kosarban-close");
  kosarWindow.classList.toggle("kosarban-open");
});

document.addEventListener("click", (event) => {
  if (event.target.classList.contains("kosárba-btn")) {
    console.log(event.target.getAttribute("data-id"));
  }
});
