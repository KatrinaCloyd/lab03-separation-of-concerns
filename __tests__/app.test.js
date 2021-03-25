const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const Order = require('../lib/models/Order');

jest.mock('../lib/utils/twilio');
const twilio = require('../lib/utils/twilio');

jest.mock('twilio', () => () => ({
  messages: {
    create: jest.fn(),
  },
}));

describe('03_separation-of-concerns routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  beforeEach(() => {
    twilio.sendSms.mockReset();
  });


  it('creates a new order in our database and sends a text message', async () => {
    return request(app)
      .post('/api/v1/orders')
      .send({ quantity: 10 })
      .then((res) => {
        expect(twilio.sendSms).toHaveBeenCalledTimes(1);
        expect(res.body).toEqual({
          id: '1',
          quantity: 10,
        });
      });
  });

  it('ASYNC/AWAIT: creates a new order in our database and sends a text message', async () => {
    const res = await request(app)
      .post('/api/v1/orders')
      .send({ quantity: 10 });

    expect(res.body).toEqual({
      id: '1',
      quantity: 10,
    });
  });

  it('gets all orders in our database', async () => {
    await Order.insert({ quantity: 5 });
    await Order.insert({ quantity: 12 });
    return request(app)
      .get('/api/v1/orders')
      .then((res) => {
        expect(res.body).toEqual([{
          id: '1',
          quantity: 5,
        },
        {
          id: '2',
          quantity: 12,
        },
        ]);
      });
  });

  it('gets a single order by id', async () => {
    await Order.insert({ quantity: 5 });
    return request(app)
      .get('/api/v1/orders/1')
      .then((res) => {
        expect(res.body).toEqual({
          id: '1',
          quantity: 5,
        });
      });
  });

  it('updates an order quantity and sends an update text message', async () => {
    await Order.insert({ quantity: 5 });
    return request(app)
      .put('/api/v1/orders/1')
      .send({ quantity: 321 })
      .then((res) => {
        expect(twilio.sendSms).toHaveBeenCalledTimes(1);
        expect(res.body).toEqual({
          id: '1',
          quantity: 321,
        });
      });
  });

  it('deletes an order by its id', async () => {
    await Order.insert({ quantity: 17 });
    return request(app)
      .delete('/api/v1/orders/1')
      .then((res) => {
        expect(twilio.sendSms).toHaveBeenCalledTimes(1);
        expect(res.body).toEqual({
          id: '1',
          quantity: 17,
        });
      });
  });

  it('deletes an order by its id and checks that get all orders is now empty', async () => {
    await Order.insert({ quantity: 17 });
    await Order.delete(1);
    return request(app)
      .get('/api/v1/orders')
      .then((res) => {
        expect(res.body).toEqual([]);
      });
  });

});
