const { Router } = require('express');
const Order = require('../models/Order');
const OrderService = require('../services/OrderService');
const pool = require('../utils/pool');

module.exports = Router()
  .post('/', async (req, res, next) => {
    try {
      const order = await OrderService.create(req.body);
      res.send(order);
    } catch (err) {
      next(err);
    }
  })

  .get('/', async (req, res, next) => {
    try {
      const orders = await Order.get();
      res.send(orders.rows);
    } catch (err) {
      next(err);
    }
  })

  .get('/:id', async (req, res, next) => {
    try {
      const order = await Order.getById(req.params.id)
      res.send(order);
    } catch (err) {
      next(err);
    }
  })

  .put('/:id', async (req, res, next) => {
    try {
      const order = await pool.query('UPDATE orders SET quantity = $1 WHERE id = $2 RETURNING *',
        [
          req.body.quantity,
          req.params.id
        ]);
      res.send(order.rows[0]);
    } catch (err) {
      next(err);
    }
  })

  .delete('/:id', async (req, res, next) => { });
