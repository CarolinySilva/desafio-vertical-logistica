const fileSystem = require('fs/promises');
const { extractRecordFromLine, groupOrdersByUser } = require('../utils/orderParser');

/**
 * Lê e processa o arquivo de texto legado.
 * 
 * Divide o conteúdo em linhas fixas de 95 caracteres, extrai os dados de cada linha,
 * e agrupa os pedidos por usuário, retornando a estrutura normalizada para uso na API.
 *
 * @param {string} filePath - Caminho do arquivo .txt a ser processado.
 * @returns {Promise<Array>} - Array com os pedidos normalizados agrupados por usuário.
 */
async function processUploadedFile(filePath) {
    const content = await fileSystem.readFile(filePath, 'utf-8');
    const lines = content.match(/.{1,95}/g);
    const parsed = lines.map(extractRecordFromLine);

    return groupOrdersByUser(parsed);
}

/**
 * Aplica filtros opcionais na lista de pedidos agrupados por usuário.
 * 
 * Filtra os pedidos por `order_id` e intervalo de datas (`start_date` e `end_date`), se fornecidos.
 * Remove usuários que ficarem sem pedidos após o filtro.
 *
 * @param {Array} data - Array com os pedidos agrupados por usuário.
 * @param {object} filters - Objeto contendo filtros opcionais: order_id, start_date, end_date.
 * @returns {Array} - Lista filtrada com pedidos conforme critérios aplicados.
 */
function filterListOrders(data, { order_id, start_date, end_date }) {
  return data
    .map(user => {
      const filteredOrders = user.orders.filter(order => {
        const matchId = order_id ? order.order_id === Number(order_id) : true;
        const matchDate =
          (!start_date || new Date(order.date) >= new Date(start_date)) &&
          (!end_date || new Date(order.date) <= new Date(end_date));
        return matchId && matchDate;
      });
      return { ...user, orders: filteredOrders };
    })
    .filter(user => user.orders.length > 0);
}

module.exports = { processUploadedFile, filterListOrders };
