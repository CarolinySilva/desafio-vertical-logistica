const { filterListOrders } = require('../../services/orderProcessor');

const mockData = [
  {
    user_id: 1,
    name: 'Carol',
    orders: [
      { order_id: 200, date: '2022-03-15', total: '350.50', products: [] },
      { order_id: 201, date: '2022-07-20', total: '470.00', products: [] }
    ]
  },
  {
    user_id: 2,
    name: 'Lucas',
    orders: [
      { order_id: 300, date: '2022-05-10', total: '100.00', products: [] }
    ]
  }
];

describe('filterListOrders', () => {
  it('should filter by order_id', () => {
    const result = filterListOrders(mockData, { order_id: '200' });
    expect(result).toHaveLength(1);
    expect(result[0].orders).toHaveLength(1);
    expect(result[0].orders[0].order_id).toBe(200);
  });

  it('should filter by start_date and end_date', () => {
    const result = filterListOrders(mockData, { start_date: '2022-03-01', end_date: '2022-06-01' });
    expect(result).toHaveLength(2);
    expect(result[0].orders).toHaveLength(1);
    expect(result[0].orders[0].order_id).toBe(200);
    expect(result[1].orders).toHaveLength(1);
    expect(result[1].orders[0].order_id).toBe(300);
  });

  it('should filter by user_id', () => {
    const result = filterListOrders(mockData, { user_id: '2' });
    expect(result).toHaveLength(1);
    expect(result[0].user_id).toBe(2);
  });

  it('should return empty array if no orders match', () => {
    const result = filterListOrders(mockData, { order_id: '999' });
    expect(result).toHaveLength(0);
  });
});
