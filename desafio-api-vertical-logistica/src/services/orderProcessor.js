const fileSystem = require('fs');
const readline = require('readline');
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
  const fileStream = fileSystem.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const parsed = [];
  for await (const line of rl) {
    if (line.trim().length > 0) {
      parsed.push(extractRecordFromLine(line));
    }
  }

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
function filterListOrders(data, { user_id, order_id, start_date, end_date, date }) {
  return data
    .filter(user => !user_id || String(user.user_id) === String(user_id))
    .map(user => {
      const filteredOrders = user.orders.filter(order => {
        const matchId = !order_id || order.order_id === Number(order_id);
        const matchDateRange =
          (!start_date || new Date(order.date) >= new Date(start_date)) &&
          (!end_date || new Date(order.date) <= new Date(end_date));
        const matchExactDate = !date || order.date === date;

        return matchId && matchDateRange && matchExactDate;
      });

      return { ...user, orders: filteredOrders };
    })
    .filter(user => user.orders.length > 0);
}

module.exports = { processUploadedFile, filterListOrders };
module.exports = { processUploadedFile, filterListOrders };
