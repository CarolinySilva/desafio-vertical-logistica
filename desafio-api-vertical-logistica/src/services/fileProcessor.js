const fileSystem = require('fs');
const path = require('path');

//processTxtFile tem como objetivo ler um arquivo txt do disco e transformá-lo em um array de linhas válidas
function processTxtFile(filePath) {
   try {
    const content = fileSystem.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n').map(line => line.trim()).filter(Boolean);
    return lines;
  } catch (error) {
    console.error('Erro ao ler o arquivo:', error);
    throw new Error('Falha ao processar o arquivo');
  }
}

module.exports = {
  processTxtFile,
};