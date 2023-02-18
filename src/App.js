import React, { useState, useEffect } from 'react';
import StripeCheckout from 'react-stripe-checkout';

const productsUrl = 'http://localhost:8000/products';
const ordersUrl = 'http://localhost:8000/orders';
const stripeApiKey = 'your_stripe_api_key';

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(productsUrl);
      const products = await res.json();
      setProducts(products);
    }

    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(ordersUrl);
      const orders = await res.json();
      setCart(orders);
    }

    fetchData();
  }, []);

  const handleAddToCart = async (productId) => {
    const res = await fetch(`${productsUrl}/${productId}`, {
      method: 'POST',
    });
    const updated = await fetch(ordersUrl);
    const orders = await updated.json();
    setCart(orders);
  };

  const handleToken = async (token, addresses) => {
    const response = await fetch(ordersUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, cart }),
    });
    const data = await response.json();
    console.log(data);
    setCart([]);
  };

  return (
    <div>
      <h2>Products</h2>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.id} - ${product.name}
            <button onClick={() => handleAddToCart(product.id)}>
              Add to cart
            </button>
          </li>
        ))}
      </ul>
      <h2>Cart</h2>
      <ul>
        {cart.map((product) => (
          <li key={product.id}>
            {product.customer_id} - {product.product_id}
          </li>
        ))}
      </ul>
      <StripeCheckout
        stripeKey={stripeApiKey}
        token={handleToken}
        billingAddress
        shippingAddress
        amount={cart.reduce((acc, product) => acc + product.price, 0) * 100}
        name="My Awesome Shop"
        description="Buy these awesome products!"
      >
        <button>Checkout</button>
      </StripeCheckout>
    </div>
  );
}

export default App;