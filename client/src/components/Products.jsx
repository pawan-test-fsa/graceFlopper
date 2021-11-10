import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { store } from "../state";
function Products(props) {
  const { state, dispatch } = useContext(store);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function getProducts() {
      const response = await fetch("/api/products");
      const data = await response.json();
      setProducts(data);
    }
    getProducts();
  }, []);

  const addToCart = async (prodId) => {
    if (!state.cart) {
      return;
    }
    const [currentItem] = state.cart.filter(
      (item) => item.productId === prodId
    );
    console.log(currentItem);
    if (currentItem) {
      await axios.put("/api/orders_products", {
        productId: prodId,
        orderId: currentItem.orderId,
        qty: currentItem.qty + 1,
      });
    } else {
      const { data } = await axios.post("/api/orders_products", {
        productId: prodId,
        orderId: state.cart[0].orderId,
        qty: 1,
      });
    }
  };

  const prods = products.map((product) => {
    return (
      <div key={product.id}>
        <h2>{product.name}</h2>
        <ul>
          <li>{product.description}</li>
          <li>{product.price}</li>
        </ul>
        <button onClick={() => addToCart(product.id)}>Add to Cart</button>
      </div>
    );
  });

  return <div>{prods}</div>;
}

export default Products;
