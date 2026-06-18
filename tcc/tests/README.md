# Testes - Saúde na Mão

## Pré-requisitos

Verifique se o Docker está rodando:

```bash
docker compose ps
```

Se necessário:

```bash
docker compose up -d
```

Verifique se o K6 está instalado:

```bash
k6 version
```

---

# Testes Unitários (Jest)

Entrar na pasta Backend:

```bash
cd Backend
```

Executar todos os testes:

```bash
npm test
```

Resultado esperado:

```bash
Test Suites: 9 passed, 9 total
Tests:       31 passed, 31 total
```

---

# Smoke Tests (K6)

Validação rápida do sistema.

```bash
k6 run -e TEST_TYPE=smoke tests/load/login-load.js

k6 run -e TEST_TYPE=smoke tests/load/paciente-load.js

k6 run -e TEST_TYPE=smoke tests/load/recepcionista-load.js

k6 run -e TEST_TYPE=smoke tests/load/admin-load.js
```

---

# Load Tests (K6)

Simula uso normal do sistema.

```bash
k6 run tests/load/login-load.js

k6 run tests/load/paciente-load.js

k6 run tests/load/recepcionista-load.js

k6 run tests/load/admin-load.js
```

---

# Stress Test

Simula aproximadamente 100 usuários simultâneos.

```bash
k6 run tests/load/stress-test.js
```

---

# Spike Test

Simula pico repentino de acessos.

```bash
k6 run tests/load/spike-test.js
```

---

# Relatórios

Os relatórios são gerados automaticamente em:

```bash
tests/reports/
```

Arquivos gerados:

```bash
*.html
*.json
```

Abra o arquivo HTML no navegador para visualizar os resultados.
