````md
# Endpoints, Inputs e Outputs — Inventory Stock API

Base URL:

```txt
/api
````

---

# 1. Auth

## 1.1 Registar utilizador

```txt
POST /auth/register
```

### Input

```json
{
  "name": "Marlon Nhantumbo",
  "email": "marlon@example.com",
  "password": "12345678"
}
```

### Output `201`

```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "name": "Marlon Nhantumbo",
    "email": "marlon@example.com",
    "role": "STAFF"
  }
}
```

### Erro `409`

```json
{
  "message": "Email already exists"
}
```

---

## 1.2 Login

```txt
POST /auth/login
```

### Input

```json
{
  "email": "marlon@example.com",
  "password": "12345678"
}
```

### Output `200`

```json
{
  "message": "Login successful",
  "accessToken": "jwt-token",
  "user": {
    "id": "uuid",
    "name": "Marlon Nhantumbo",
    "email": "marlon@example.com",
    "role": "STAFF"
  }
}
```

### Erro `401`

```json
{
  "message": "Invalid email or password"
}
```

---

## 1.3 Utilizador autenticado

```txt
GET /auth/me
```

### Headers

```txt
Authorization: Bearer jwt-token
```

### Input

Não tem body.

### Output `200`

```json
{
  "user": {
    "id": "uuid",
    "name": "Marlon Nhantumbo",
    "email": "marlon@example.com",
    "role": "STAFF",
    "isActive": true
  }
}
```

---

# 2. Products

## 2.1 Criar produto

```txt
POST /products
```

### Headers

```txt
Authorization: Bearer jwt-token
```

### Input

```json
{
  "name": "Relógio Curren",
  "description": "Relógio masculino elegante",
  "category": "watches"
}
```

### Output `201`

```json
{
  "message": "Product created successfully",
  "product": {
    "id": "uuid",
    "name": "Relógio Curren",
    "description": "Relógio masculino elegante",
    "category": "watches",
    "status": "ACTIVE",
    "createdAt": "2026-04-26T10:00:00.000Z",
    "updatedAt": "2026-04-26T10:00:00.000Z"
  }
}
```

---

## 2.2 Listar produtos

```txt
GET /products
```

### Headers

```txt
Authorization: Bearer jwt-token
```

### Query params opcionais

```txt
search
category
status
page
limit
```

### Exemplo

```txt
GET /products?search=curren&category=watches&page=1&limit=10
```

### Input

Não tem body.

### Output `200`

```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Relógio Curren",
      "description": "Relógio masculino elegante",
      "category": "watches",
      "status": "ACTIVE",
      "createdAt": "2026-04-26T10:00:00.000Z",
      "updatedAt": "2026-04-26T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

---

## 2.3 Buscar produto por ID

```txt
GET /products/:id
```

### Headers

```txt
Authorization: Bearer jwt-token
```

### Input

Não tem body.

### Output `200`

```json
{
  "product": {
    "id": "uuid",
    "name": "Relógio Curren",
    "description": "Relógio masculino elegante",
    "category": "watches",
    "status": "ACTIVE",
    "createdAt": "2026-04-26T10:00:00.000Z",
    "updatedAt": "2026-04-26T10:00:00.000Z"
  }
}
```

### Erro `404`

```json
{
  "message": "Product not found"
}
```

---

## 2.4 Actualizar produto

```txt
PATCH /products/:id
```

### Headers

```txt
Authorization: Bearer jwt-token
```

### Input

```json
{
  "name": "Relógio Curren Original",
  "description": "Relógio masculino actualizado",
  "category": "watches",
  "status": "ACTIVE"
}
```

### Output `200`

```json
{
  "message": "Product updated successfully",
  "product": {
    "id": "uuid",
    "name": "Relógio Curren Original",
    "description": "Relógio masculino actualizado",
    "category": "watches",
    "status": "ACTIVE",
    "updatedAt": "2026-04-26T10:30:00.000Z"
  }
}
```

---

## 2.5 Desactivar produto

```txt
DELETE /products/:id
```

### Headers

```txt
Authorization: Bearer jwt-token
```

### Input

Não tem body.

### Output `200`

```json
{
  "message": "Product deleted successfully"
}
```

---

# 3. Product Variants

## 3.1 Criar variante

```txt
POST /products/:productId/variants
```

### Headers

```txt
Authorization: Bearer jwt-token
```

### Input

```json
{
  "sku": "CURREN-GOLD-001",
  "name": "Curren Dourado",
  "price": "2500.00",
  "costPrice": "1500.00",
  "attributes": {
    "color": "gold",
    "model": "Curren"
  }
}
```

### Output `201`

```json
{
  "message": "Variant created successfully",
  "variant": {
    "id": "uuid",
    "productId": "uuid",
    "sku": "CURREN-GOLD-001",
    "name": "Curren Dourado",
    "price": "2500.00",
    "costPrice": "1500.00",
    "attributes": {
      "color": "gold",
      "model": "Curren"
    },
    "isActive": true,
    "createdAt": "2026-04-26T10:00:00.000Z",
    "updatedAt": "2026-04-26T10:00:00.000Z"
  }
}
```

### Erro `409`

```json
{
  "message": "SKU already exists"
}
```

---

## 3.2 Listar variantes de um produto

```txt
GET /products/:productId/variants
```

### Headers

```txt
Authorization: Bearer jwt-token
```

### Input

Não tem body.

### Output `200`

```json
{
  "data": [
    {
      "id": "uuid",
      "productId": "uuid",
      "sku": "CURREN-GOLD-001",
      "name": "Curren Dourado",
      "price": "2500.00",
      "costPrice": "1500.00",
      "isActive": true
    }
  ]
}
```

---

## 3.3 Buscar variante por ID

```txt
GET /variants/:id
```

### Headers

```txt
Authorization: Bearer jwt-token
```

### Input

Não tem body.

### Output `200`

```json
{
  "variant": {
    "id": "uuid",
    "productId": "uuid",
    "sku": "CURREN-GOLD-001",
    "name": "Curren Dourado",
    "price": "2500.00",
    "costPrice": "1500.00",
    "attributes": {
      "color": "gold",
      "model": "Curren"
    },
    "isActive": true
  }
}
```

---

## 3.4 Actualizar variante

```txt
PATCH /variants/:id
```

### Headers

```txt
Authorization: Bearer jwt-token
```

### Input

```json
{
  "name": "Curren Dourado Premium",
  "price": "2700.00",
  "costPrice": "1600.00",
  "isActive": true
}
```

### Output `200`

```json
{
  "message": "Variant updated successfully",
  "variant": {
    "id": "uuid",
    "sku": "CURREN-GOLD-001",
    "name": "Curren Dourado Premium",
    "price": "2700.00",
    "costPrice": "1600.00",
    "isActive": true,
    "updatedAt": "2026-04-26T10:30:00.000Z"
  }
}
```

---

## 3.5 Desactivar variante

```txt
DELETE /variants/:id
```

### Headers

```txt
Authorization: Bearer jwt-token
```

### Input

Não tem body.

### Output `200`

```json
{
  "message": "Variant deleted successfully"
}
```

---

# 4. Warehouses

## 4.1 Criar armazém

```txt
POST /warehouses
```

### Headers

```txt
Authorization: Bearer jwt-token
```

### Input

```json
{
  "name": "Armazém Maputo",
  "city": "Maputo",
  "address": "Av. 24 de Julho"
}
```

### Output `201`

```json
{
  "message": "Warehouse created successfully",
  "warehouse": {
    "id": "uuid",
    "name": "Armazém Maputo",
    "city": "Maputo",
    "address": "Av. 24 de Julho",
    "isActive": true,
    "createdAt": "2026-04-26T10:00:00.000Z",
    "updatedAt": "2026-04-26T10:00:00.000Z"
  }
}
```

---

## 4.2 Listar armazéns

```txt
GET /warehouses
```

### Headers

```txt
Authorization: Bearer jwt-token
```

### Query params opcionais

```txt
city
isActive
page
limit
```

### Input

Não tem body.

### Output `200`

```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Armazém Maputo",
      "city": "Maputo",
      "address": "Av. 24 de Julho",
      "isActive": true
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

---

## 4.3 Buscar armazém por ID

```txt
GET /warehouses/:id
```

### Headers

```txt
Authorization: Bearer jwt-token
```

### Input

Não tem body.

### Output `200`

```json
{
  "warehouse": {
    "id": "uuid",
    "name": "Armazém Maputo",
    "city": "Maputo",
    "address": "Av. 24 de Julho",
    "isActive": true
  }
}
```

---

## 4.4 Actualizar armazém

```txt
PATCH /warehouses/:id
```

### Headers

```txt
Authorization: Bearer jwt-token
```

### Input

```json
{
  "name": "Armazém Central Maputo",
  "city": "Maputo",
  "address": "Baixa de Maputo",
  "isActive": true
}
```

### Output `200`

```json
{
  "message": "Warehouse updated successfully",
  "warehouse": {
    "id": "uuid",
    "name": "Armazém Central Maputo",
    "city": "Maputo",
    "address": "Baixa de Maputo",
    "isActive": true,
    "updatedAt": "2026-04-26T10:30:00.000Z"
  }
}
```

---

## 4.5 Desactivar armazém

```txt
DELETE /warehouses/:id
```

### Headers

```txt
Authorization: Bearer jwt-token
```

### Input

Não tem body.

### Output `200`

```json
{
  "message": "Warehouse deleted successfully"
}
```

---

# 5. Stock Levels

## 5.1 Listar stock actual

```txt
GET /stock
```

### Headers

```txt
Authorization: Bearer jwt-token
```

### Query params opcionais

```txt
variantId
warehouseId
productId
city
lowStock
page
limit
```

### Exemplo

```txt
GET /stock?warehouseId=uuid&page=1&limit=10
```

### Input

Não tem body.

### Output `200`

```json
{
  "data": [
    {
      "id": "uuid",
      "variantId": "uuid",
      "variantName": "Curren Dourado",
      "sku": "CURREN-GOLD-001",
      "productId": "uuid",
      "productName": "Relógio Curren",
      "warehouseId": "uuid",
      "warehouseName": "Armazém Maputo",
      "quantity": 10
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

---

## 5.2 Ver stock de uma variante

```txt
GET /stock/:variantId
```

### Headers

```txt
Authorization: Bearer jwt-token
```

### Input

Não tem body.

### Output `200`

```json
{
  "variant": {
    "id": "uuid",
    "name": "Curren Dourado",
    "sku": "CURREN-GOLD-001"
  },
  "stock": [
    {
      "warehouseId": "uuid",
      "warehouseName": "Armazém Maputo",
      "quantity": 10
    },
    {
      "warehouseId": "uuid",
      "warehouseName": "Armazém Beira",
      "quantity": 4
    }
  ]
}
```

---

## 5.3 Ver stock de um armazém

```txt
GET /warehouses/:warehouseId/stock
```

### Headers

```txt
Authorization: Bearer jwt-token
```

### Input

Não tem body.

### Output `200`

```json
{
  "warehouse": {
    "id": "uuid",
    "name": "Armazém Maputo"
  },
  "stock": [
    {
      "variantId": "uuid",
      "variantName": "Curren Dourado",
      "sku": "CURREN-GOLD-001",
      "quantity": 10
    }
  ]
}
```

---

# 6. Stock Movements

## 6.1 Registar entrada de stock

```txt
POST /stock/in
```

### Headers

```txt
Authorization: Bearer jwt-token
```

### Input

```json
{
  "variantId": "uuid",
  "warehouseId": "uuid",
  "quantity": 10,
  "reason": "PURCHASE",
  "note": "Compra de novo lote"
}
```

### Output `201`

```json
{
  "message": "Stock entry registered successfully",
  "stockLevel": {
    "variantId": "uuid",
    "warehouseId": "uuid",
    "quantity": 20
  },
  "movement": {
    "id": "uuid",
    "type": "IN",
    "reason": "PURCHASE",
    "quantity": 10,
    "previousQuantity": 10,
    "newQuantity": 20,
    "createdAt": "2026-04-26T10:00:00.000Z"
  }
}
```

---

## 6.2 Registar saída de stock

```txt
POST /stock/out
```

### Headers

```txt
Authorization: Bearer jwt-token
```

### Input

```json
{
  "variantId": "uuid",
  "warehouseId": "uuid",
  "quantity": 3,
  "reason": "SALE",
  "note": "Venda realizada"
}
```

### Output `201`

```json
{
  "message": "Stock output registered successfully",
  "stockLevel": {
    "variantId": "uuid",
    "warehouseId": "uuid",
    "quantity": 7
  },
  "movement": {
    "id": "uuid",
    "type": "OUT",
    "reason": "SALE",
    "quantity": 3,
    "previousQuantity": 10,
    "newQuantity": 7,
    "createdAt": "2026-04-26T10:00:00.000Z"
  }
}
```

### Erro `409`

```json
{
  "message": "Insufficient stock"
}
```

---

## 6.3 Ajustar stock

```txt
POST /stock/adjust
```

### Headers

```txt
Authorization: Bearer jwt-token
```

### Input

```json
{
  "variantId": "uuid",
  "warehouseId": "uuid",
  "newQuantity": 15,
  "reason": "CORRECTION",
  "note": "Correcção após contagem física"
}
```

### Output `201`

```json
{
  "message": "Stock adjusted successfully",
  "stockLevel": {
    "variantId": "uuid",
    "warehouseId": "uuid",
    "quantity": 15
  },
  "movement": {
    "id": "uuid",
    "type": "ADJUSTMENT",
    "reason": "CORRECTION",
    "quantity": 5,
    "previousQuantity": 10,
    "newQuantity": 15,
    "createdAt": "2026-04-26T10:00:00.000Z"
  }
}
```

---

## 6.4 Listar movimentos de stock

```txt
GET /stock/movements
```

### Headers

```txt
Authorization: Bearer jwt-token
```

### Query params opcionais

```txt
variantId
warehouseId
type
reason
createdById
from
to
page
limit
```

### Exemplo

```txt
GET /stock/movements?type=OUT&from=2026-04-01&to=2026-04-30
```

### Input

Não tem body.

### Output `200`

```json
{
  "data": [
    {
      "id": "uuid",
      "variantId": "uuid",
      "variantName": "Curren Dourado",
      "warehouseId": "uuid",
      "warehouseName": "Armazém Maputo",
      "createdById": "uuid",
      "createdByName": "Marlon Nhantumbo",
      "type": "OUT",
      "reason": "SALE",
      "quantity": 3,
      "previousQuantity": 10,
      "newQuantity": 7,
      "note": "Venda realizada",
      "createdAt": "2026-04-26T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

---

## 6.5 Buscar movimento por ID

```txt
GET /stock/movements/:id
```

### Headers

```txt
Authorization: Bearer jwt-token
```

### Input

Não tem body.

### Output `200`

```json
{
  "movement": {
    "id": "uuid",
    "variantId": "uuid",
    "variantName": "Curren Dourado",
    "warehouseId": "uuid",
    "warehouseName": "Armazém Maputo",
    "createdById": "uuid",
    "createdByName": "Marlon Nhantumbo",
    "type": "IN",
    "reason": "PURCHASE",
    "quantity": 10,
    "previousQuantity": 0,
    "newQuantity": 10,
    "note": "Compra inicial",
    "createdAt": "2026-04-26T10:00:00.000Z"
  }
}
```

---

# 7. Users

## 7.1 Listar utilizadores

```txt
GET /users
```

### Headers

```txt
Authorization: Bearer jwt-token
```

### Query params opcionais

```txt
role
isActive
search
page
limit
```

### Input

Não tem body.

### Output `200`

```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Marlon Nhantumbo",
      "email": "marlon@example.com",
      "role": "ADMIN",
      "isActive": true
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

---

## 7.2 Buscar utilizador por ID

```txt
GET /users/:id
```

### Headers

```txt
Authorization: Bearer jwt-token
```

### Input

Não tem body.

### Output `200`

```json
{
  "user": {
    "id": "uuid",
    "name": "Marlon Nhantumbo",
    "email": "marlon@example.com",
    "role": "ADMIN",
    "isActive": true
  }
}
```

---

## 7.3 Actualizar utilizador

```txt
PATCH /users/:id
```

### Headers

```txt
Authorization: Bearer jwt-token
```

### Input

```json
{
  "name": "Marlon N.",
  "role": "MANAGER",
  "isActive": true
}
```

### Output `200`

```json
{
  "message": "User updated successfully",
  "user": {
    "id": "uuid",
    "name": "Marlon N.",
    "email": "marlon@example.com",
    "role": "MANAGER",
    "isActive": true
  }
}
```

---

## 7.4 Desactivar utilizador

```txt
DELETE /users/:id
```

### Headers

```txt
Authorization: Bearer jwt-token
```

### Input

Não tem body.

### Output `200`

```json
{
  "message": "User disabled successfully"
}
```

---

# 8. Códigos HTTP usados

| Código | Significado                    |
| -----: | ------------------------------ |
|  `200` | Operação realizada com sucesso |
|  `201` | Recurso criado com sucesso     |
|  `400` | Dados inválidos                |
|  `401` | Não autenticado                |
|  `403` | Sem permissão                  |
|  `404` | Recurso não encontrado         |
|  `409` | Conflito de regra de negócio   |
|  `500` | Erro interno do servidor       |

---

# 9. Regras globais

## Rotas públicas

```txt
POST /auth/register
POST /auth/login
```

## Rotas privadas

Todas as outras rotas devem receber:

```txt
Authorization: Bearer jwt-token
```

## Stock

O stock não deve ser alterado directamente.

Não criar endpoint assim:

```txt
PATCH /stock/:id
```

Usar apenas:

```txt
POST /stock/in
POST /stock/out
POST /stock/adjust
```

## Soft delete

Para MVP, usar soft delete:

```txt
products.status = INACTIVE
product_variants.is_active = false
warehouses.is_active = false
users.is_active = false
```

```
```
