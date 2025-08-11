jest.mock('../../services/orderProcessor', () => ({
  filterListOrders: jest.fn(),
  processUploadedFile: jest.fn(),
}));

const { filterListOrders } = require('../../services/orderProcessor');
const orderHandler = require('../../controllers/orderHandler');
const cache = require('../../utils/cache');

describe('orderHandler.listOrders', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return filtered orders if cache exists', async () => {
    const cachedData = [{ user_id: 1, name: 'Carol', orders: [] }];
    filterListOrders.mockReturnValue(cachedData);

    jest.spyOn(cache, 'get').mockReturnValue(cachedData);

    const req = { query: { user_id: '1' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    await orderHandler.listOrders(req, res, next);

    expect(filterListOrders).toHaveBeenCalledWith(cachedData, {
      order_id: undefined,
      start_date: undefined,
      end_date: undefined,
      user_id: "1",
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(cachedData);
    expect(next).not.toHaveBeenCalled();
  });
});
