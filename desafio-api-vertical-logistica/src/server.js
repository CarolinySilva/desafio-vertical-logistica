const express = require('express');
const multer = require('multer');
const fileProcessor = require('./services/fileProcessor'); // <-- ajuste aqui

const app = express();
const upload = require('./config/multer');

const PORT = process.env.PORT || 3000;

//Endpoint de upload de arquivo txt
app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    const pedidos = fileProcessor(file.path); 
    res.status(200).json(pedidos);
  } catch (error) {
    console.error('Erro no upload:', error);
    res.status(500).json({ error: 'Erro ao processar o arquivo' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});