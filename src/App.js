import React, { useState, useEffect } from 'react';

const productsUrl = 'http://localhost:8000/products';
const ordersUrl = 'http://localhost:8000/orders';

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
    console.log(res)
    const updated = await fetch(ordersUrl);
    const orders = await updated.json();
    setCart(orders);
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
      <h2>Purchase</h2>
      <ul>
        {cart.map((product) => (
                  <li key={product.id}>
            {product.customer_id} - { product.product_id}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
