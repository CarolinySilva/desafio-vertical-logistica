/**
 * Converte uma linha do arquivo fixo em um objeto com campos normalizados.
 *
 * A linha contém:
 * - user_id (10 caracteres)
 * - name (45 caracteres)
 * - order_id (10 caracteres)
 * - product_id (10 caracteres)
 * - value (12 caracteres, com 2 casas decimais)
 * - date (8 caracteres, no formato YYYYMMDD)
 *
 * @param {string} line - Linha do arquivo legado com 95 caracteres
 * @returns {object} Objeto com os dados extraídos e convertidos
 */

function extractRecordFromLine(line) {
  return {
    user_id: Number(line.slice(0, 10)),
    name: line.slice(10, 55).trim(),
    order_id: Number(line.slice(55, 65)),
    product_id: Number(line.slice(65, 75)),
    value: parseFloat(line.slice(75, 87)),
    date: formatDate(line.slice(87, 95))
  };
}

/**
 * Normaliza os dados em uma estrutura agrupada por usuário e pedido.
 *
 * - Agrupa linhas por `user_id`
 * - Dentro de cada usuário, agrupa produtos por `order_id`
 * - Soma os valores dos produtos para calcular o `total` do pedido
 *
 * @param {Array<object>} lines - Lista de objetos parseados via extractRecordFromLine
 * @returns {Array<object>} Estrutura agrupada com usuários, pedidos e produtos
 */
function groupOrdersByUser(lines) {
  const users = new Map();

  for (const line of lines) {
    if (!users.has(line.user_id)) {
      users.set(line.user_id, {
        user_id: line.user_id,
        name: line.name,
        orders: []
      });
    }

    const user = users.get(line.user_id);
    let order = user.orders.find(o => o.order_id === line.order_id);

    if (!order) {
      order = {
        order_id: line.order_id,
        date: line.date,
        total: 0,
        products: []
      };
      user.orders.push(order);
    }

    order.products.push({ product_id: line.product_id, value: line.value.toFixed(2) });
    order.total += line.value;
  }

  // Formata total dos pedidos com 2 casas decimais
  for (const user of users.values()) {
    user.orders.forEach(o => o.total = o.total.toFixed(2));
  }

  return Array.from(users.values());
}

/**
 * Converte uma data no formato YYYYMMDD para o formato ISO (YYYY-MM-DD).
 *
 * @param {string} dateStr - Data em string no formato compacto
 * @returns {string} Data formatada no padrão ISO
 */
function formatDate(dateStr) {
  const year = dateStr.slice(0, 4);
  const month = dateStr.slice(4, 6);
  const day = dateStr.slice(6, 8);
  return `${year}-${month}-${day}`;
}

module.exports = { extractRecordFromLine, groupOrdersByUser };