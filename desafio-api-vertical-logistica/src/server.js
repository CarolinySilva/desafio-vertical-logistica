const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const multer = require('multer');
const path = require('path');

// Configuração multer para upload
const upload = multer({
  dest: path.join(__dirname, 'uploads/'),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/plain') {
      cb(null, true);
    } else {
      cb(new Error('Apenas arquivos .txt são permitidos'));
    }
  }
});

app.get('/', (req, res) => {
  res.send('API rodando com sucesso!');
});

//Endpoint de upload de arquivo txt
app.post('/api/upload', upload.single('file'), (req, res) => {
    if(!req.file) {
        return res.status(400).json({ error: 'Arquivo não enviado' });
    }
    res.json({ message: 'Upload realizado com sucesso', filename: req.file.filename });

})
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)
});