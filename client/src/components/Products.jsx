import React, { useState, useEffect, useContext } from "react";

function Products(props) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function getProducts() {
      const response = await fetch("/api/products");
      const data = await response.json();
      setProducts(data);
    }
    getProducts();
  }, []);

  const prods = products.map((product) => {
    return (
      <div key={product.id}>
        <h2>{product.name}</h2>
        <ul>
          <li>{product.description}</li>
          <li>{product.price}</li>
        </ul>
      </div>
    );
  });

  return <div>{prods}</div>;
}

export default Products;
