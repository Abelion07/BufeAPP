updateCartDisplay();
const deleteCartBtn = document.querySelector('.delete-Cart-Btn');
deleteCartBtn.addEventListener('click', () => {
    deleteCart();
});

function addtocart(termek) {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');

    const existingProduct = cart.find(item => item.id === termek.id);
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        termek.quantity = 1;
        cart.push(termek);
    }
    localStorage.setItem('cart', JSON.stringify(cart));

    updateCartDisplay();
}

function updateCartDisplay() {
    const kosartartalom = document.querySelector('.kosartartalom');
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    let ossz = 0;
    
    kosartartalom.innerHTML = '';

    cart.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('cart-item');
        itemDiv.innerHTML = `
            <p>${item.name}</p>
            <p>${item.price} Ft</p>
            <p>Mennyiség: ${item.quantity}</p>
        `;
        kosartartalom.appendChild(itemDiv);
        ossz += item.price * item.quantity; 
    });

    document.querySelector('.total').innerHTML = `Összesen: ${ossz} Ft`;
}

function deleteCart() {
    localStorage.removeItem('cart'); 
    updateCartDisplay(); 
}