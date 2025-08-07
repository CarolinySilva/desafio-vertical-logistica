const fileSystem = require('fs/promises');
const { extractRecordFromLine, groupOrdersByUser } = require('../utils/orderParser');

/**
 * Lê e processa o arquivo de texto legado, dividindo-o em linhas fixas,
 * parseando cada linha e normalizando os dados em uma estrutura final.
 *
 * @param {string} filePath - Caminho do arquivo .txt a ser processado
 * @returns {Promise<Array>} - Estrutura de pedidos normalizada pronta para uso na API
 */

async function parseFile(filePath) {
  const content = await fileSystem.readFile(filePath, 'utf-8');
  const lines = content.match(/.{1,95}/g); 
  const parsed = lines.map(extractRecordFromLine);
  return groupOrdersByUser(parsed);
}

module.exports = { parseFile };