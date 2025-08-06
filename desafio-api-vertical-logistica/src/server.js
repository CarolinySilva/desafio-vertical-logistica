const express = require('express');
const multer = require('multer');
const fileProcessor = require('./services/fileProcessor'); // <-- ajuste aqui

const app = express();
const upload = require('./config/multer');

const PORT = process.env.PORT || 3000;

// Endpoint para upload de arquivo txt
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    // Processa o arquivo enviado e obtém os pedidos
    const orders = await fileProcessor(req.file.path);
    res.status(200).json(orders);
    
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message || 'Erro ao processar o arquivo' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
