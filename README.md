# HelpDesk+ (corrigido)

Correções aplicadas (resumo):
- Redução do limite de body para 1mb.
- Logs seguros (não expõem body/token).
- Removido loop CPU-bound e timer que vazava memória.
- Substituído fs sync por fs.promises com escrita atômica.
- IDs gerados com UUID.
- Validação básica de entrada em POST/PUT.
- Remoção de erro aleatório.

Como rodar:
1. npm install
2. node server.js
3. Testes:
   - GET /tickets
   - POST /tickets {title, customer}
   - PUT /tickets/:id/status {status: "open" | "closed"}
