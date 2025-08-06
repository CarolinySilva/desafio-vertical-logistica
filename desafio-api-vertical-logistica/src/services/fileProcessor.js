const fileSystem = require('fs');
const path = require('path');

/**
 * Lê e processa um arquivo .txt com dados de pedidos.
 * Retorna um array de pedidos estruturados.
 */
function fileProcessor(filePath) {
  try {
    const fileContent = fileSystem.readFileSync(path.resolve(filePath), 'utf-8');
    const lines = fileContent.split('\n').filter(line => line.trim() !== '');

    const orders = lines.map((line) => {
      const codigoPedido = line.substring(0, 10).trim();
      const dataPedido = line.substring(10, 19).trim();
      const nomeCliente = line.substring(19, 49).trim();
      const codigoProduto = line.substring(49, 59).trim();
      const quantidade = parseInt(line.substring(59, 62).trim());
      const valorUnitario = parseFloat(line.substring(62, 71).trim()) / 100;

      return {
        codigoPedido,
        dataPedido,
        cliente: nomeCliente,
        itens: [
          {
            codigoProduto,
            quantidade,
            valorUnitario,
          },
        ],
      };
    });

    return orders;
  } catch (error) {
    console.error('Erro ao processar o arquivo:', error);
    throw new Error('Erro ao processar o arquivo');
  }
}

module.exports = fileProcessor;