const termekek_lista = document.querySelector('.termekek-lista');
const kosarbtn = document.querySelector('.kosarbtn');
const kosarWindow = document.querySelector('.kosarban')

fetch('http://localhost:8080/products')
.then(response => response.json())
.then(data => {
    termekKiiras(data);
})

function termekKiiras(csomag) {
    csomag.forEach(item => {
        const termek = document.createElement('div');
        termek.innerHTML = `<h2>${item.name}</h2><p>${item.price} Ft</p><img src="foods-pics/${item.pictureurl}" class="termek-kep">`
        termek.classList.add("termek");
        const kosarba_btn = document.createElement('button');
        kosarba_btn.innerText = "Kosárba";
        kosarba_btn.classList.add("kosárba-btn");
        kosarba_btn.setAttribute('data-id', item.id);
        termek.appendChild(kosarba_btn);
        termekek_lista.appendChild(termek);
    });
}

kosarbtn.addEventListener('click', () => {
    kosarWindow.classList.toggle('kosarban-close');
    kosarWindow.classList.toggle('kosarban-open');
})

const kosarbagombok = document.querySelectorAll('.kosárba-btn');
kosarbagombok.forEach(element => {
    element.addEventListener('click', () => {
        console.log(element.getAttribute());
        
    })
});