document.addEventListener('DOMContentLoaded', () => {
    fetch('products.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            const productList = document.getElementById('product-list');
            data.forEach(product => {
                const productItem = document.createElement('div');
                productItem.className = 'product';
                productItem.innerHTML = `
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p>Price: $${product.price.toFixed(2)}</p>
                    <button onclick="addToCart(${product.id})">Add to Cart</button>
                `;
                productList.appendChild(productItem);
            });
        })
        .catch(error => console.error('Fetch error:', error));
});

let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(productId) {
    fetch('products.json')
        .then(response => response.json())
        .then(products => {
            const product = products.find(p => p.id === productId);
            cart.push(product);
            localStorage.setItem('cart', JSON.stringify(cart));
            displayCart();
        })
        .catch(error => console.error('Add to cart fetch error:', error));
}

function removeFromCart(productId) {
    cart = cart.filter(product => product.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
}

function clearCart() {
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
}

function displayCart() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';
    let total = 0;
    cart.forEach(product => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div>
                <h4>${product.name}</h4>
                <p>Price: $${product.price.toFixed(2)}</p>
            </div>
            <button onclick="removeFromCart(${product.id})">Remove</button>
        `;
        cartItems.appendChild(cartItem);
        total += product.price;
    });
    document.getElementById('total-price').textContent = total.toFixed(2);
}

document.getElementById('clear-cart').addEventListener('click', clearCart);

displayCart();
