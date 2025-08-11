require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Limite de requisições
const limiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 100, 
  message: { message: 'Muitas requisições. Tente novamente mais tarde.' }
});
app.use(limiter);

// Habilita CORS
app.use(cors({ origin: '*' }));

// Parser de JSON
app.use(express.json());

// Rotas
app.use('/api', routes);

// Middleware global de tratamento de erros
app.use(errorHandler);

module.exports = app;
