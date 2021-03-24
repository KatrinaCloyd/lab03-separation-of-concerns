const Order = require('../models/Order');
const { sendSms } = require('../utils/twilio');

module.exports = class OrderService {

  static async get() {
    const orders = await Order.get();
    return orders;
  }

  static async getById(id) {
    const orders = await Order.getById(id);
    return orders;
  }

  static async create({ quantity }) {
    await sendSms(
      process.env.ORDER_HANDLER_NUMBER,
      `New Order received for ${quantity}`
    );

    const order = await Order.insert({ quantity });

    return order;
  }
};
