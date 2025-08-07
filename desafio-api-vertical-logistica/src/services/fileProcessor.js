const fileSystem = require('fs');
const path = require('path');

//* Função principal para processar o arquivo legado
module.exports = async function processFile(filePath) {
  try {
    const rawData = fileSystem.readFileSync(path.resolve(filePath), 'utf-8');
    const lines = rawData.split('\n').filter(line => line.trim() !== '');

    const usersMap = new Map();

    lines.forEach(line => {
      const userId = parseInt(line.slice(0, 10), 10);
      const name = line.slice(10, 55).trim();
      const orderId = parseInt(line.slice(55, 65), 10);
      const productId = parseInt(line.slice(65, 75), 10);
      const value = parseFloat(line.slice(75, 87)).toFixed(2);
      const rawDate = line.slice(87, 95);
      const dateFormatted = `${rawDate.slice(0, 4)}-${rawDate.slice(4, 6)}-${rawDate.slice(6, 8)}`;

      if (!usersMap.has(userId)) {
        usersMap.set(userId, {
          user_id: userId,
          name,
          orders: [],
        });
      }

      const user = usersMap.get(userId);

      let order = user.orders.find(o => o.order_id === orderId);

      if (!order) {
        order = {
          order_id: orderId,
          total: 0,
          date: dateFormatted,
          products: [],
        };
        user.orders.push(order);
      }

      order.total += parseFloat(value);
      order.products.push({
        product_id: productId,
        value: value,
      });
    });

    //* Convertendo Map para array e formatando total como string
    const formattedData = Array.from(usersMap.values()).map(user => {
      user.orders = user.orders.map(order => ({
        ...order,
        total: order.total.toFixed(2),
      }));
      return user;
    });

    return formattedData;
  } catch (error) {
    console.error('Erro ao processar o arquivo:', error);
    throw new Error('Erro ao processar o arquivo');
  }
};
