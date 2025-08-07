const express = require('express');
const multer = require('multer');
const path = require('path');

const router = express.Router();
const upload = multer({ dest: path.resolve(__dirname, '../../uploads') });

const orderHandler = require('../controllers/orderHandler');

/**
 * Realiza o upload de um arquivo .txt com dados de pedidos
 * e inicia o processamento dos dados
 */
router.post('/upload', upload.single('file'), orderHandler.uploadFile);

/**
 * GET /api/orders
 * Retorna os pedidos processados com filtros opcionais:
 * - order_id: filtra por ID do pedido
 * - start_date e end_date: filtra pedidos dentro do intervalo de datas (YYYY-MM-DD)
 */
router.get('/orders', orderHandler.listOrders);

module.exports = router;