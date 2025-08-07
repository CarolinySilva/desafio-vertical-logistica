/**
 * Utilitário simples de cache em memória usando JavaScript Map.
 *
 * Observação: O cache é limpo sempre que o servidor é reiniciado.
*/
const cache = new Map();

/**
 * Armazena um valor no cache sob uma chave específica.
 * @param {string} key - A chave associada ao valor a ser armazenado.
 * @param {*} value - O valor a ser armazenado no cache.
 */
function set(key, value) {
  cache.set(key, value);
}

/**
 * Recupera um valor do cache pela chave.
 * @param {string} key - A chave associada ao valor armazenado.
 * @returns {*} O valor armazenado, ou undefined se não encontrado.
 */
function get(key) {
  return cache.get(key);
}

/**
 * Limpa todos os dados armazenados no cache.
 */
function clear() {
  cache.clear();
}

module.exports = {
  set,
  get,
  clear,
};
