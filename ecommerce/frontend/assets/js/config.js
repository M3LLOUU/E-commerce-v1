// Se estiver rodando localmente (Live Server / VS Code), usa localhost:8080.
// Quando for para o servidor real, usa a variável ou a mesma origem com /api
const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
  window.location.hostname === '[::1]' ||
  window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
);

export const CONFIG = {
  // Em produção, se o Nginx servir o front e a API no mesmo domínio, pode ser só '/api/v1'
  API_BASE_URL: isLocalhost 
    ? 'http://localhost:8080/api/v1' 
    : 'https://api.sualoja.com.br/api/v1', // <-- ÚNICO lugar que você vai alterar quando tiver o domínio
  
  STORE_NAME: 'Lumina Lingerie',
  FREE_SHIPPING_THRESHOLD: 199.00
};