# Stock Management API

API REST para gestão de stock e inventário, construída com `Express`, `TypeScript`, `Drizzle ORM` e `PostgreSQL`.

O projecto já inclui o modelo de dados principal para utilizadores, produtos, variantes, armazéns, níveis de stock e movimentos de stock. No entanto, no estado actual do código, as rotas HTTP implementadas estão focadas apenas em autenticação e verificação de saúde da aplicação.

## Estado actual

- API HTTP implementada:
  - `GET /api/v1/health`
  - `POST /api/v1/auth/register`
  - `POST /api/v1/auth/login`
- Modelo de base de dados já preparado para:
  - utilizadores
  - produtos
  - variantes de produto
  - armazéns
  - níveis de stock
  - movimentos de stock
- Documentação adicional existente no repositório:
  - `DB_SCHEMA.md`: descrição funcional do domínio de dados
  - `ENPOINTS.md`: rascunho de endpoints planeados, incluindo áreas ainda não expostas pela API

## Stack técnica

- `Node.js`
- `TypeScript`
- `Express 5`
- `Drizzle ORM`
- `PostgreSQL`
- `Zod`
- `bcrypt`
- `jsonwebtoken`
- `helmet`
- `cors`
- `morgan`

## Arquitectura resumida

O projecto segue uma separação simples por camadas:

- `src/routes`: definição das rotas
- `src/controllers`: adaptação entre HTTP e lógica da aplicação
- `src/services`: regras de negócio
- `src/repositories`: acesso à base de dados
- `src/db`: ligação ao PostgreSQL e definição do schema Drizzle
- `src/middlewares`: validação e tratamento de erros
- `src/utils`: utilitários transversais, como hashing e JWT

Fluxo actual de autenticação:

1. A rota valida o `body` com `Zod`.
2. O controller delega a operação para o service.
3. O service aplica regras de negócio:
   - hash da password no registo
   - validação de credenciais no login
   - geração de JWT
4. O repository executa operações sobre a tabela `users`.
5. A resposta devolve um utilizador sanitizado, sem password.

## Estrutura do projecto

```txt
.
├── src/
│   ├── app.ts
│   ├── server.ts
│   ├── controllers/
│   ├── db/
│   ├── errors/
│   ├── middlewares/
│   ├── repositories/
│   ├── routes/
│   ├── services/
│   ├── types/
│   └── utils/
├── migrations/
├── env.ts
├── drizzle.config.ts
├── DB_SCHEMA.md
├── ENPOINTS.md
└── package.json
```

## Requisitos

- `Node.js` instalado
- `PostgreSQL` disponível
- variável `DATABASE_URL` a apontar para uma base de dados válida

## Configuração

Crie um ficheiro `.env` com base em `.env.example`.

### Variáveis de ambiente

| Variável | Obrigatória | Descrição |
|---|---:|---|
| `HOST` | Não | Host onde a API arranca. Default: `127.0.0.1` |
| `PORT` | Não | Porto HTTP. Default: `3000` |
| `DATABASE_URL` | Sim | Ligação PostgreSQL no formato `postgresql://...` |
| `API_PREFIX` | Sim | Prefixo da API. Tem de começar por `/api/v1` |
| `APP_STAGE` | Não | Identificador de ambiente da aplicação |
| `NODE_ENV` | Sim | `development`, `production` ou `test` |
| `BCRYPT_SALT_ROUNDS` | Não | Custo do hash bcrypt. Entre `10` e `15` |
| `JWT_SECRET` | Sim | Segredo JWT com pelo menos `30` caracteres |
| `JWT_EXPIRES_IN` | Não | Tempo de validade do token. Default: `7d` |

## Instalação

```bash
npm install
```

## Scripts disponíveis

```bash
npm run dev
npm run db:generate
npm run db:migrate
npm run db:studio
```

### O que faz cada script

- `npm run dev`: arranca a API em modo de desenvolvimento
- `npm run db:generate`: gera migrations a partir do schema Drizzle
- `npm run db:migrate`: aplica migrations
- `npm run db:studio`: abre o Drizzle Studio

## Arranque local

1. Instalar dependências.
2. Configurar o `.env`.
3. Garantir que o PostgreSQL está acessível.
4. Aplicar as migrations:

```bash
npm run db:migrate
```

5. Arrancar a API:

```bash
npm run dev
```

Base URL por omissão:

```txt
http://127.0.0.1:3000/api/v1
```

## Endpoints implementados

### `GET /health`

Verifica se a aplicação está activa.

Exemplo de resposta:

```json
{
  "status": "OK",
  "service": "STOCK MANAGEMENT API",
  "timestamp": "1714123456789"
}
```

### `POST /auth/register`

Cria um novo utilizador.

#### Body

```json
{
  "name": "Marlon Nhantumbo",
  "email": "marlon@example.com",
  "password": "12345678"
}
```

#### Regras de validação

- `name`: mínimo `2`, máximo `100`
- `email`: válido, normalizado para minúsculas
- `password`: mínimo `8`
- `role`: opcional; por omissão fica `STAFF`

#### Resposta `201`

```json
{
  "status": "ok",
  "data": {
    "user": {
      "id": "uuid",
      "name": "Marlon Nhantumbo",
      "email": "marlon@example.com",
      "role": "STAFF",
      "isActive": true,
      "createdAt": "2026-04-26T10:00:00.000Z",
      "updatedAt": "2026-04-26T10:00:00.000Z"
    }
  }
}
```

#### Erros possíveis

- `400`: body inválido
- `409`: email já em uso

### `POST /auth/login`

Autentica um utilizador e devolve um token JWT.

#### Body

```json
{
  "email": "marlon@example.com",
  "password": "12345678"
}
```

#### Resposta `200`

```json
{
  "status": "ok",
  "data": {
    "user": {
      "id": "uuid",
      "name": "Marlon Nhantumbo",
      "email": "marlon@example.com",
      "role": "STAFF",
      "isActive": true,
      "createdAt": "2026-04-26T10:00:00.000Z",
      "updatedAt": "2026-04-26T10:00:00.000Z"
    },
    "accessToken": "jwt-token"
  }
}
```

#### Erros possíveis

- `400`: body inválido
- `401`: credenciais inválidas
- `403`: conta inactiva

## Formato de erros

Erros de negócio usam o formato:

```json
{
  "status": "error",
  "message": "Mensagem de erro"
}
```

Erros de validação incluem detalhes por campo:

```json
{
  "status": "error",
  "message": "Invalid request body",
  "details": [
    {
      "field": "email",
      "message": "Invalid email address"
    }
  ]
}
```

## Autenticação

O token JWT gerado no login inclui:

- `sub`: ID do utilizador
- `email`
- `role`

O código actual já gera tokens de acesso, mas ainda não expõe middleware de autenticação nem rotas protegidas activas.

## Base de dados

O schema Drizzle e a migration inicial definem as seguintes entidades:

- `users`
- `products`
- `product_variants`
- `warehouses`
- `stock_levels`
- `stock_movements`

Também existem enums para:

- `user_role`
- `product_status`
- `movement_type`
- `movement_reason`

Regras relevantes já modeladas:

- email único de utilizador, com índice por `lower(email)`
- SKU único por variante
- unicidade de `variant_id + warehouse_id` em `stock_levels`
- índices de pesquisa para produtos, armazéns e movimentos
- `foreign keys` com `cascade` ou `restrict` conforme a entidade

## Comportamento da aplicação

- `helmet` activo para cabeçalhos de segurança
- `cors` aberto com `origin: "*"`
- `morgan("dev")` para logs HTTP
- carregamento automático de `.env` em desenvolvimento e `.env.test` em testes
- tratamento centralizado de erros com detalhe adicional fora de produção

## Observações importantes

- O domínio de inventário já está modelado na base de dados, mas ainda não existem rotas para produtos, variantes, armazéns ou movimentos de stock.
- `ENPOINTS.md` documenta funcionalidades previstas, não apenas funcionalidades já implementadas.
- Não existem testes automatizados no repositório neste momento.
- O projecto está sob licença `MIT`.

## Licença

Este projecto está licenciado sob a licença `MIT`. Consulte o ficheiro `LICENSE`.
