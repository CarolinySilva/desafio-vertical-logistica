/**
 * Middleware global para tratamento de erros.
 * Captura qualquer exceção não tratada nas rotas e envia
 * uma resposta padronizada em JSON para o cliente.
 *
 * @param {Error} err - Objeto de erro lançado.
 * @param {import('express').Request} req - Objeto da requisição.
 * @param {import('express').Response} res - Objeto da resposta.
 * @param {import('express').NextFunction} next - Próximo middleware.
 */
module.exports = (err, req, res, next) => {
  console.error('Captured error:', err.stack);

  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
};
