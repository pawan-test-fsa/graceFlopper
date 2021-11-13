import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { cartContext } from "../context/cartContext";
import { userContext } from "../context/userContext";
function Products(props) {
  const { cartState, cartDispatch } = useContext(cartContext);
  const { userState } = useContext(userContext);

  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function getProducts() {
      const response = await fetch("/api/products");
      const data = await response.json();
      setProducts(data);
    }
    getProducts();
    console.log(userState);
  }, []);

  async function addToCart(productId) {
    const item = cartState.items.filter((item) => item.id === productId);
    if (item.length) {
      const response = await axios.put(`/api/orders_products/`, {
        productId,
        orderId: userState.user.cartId,
        qty: item.qty + 1,
      });
    } else {
      const response = await axios.post(`/api/orders_products/`, {
        productId,
        orderId: userState.user.cartId,
        qty: 1,
      });
    }
  }

  const prods = products.map((product) => {
    return (
      <div key={product.id}>
        <h2>{product.name}</h2>
        <ul>
          <li>{product.description}</li>
          <li>{product.price}</li>
        </ul>
        {cartState.items &&
        cartState.items.filter((item) => item.id === product.id).length ? (
          <h1>Already in Cart</h1>
        ) : (
          <button onClick={() => addToCart(product.id)}>Add to Cart</button>
        )}
      </div>
    );
  });

  return <div>{prods}</div>;
}

export default Products;
