# 📦 Desafio Técnico – Vertical Logística

Este projeto foi desenvolvido como solução para o desafio técnico da **Vertical Logística (Luiza Labs)**.  
O objetivo é processar um arquivo de pedidos do sistema legado, normalizar os dados e disponibilizá-los via **API REST** com suporte a filtros.

---

## 🚀 Objetivo

Criar um sistema que:

1. Receba um arquivo `.txt` via **upload**.
2. Processe os dados legados com base no layout fixo.
3. Agrupe pedidos por usuário e calcule os totais.
4. Disponibilize o resultado via API REST.
5. Permita filtros opcionais:
   - `user_id`
   - `order_id`
   - Intervalo de datas (`start_date` e `end_date`)
   - Data exata (`date`)

---

## 📂 Estrutura do Projeto

```
├── app.js                 # Configuração do Express e middlewares globais
├── server.js              # Inicialização do servidor
├── routes/                # Definição das rotas da API
├── controllers/           # Controladores que lidam com as requisições
├── services/              # Regras de negócio e processamento de arquivos
├── utils/                 # Funções utilitárias (cache, parsing)
│   ├── cache.js
│   └── orderParser.js
├── middlewares/           # Middlewares globais (tratamento de erros)
├── uploads/               # Pasta temporária para arquivos enviados
├── __tests__/             # Testes
└── README.md              # Documentação do projeto
```

---

## 🛠️ Tecnologias Utilizadas

- **Node.js**
- **Express.js**
- **Multer** – Upload de arquivos
- **Readline (fs)** – Leitura de arquivos linha a linha
- **express-rate-limit** – Limite de requisições
- **CORS**
- **JavaScript ES6+**
- **Jest** – Testes automatizados

---

## 📜 Arquitetura e Padrões

- **Separação de responsabilidades**  
  Controllers → Services → Utils  
  Mantendo a responsabilidade isolada em cada camada.
  
- **Padrão SOLID aplicado**  
  Cada função e módulo tem uma responsabilidade única.
  
- **Cache em memória**  
  Para evitar reprocessamento de arquivos e melhorar performance.

---

## 📥 Entrada de Dados (arquivo legado)

Formato fixo de **95 caracteres por linha**:

| Campo          | Tamanho | Tipo        |
|----------------|---------|-------------|
| `user_id`      | 10      | Numérico    |
| `name`         | 45      | Texto       |
| `order_id`     | 10      | Numérico    |
| `product_id`   | 10      | Numérico    |
| `value`        | 12      | Decimal     |
| `date`         | 8       | Numérico (YYYYMMDD) |

---

## 📤 Saída da API

```json
[
  {
    "user_id": 1,
    "name": "Zarelli",
    "orders": [
      {
        "order_id": 123,
        "total": "1024.48",
        "date": "2021-12-01",
        "products": [
          { "product_id": 111, "value": "512.24" },
          { "product_id": 122, "value": "512.24" }
        ]
      }
    ]
  }
]
```

---

## 📡 Endpoints

### 1️⃣ Upload de Arquivo
**POST** `/api/upload`  
Envia um arquivo `.txt` para processamento.

**Body (form-data):**
```
file: pedidos.txt
```

**Response:**
```json
{
  "message": "File processed successfully.",
  "data": [ ... ]
}
```

---

### 2️⃣ Listagem de Pedidos
**GET** `/api/orders`  
Retorna pedidos processados com filtros opcionais.

**Query Params:**
- `user_id` → Filtra por usuário
- `order_id` → Filtra por pedido
- `start_date` e `end_date` → Filtra por intervalo de datas (YYYY-MM-DD)
- `date` → Filtra por data exata (YYYY-MM-DD)

**Exemplo:**
```
GET /api/orders?start_date=2021-01-01&end_date=2021-12-31
```

---

## ▶️ Como Executar

### 1. Clonar o repositório
```bash
git clone https://github.com/seu-usuario/desafio-vertical-logistica.git
cd desafio-vertical-logistica
```

### 2. Instalar dependências
```bash
npm install
```

### 3. Criar pasta para uploads (se não existir)
```bash
mkdir uploads
```

### 4. Executar o servidor
```bash
npm run start
```

Servidor disponível em:
```
http://localhost:3000
```

---

## 🧪 Testes
Para rodar os testes:
```bash
npm run test
```

---

## 💡 Decisões Técnicas

- **Multer** para upload por ser simples e amplamente usado no Node.js.
- **Readline** para leitura eficiente de arquivos grandes sem carregar tudo em memória.
- **Cache em memória** para manter os dados processados até reinício do servidor.
- **Arquitetura modular** para facilitar manutenção e evolução.

---
