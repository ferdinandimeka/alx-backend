#!/usr/bin/node dev
/* eslint-disable consistent-return */
/* eslint-disable radix */
const express = require('express');
const redis = require('redis');
const { promisify } = require('util');

const client = redis.createClient();

client.on('error', (err) => {
  console.log(`Redis client not connected to the server: ${err}`);
});

client.on('connect', () => {
  console.log('Redis client connected to the server');
});

const listProducts = [
  {
    itemId: 1,
    itemName: 'Suitcase 250',
    price: 50,
    stock: 4,
  },
  {
    itemId: 2,
    itemName: 'Suitcase 450',
    price: 100,
    stock: 10,
  },
  {
    itemId: 3,
    itemName: 'Suitcase 650',
    price: 350,
    stock: 2,
  },
  {
    itemId: 4,
    itemName: 'Suitcase 1050',
    price: 550,
    stock: 5,
  },
];

const getItemById = (id) => {
  const item = listProducts.find((obj) => obj.itemId === id);

  if (item) {
    return Object.fromEntries(Object.entries(item));
  }
};

const app = express();
const PORT = 1245;

/**
 * Modifies the reserved stock for a given item.
 * @param {number} itemId - The id of the item.
 * @param {number} stock - The stock of the item.
 */
const reserveStockById = async (itemId, stock) => promisify(client.SET).bind(client)(`item.${itemId}`, stock);

/**
 * Retrieves the reserved stock for a given item.
 * @param {number} itemId - The id of the item.
 * @returns {Promise<String>}
 */
const getCurrentReservedStockById = async (itemId) => promisify(client.GET).bind(client)(`item.${itemId}`);

app.get('/list_products', (_, res) => {
  res.json(listProducts);
});

app.get('/list_products/:itemId(\\d+)', (req, res) => {
  const itemId = Number.parseInt(req.params.itemId);
  const productItem = getItemById(Number.parseInt(itemId));

  if (!productItem) {
    res.json({ status: 'Product not found' });
    return;
  }
  getCurrentReservedStockById(itemId)
    .then((result) => Number.parseInt(result || 0))
    .then((reservedStock) => {
      productItem.currentQuantity = productItem.stock - reservedStock;
      res.json(productItem);
    });
});

app.get('/reserve_product/:itemId', (req, res) => {
  const itemId = Number.parseInt(req.params.itemId);
  const productItem = getItemById(Number.parseInt(itemId));

  if (!productItem) {
    res.json({ status: 'Product not found' });
    return;
  }
  getCurrentReservedStockById(itemId)
    .then((result) => Number.parseInt(result || 0))
    .then((reservedStock) => {
      if (reservedStock >= productItem.stock) {
        res.json({ status: 'Not enough stock available', itemId });
        return;
      }
      reserveStockById(itemId, reservedStock + 1)
        .then(() => {
          res.json({ status: 'Reservation confirmed', itemId });
        });
    });
});

const resetProductsStock = () => Promise.all(
  listProducts.map(
    (item) => promisify(client.SET).bind(client)(`item.${item.itemId}`, 0),
  ),
);

app.listen(PORT, () => {
  resetProductsStock()
    .then(() => {
      console.log(`API available on localhost port ${PORT}`);
    });
});

export default app;
