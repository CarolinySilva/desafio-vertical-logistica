const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const multer = require('multer');
const path = require('path');

const { processTxtFile } = require('./services/fileProcessor');

// Configuração multer para upload
const upload = multer({
  dest: path.join(__dirname, 'uploads/'),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, callback) => {
    if (file.mimetype === 'text/plain') {
      callback(null, true); //aceita o arquivo
    } else {
      callback(new Error('Apenas arquivos .txt são permitidos')); //rejeita o arquivo
    }
  }
});

app.get('/', (req, res) => {
  res.send('API rodando com sucesso!');
});

//Endpoint de upload de arquivo txt
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Arquivo não enviado' });
  }

  try {
    const filePath = req.file.path;
    const lines = processTxtFile(filePath);

    res.json({
      message: 'Arquivo processado com sucesso',
      totalLinhas: lines.length,
      amostra: lines.slice(0, 5)
    });
  } catch (error) {
    console.error('Erro no upload:', error);
    res.status(500).json({ error: error.message || 'Erro ao processar o arquivo' });
    }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});