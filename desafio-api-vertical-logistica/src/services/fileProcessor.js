const fileSystem = require('fs');
const path = require('path');
const readline = require('readline');

/**
 * Processa um arquivo de pedidos no formato legado (largura fixa).
 * Agrupa itens pelo `orderId` e normaliza os dados em JSON.
 */
function fileProcessor(filePath) {
  const ordersMap = new Map();

  const fileStream = fileSystem.createReadStream(filePath);
  const lineReader = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  return new Promise((resolve, reject) => {
    lineReader.on('line', (line) => {
      try {
        // Extrai os campos de acordo com suas posições fixas
        const userId = line.substring(0, 10).trim();
        const userName = line.substring(10, 55).trim();
        const orderId = line.substring(55, 65).trim();
        const productId = line.substring(65, 75).trim();
        const value = parseFloat(line.substring(75, 87).trim());
        const date = line.substring(87, 95).trim();

        // Ignora linhas com dados ausentes ou inválidos
        if (!orderId || isNaN(value)) return;

        const item = {
          code: productId,
          value: value,
        };

        // Agrupa itens pelo código do pedido
        if (ordersMap.has(orderId)) {
          ordersMap.get(orderId).itens.push(item);
        } else {
          ordersMap.set(orderId, {
            code: orderId,
            client: userName,
            itens: [item],
          });
        }
      } catch (err) {
        // Mostra erro ao processar linha malformada
        console.error('Erro ao processar linha:', line);
        console.error(err);
      }
    });

    lineReader.on('close', () => {
      // Retorna o array de pedidos agrupados
      resolve(Array.from(ordersMap.values()));
    });

    lineReader.on('error', reject);
  });
}

module.exports = fileProcessor;
