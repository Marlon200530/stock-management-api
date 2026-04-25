# Database Schema — Inventory Stock API

Este documento descreve as tabelas principais da base de dados para uma API REST de gestão de inventário e stock.

## Visão geral

A API terá as seguintes tabelas:

- `users`
- `products`
- `product_variants`
- `warehouses`
- `stock_levels`
- `stock_movements`

---

# 1. `users`

Guarda os utilizadores do sistema.

| Campo | Tipo sugerido | Obrigatório | Descrição |
|---|---|---:|---|
| `id` | `uuid` | Sim | Identificador único do utilizador |
| `name` | `varchar(100)` | Sim | Nome do utilizador |
| `email` | `varchar(255)` | Sim | Email único do utilizador |
| `password` | `varchar(255)` | Sim | Password com hash |
| `role` | `enum` | Sim | Papel do utilizador no sistema |
| `is_active` | `boolean` | Sim | Indica se o utilizador está activo |
| `created_at` | `timestamp` | Sim | Data de criação |
| `updated_at` | `timestamp` | Sim | Data da última actualização |

## Valores possíveis para `role`

| Valor | Descrição |
|---|---|
| `ADMIN` | Pode gerir todo o sistema |
| `MANAGER` | Pode gerir produtos, armazéns e stock |
| `STAFF` | Pode executar operações básicas de stock |

---

# 2. `products`

Guarda os produtos principais.

| Campo | Tipo sugerido | Obrigatório | Descrição |
|---|---|---:|---|
| `id` | `uuid` | Sim | Identificador único do produto |
| `name` | `varchar(150)` | Sim | Nome do produto |
| `description` | `text` | Não | Descrição do produto |
| `category` | `varchar(100)` | Não | Categoria do produto |
| `status` | `enum` | Sim | Estado do produto |
| `created_at` | `timestamp` | Sim | Data de criação |
| `updated_at` | `timestamp` | Sim | Data da última actualização |

## Valores possíveis para `status`

| Valor | Descrição |
|---|---|
| `ACTIVE` | Produto activo |
| `INACTIVE` | Produto inactivo |

---

# 3. `product_variants`

Guarda as variantes vendáveis de cada produto.

Exemplo:

- Produto: `Relógio Curren`
- Variante: `Curren Dourado`
- SKU: `CURREN-GOLD-001`

| Campo | Tipo sugerido | Obrigatório | Descrição |
|---|---|---:|---|
| `id` | `uuid` | Sim | Identificador único da variante |
| `product_id` | `uuid` | Sim | Produto ao qual a variante pertence |
| `sku` | `varchar(100)` | Sim | Código único da variante |
| `name` | `varchar(150)` | Sim | Nome da variante |
| `price` | `numeric(10,2)` | Sim | Preço de venda |
| `cost_price` | `numeric(10,2)` | Não | Preço de custo |
| `attributes` | `text` ou `jsonb` | Não | Atributos da variante, como cor, tamanho, modelo, material |
| `is_active` | `boolean` | Sim | Indica se a variante está activa |
| `created_at` | `timestamp` | Sim | Data de criação |
| `updated_at` | `timestamp` | Sim | Data da última actualização |

---

# 4. `warehouses`

Guarda os locais onde existe stock.

Exemplos:

- `Armazém Maputo`
- `Loja Matola`
- `Armazém Beira`

| Campo | Tipo sugerido | Obrigatório | Descrição |
|---|---|---:|---|
| `id` | `uuid` | Sim | Identificador único do armazém |
| `name` | `varchar(150)` | Sim | Nome do armazém ou local de stock |
| `city` | `varchar(100)` | Sim | Cidade onde o armazém está localizado |
| `address` | `text` | Não | Endereço detalhado |
| `is_active` | `boolean` | Sim | Indica se o armazém está activo |
| `created_at` | `timestamp` | Sim | Data de criação |
| `updated_at` | `timestamp` | Sim | Data da última actualização |

---

# 5. `stock_levels`

Guarda o stock actual de cada variante em cada armazém.

Exemplo:

- Variante: `Curren Dourado`
- Armazém: `Maputo`
- Quantidade: `10`

| Campo | Tipo sugerido | Obrigatório | Descrição |
|---|---|---:|---|
| `id` | `uuid` | Sim | Identificador único do nível de stock |
| `variant_id` | `uuid` | Sim | Variante associada ao stock |
| `warehouse_id` | `uuid` | Sim | Armazém onde a variante está armazenada |
| `quantity` | `integer` | Sim | Quantidade actual em stock |
| `created_at` | `timestamp` | Sim | Data de criação |
| `updated_at` | `timestamp` | Sim | Data da última actualização |

## Regra importante

A combinação abaixo deve ser única:

| Campo 1 | Campo 2 |
|---|---|
| `variant_id` | `warehouse_id` |

Isto significa que a mesma variante só pode ter uma linha de stock por armazém.

Exemplo errado:

| `variant_id` | `warehouse_id` | `quantity` |
|---|---|---:|
| `A` | `Maputo` | 10 |
| `A` | `Maputo` | 5 |

Exemplo correcto:

| `variant_id` | `warehouse_id` | `quantity` |
|---|---|---:|
| `A` | `Maputo` | 15 |

---

# 6. `stock_movements`

Guarda o histórico de entradas, saídas e ajustes de stock.

Esta tabela responde às perguntas:

- Quem mexeu no stock?
- Quando mexeu?
- Qual variante foi afectada?
- Em que armazém?
- Qual era a quantidade anterior?
- Qual ficou a nova quantidade?
- Qual foi o motivo?

| Campo | Tipo sugerido | Obrigatório | Descrição |
|---|---|---:|---|
| `id` | `uuid` | Sim | Identificador único do movimento |
| `variant_id` | `uuid` | Sim | Variante afectada pelo movimento |
| `warehouse_id` | `uuid` | Sim | Armazém afectado pelo movimento |
| `created_by_id` | `uuid` | Sim | Utilizador que realizou o movimento |
| `type` | `enum` | Sim | Tipo de movimento |
| `reason` | `enum` | Sim | Motivo do movimento |
| `quantity` | `integer` | Sim | Quantidade movimentada |
| `previous_quantity` | `integer` | Sim | Quantidade antes do movimento |
| `new_quantity` | `integer` | Sim | Quantidade depois do movimento |
| `note` | `text` | Não | Observação opcional |
| `created_at` | `timestamp` | Sim | Data em que o movimento foi criado |

## Valores possíveis para `type`

| Valor | Descrição |
|---|---|
| `IN` | Entrada de stock |
| `OUT` | Saída de stock |
| `ADJUSTMENT` | Ajuste manual de stock |

## Valores possíveis para `reason`

| Valor | Descrição |
|---|---|
| `PURCHASE` | Compra de novo stock |
| `SALE` | Venda |
| `RETURN` | Devolução |
| `DAMAGE` | Produto danificado |
| `CORRECTION` | Correcção manual |
| `INITIAL_STOCK` | Stock inicial |

---

# Relações entre as tabelas

## `users` → `stock_movements`

Um utilizador pode criar vários movimentos de stock.

| Relação | Tipo |
|---|---|
| `users.id` → `stock_movements.created_by_id` | 1:N |

---

## `products` → `product_variants`

Um produto pode ter várias variantes.

| Relação | Tipo |
|---|---|
| `products.id` → `product_variants.product_id` | 1:N |

---

## `product_variants` → `stock_levels`

Uma variante pode ter stock em vários armazéns.

| Relação | Tipo |
|---|---|
| `product_variants.id` → `stock_levels.variant_id` | 1:N |

---

## `warehouses` → `stock_levels`

Um armazém pode guardar várias variantes.

| Relação | Tipo |
|---|---|
| `warehouses.id` → `stock_levels.warehouse_id` | 1:N |

---

## `product_variants` → `stock_movements`

Uma variante pode ter vários movimentos de stock.

| Relação | Tipo |
|---|---|
| `product_variants.id` → `stock_movements.variant_id` | 1:N |

---

## `warehouses` → `stock_movements`

Um armazém pode ter vários movimentos de stock.

| Relação | Tipo |
|---|---|
| `warehouses.id` → `stock_movements.warehouse_id` | 1:N |

---

## `users` → `stock_movements`

Um movimento de stock é criado por um utilizador.

| Relação | Tipo |
|---|---|
| `users.id` → `stock_movements.created_by_id` | 1:N |

---

# Resumo visual

```txt
users
  └── stock_movements

products
  └── product_variants
        ├── stock_levels
        └── stock_movements

warehouses
  ├── stock_levels
  └── stock_movements