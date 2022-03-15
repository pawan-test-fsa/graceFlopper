const pool = require('./pool')

async function createOrderByUserId(userId) {
  const { rows } = await pool.query(
    `
            INSERT INTO orders("userId")
                VALUES($1)
                RETURNING * 
        `,
    [userId]
  )

  console.log('ROWWWWSSSS', rows)
  const [cart] = mapTheRows(rows)
  console.log('CART', cart)
  return cart
}

async function getAllOrders() {
  const { rows } = await pool.query(`
    SELECT 
      orders.id,
      orders."userId" as "userId",
      orders."isActive",
      orders_products."productId" as "productId",
      orders_products.qty as "qty",
      products.name as "productName",
      products.description as "description",
      products.price as "price"
    FROM orders
    JOIN orders_products 
    ON orders.id = orders_products."orderId"
    JOIN products
    ON orders_products."productId" = products.id
    `)
  return mapTheRows(rows)
}

function mapTheRows(rows) {
  const mappedOrders = {}

  for (const row of rows) {
    if (!mappedOrders[row.id]) {
      mappedOrders[row.id] = {
        orderId: row.id,
        userId: row.userId,
        isActive: row.isActive,
        items: [],
      }
      if (row.productId) {
        mappedOrders[row.id].items.push({
          productId: row.productId,
          qty: row.qty,
          productName: row.productName,
          description: row.description,
          price: row.price,
        })
      }
    } else {
      if (row.productId) {
        mappedOrders[row.id].items.push({
          productId: row.productId,
          qty: row.qty,
          productName: row.productName,
          description: row.description,
          price: row.price,
        })
      }
    }
  }
  return Object.values(mappedOrders)
}

async function getOrderById(orderId) {
  const { rows } = await pool.query(
    `
      SELECT 
        orders.id,
        orders."userId" as "userId",
        orders."isActive",
        orders_products."productId" as "productId",
        orders_products.qty as "qty",
        products.name as "productName",
        products.description as "description",
        products.price as "price"
      FROM orders
      FULL JOIN orders_products 
      ON orders.id = orders_products."orderId"
      FULL JOIN products
      ON orders_products."productId" = products.id 
     	WHERE orders.id = $1 
    `,
    [orderId]
  )

  console.log(rows)
  const [mappedOrder] = mapTheRows(rows)
  return mappedOrder
}

async function getAllOrdersByUserId(userId) {
  const { rows } = await pool.query(
    `
      SELECT 
        orders.id,
        orders."userId" as "userId",
        orders."isActive",
        orders_products."productId" as "productId",
        orders_products.qty as "qty",
        products.name as "productName",
        products.description as "description",
        products.price as "price"
      FROM orders
      JOIN orders_products 
      ON orders.id = orders_products."orderId"
      JOIN products
      ON orders_products."productId" = products.id 
     	WHERE orders."userId" = $1   
    `,
    [userId]
  )
  return mapTheRows(rows)
}

// Get Cart (order that is active) and include everything
async function getCart(userId) {
  const { rows } = await pool.query(
    `
    SELECT 
      orders.id,
      orders."userId" as "userId",
      orders."isActive",
      orders_products."productId" as "productId",
      orders_products.qty as "qty",
      products.name as "productName",
      products.description as "description",
      products.price as "price"
    FROM orders
    FULL JOIN orders_products 
    ON orders.id = orders_products."orderId"
    FULL JOIN products
    ON orders_products."productId" = products.id 
    WHERE orders."userId" = $1 and orders."isActive" = true 
    `,
    [userId]
  )
  const [mappedOrder] = mapTheRows(rows)
  return mappedOrder
}

async function purchaseCart(orderId) {
  const {
    rows: [order],
  } = await pool.query(
    `
      UPDATE orders
        SET "isActive"=false
        WHERE id=$1
        RETURNING *
    `,
    [orderId]
  )
  return order
}

async function deleteOrderById(orderId) {
  const {
    rows: [deletedOrder],
  } = await pool.query(
    `
      DELETE FROM orders
        WHERE id=$1
        RETURNING *
    `,
    [orderId]
  )

  return deletedOrder
}

module.exports = {
  createOrderByUserId,
  getOrderById,
  getAllOrdersByUserId,
  getCart,
  getAllOrders,
  deleteOrderById,
  purchaseCart,
}
