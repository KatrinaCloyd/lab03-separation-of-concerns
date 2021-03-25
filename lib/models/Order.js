const pool = require('../utils/pool');

// static methods -> Order.insert(): Math.random(), Number.parseInt(), JSON.stringify()
// instance methods -> arr.map(), params.get('code')
module.exports = class Order {
  id;
  quantity;

  constructor(row) {
    this.id = row.id;
    this.quantity = row.quantity;
  }

  static async insert(order) {
    const { rows, } = await pool.query(
      'INSERT INTO orders (quantity) VALUES ($1) RETURNING *',
      [order.quantity]
    );

    return new Order(rows[0]);
  }

  static async put(quantity, id) {
    const { rows, } = await pool.query('UPDATE orders SET quantity = $1 WHERE id = $2 RETURNING *',
      [quantity, id]);

    return new Order(rows[0]);
  }

  static async get() {
    const rows = await pool.query(
      'SELECT * from orders',
    );
    return rows;
  }

  static async getById(id) {
    const { rows, } = await pool.query(
      `SELECT * from orders WHERE id=$1`, [id]
    );
    return new Order(rows[0]);
  }

  static async delete(id) {
    const { rows, } = await pool.query(
      'DELETE from orders WHERE id=$1 RETURNING *', [id]
    );
    return new Order(rows[0]);
  }
};
