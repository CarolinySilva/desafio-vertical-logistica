const { processUploadedFile, filterListOrders } = require('../services/orderProcessor');
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
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded. Please send a .txt file.' });
    }

    if (!req.file.originalname.endsWith('.txt')) {
      return res.status(400).json({ message: 'Invalid file type. Only .txt files are accepted.' });
    }

    const orders = await processUploadedFile(req.file.path);
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

    const filtered = filterListOrders(cached, req.query);
    res.status(200).json(filtered);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  uploadFile,
  listOrders
};
