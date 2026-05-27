# Sugestões e Pendências — Projeto TCC

Resumo rápido

- Projeto: backend em Node/TypeScript (Express + Sequelize), MySQL, Nginx como proxy e Docker Compose.
- Objetivo deste arquivo: listar inconsistências, riscos e melhorias práticas para facilitar execução, deploy e manutenção.

Como subir (local)

1. Com Docker Compose (recomendado):

```bash
cd c:/Dev/MeuTcc/tcc/tcc
docker compose -f "Docker-compose.yml" up --build
```

Endereços úteis após subir:

- Swagger (UI): http://localhost/api-docs
- API root: http://localhost/api
- Health: http://localhost/health
- Backend direto (sem Docker): http://localhost:3001

Principais achados e inconsistências

1. Nginx: foi identificado redirecionamento para HTTPS e proxy para porta errada em versões anteriores — já corrigido, confirme que a pasta `Nginx` (N maiúsculo) existe no Compose.
2. Backend Dockerfile: expunha `3000` mas o app usa `3001`. Ajuste aplicado, confirme `EXPOSE` e `CMD` corretos.
3. Variáveis sensíveis: `MYSQL_ROOT_PASSWORD`, `MYSQL_PASSWORD` e outras estão em cleartext no `docker-compose`. Melhor criar um `.env` (não comitado) e usar `env_file` ou secrets.
4. Inicialização do DB: não existem scripts de seed/migration automatizados; o projeto usa `sequelize.sync()` — ok para dev, mas considere migrations para produção (Sequelize CLI ou um migration tool).
5. Swagger: a UI foi adicionada diretamente no `index.ts`. Considerar mover a especificação para um arquivo `src/swagger.ts` ou usar `swagger-jsdoc` para gerar automaticamente a partir de comentários JSDoc.
6. Scripts npm: não há script `docker:build` nem `start:prod`. Adicionar scripts facilita CI/CD.
7. Imagens Docker: o Dockerfile atual usa `ts-node-dev` no `CMD` (modo dev). Para produção, faça `npm run build` e `node dist/index.js` no image final (multi-stage build recomendado).
8. Segurança MySQL: porta 3306 exposta para o host. Se não necessário, remova a publicação de porta em produção.

Melhorias recomendadas (priorizadas)

1. Criar `.env.example` com todas as variáveis usadas (`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `PORT`, etc.).
2. Mover spec do Swagger para `src/swagger.ts` e documentar modelos (schemas) das entidades.
3. Fazer um multi-stage Dockerfile:

```dockerfile
FROM node:22-slim AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-slim AS runtime
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package.json ./
RUN npm ci --production
EXPOSE 3001
CMD ["node", "dist/index.js"]
```

4. Adicionar `dockerignore` para evitar enviar node_modules e dist ao build.
5. Adicionar check de readiness/liveness no backend e health endpoint já existe; expor readiness para o Compose se necessário.
6. Adicionar migrations/seed com Sequelize CLI e scripts `npm run migrate` / `npm run seed`.
7. Criar `README.md` principal (este arquivo é complementar) com instruções de desenvolvimento, testes e deploy.

Checklist rápido antes de rodar (local)

- Docker Desktop ativo
- Porta 80 e 8080 livres (ou alterar publicados no compose)
- Executar:

```bash
cd c:/Dev/MeuTcc/tcc/tcc
docker compose up --build
```

Notas finais

- Evite usar `@nestjs/*` neste projeto (não é NestJS).
- Verificação executada: não há dependências ou uso de NestJS no código. Procurei por `@nestjs` e removi pacotes residuais caso existissem.
- Se quiser, eu posso: gerar `swagger.ts` com schemas das rotas; criar `Dockerfile` multi-stage; ou adicionar `.env.example` e scripts npm. Diga qual você prefere que eu faça em seguida.
