const { parseFile, filterListOrders} = require('../services/orderProcessor');

let cachedData = [];

/**
 * 
 * Responsável por:
 * - Receber o arquivo .txt enviado via multipart/form-data
 * - Validar a presença do arquivo
 * - Delegar o processamento para o orderProcessor
 * - Retornar a estrutura de pedidos normalizada como resposta
 *
 * @param {object} req - Objeto da requisição Express, contendo o arquivo em req.file
 * @param {object} res - Objeto da resposta Express
 * @returns {void}
 */

const uploadFile = async (req, res, next) => {
  try {
    if (!req.file || !req.file.originalname.endsWith('.txt')) {
      return res.status(400).json({ error: 'Arquivo inválido. Por gentileza, envie um .txt' });
    }
    cachedData = await parseFile(req.file.path);
    return res.status(200).json({ message: 'Upload processado com sucesso.', data: cachedData });
  } catch (err) {
    next(err);
  }
};


/**
 * Funcao para listar os pedidos com filtros opcionais
 */
const listOrders = (req, res, next) => {
  try {
    console.log('cachedData:', cachedData); 

    const { order_id, start_date, end_date } = req.query;
    const result = filterListOrders(cachedData, { order_id, start_date, end_date });
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
module.exports = { uploadFile, listOrders };