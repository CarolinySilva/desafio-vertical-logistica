const { processUploadedFile } = require('../services/orderProcessor');
const cache = require('../utils/cache');

/**
 * Controlador responsável por processar o upload do arquivo.
 * 
 * Recebe o arquivo enviado, processa os dados de pedidos,
 * e armazena os resultados em cache para consultas futuras.
 *
 * @param {object} req - Objeto da requisição contendo o arquivo.
 * @param {object} res - Objeto da resposta para enviar ao cliente.
 * @param {function} next - Função para encaminhar erros.
 */
async function uploadFile(req, res, next) {
  try {
    const filePath = req.file.path;
    const orders = await processUploadedFile(filePath);

    cache.set('cachedOrders', orders);

    res.status(200).json({ 
      message: 'File processed successfully.',
      data: orders
    });
    
  } catch (error) {
    next(error);
  }
}

/**
 * Controlador responsável por listar os pedidos processados.
 * 
 * Recupera dados do cache e aplica filtros opcionais por user_id, order_id e data,
 * caso fornecidos via query string.
 * Caso não haja dados em cache, retorna erro solicitando upload prévio.
 *
 * @param {object} req - Objeto da requisição contendo filtros na query.
 * @param {object} res - Objeto da resposta para enviar ao cliente.
 * @param {function} next - Função para encaminhar erros.
 */
async function listOrders(req, res, next) {
  try {
    const cached = cache.get('cachedOrders');

    if (!cached) {
      return res.status(404).json({ message: 'No data found. Please upload the file first.' });
    }

    let filtered = cached;
    const { user_id, order_id, date } = req.query;

    if (user_id) {
      filtered = filtered.filter(user => String(user.user_id) === String(user_id));
    }

    if (order_id) {
      filtered = filtered
        .map(user => ({
          ...user,
          orders: user.orders.filter(order => String(order.order_id) === String(order_id))
        }))
        .filter(user => user.orders.length > 0);
    }

    if (date) {
      filtered = filtered
        .map(user => ({
          ...user,
          orders: user.orders.filter(order => order.date === date)
        }))
        .filter(user => user.orders.length > 0);
    }

    res.status(200).json(filtered);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  uploadFile,
  listOrders
};
