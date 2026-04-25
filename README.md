# Finance

Aplicação fullstack para organização financeira pessoal, com autenticação, controle de entradas e despesas, dashboard interativo, gráficos e personalização de perfil.

## Tecnologias

### Frontend

* React
* Vite
* React Router DOM
* Axios
* Recharts
* CSS puro

### Backend

* Node.js
* Express
* Prisma ORM
* PostgreSQL
* JWT
* Multer

---

## Funcionalidades

### Autenticação

* Cadastro de usuário
* Login com username ou email
* Autenticação com JWT
* Rotas públicas e privadas

### Dashboard

* Resumo financeiro
* Saldo atual
* Total de entradas
* Total de despesas
* Contas pagas
* Contas pendentes

### Entradas

* Criar entrada
* Editar entrada
* Remover entrada

### Despesas

* Criar despesa
* Editar despesa
* Marcar como paga
* Marcar como pendente
* Remover despesa

### Gráficos

* Visão geral de entradas e saídas
* Gráfico interativo

### Perfil

* Alterar username
* Upload de avatar
* Atualização de perfil

---

## Estrutura do projeto

```bash
finance/
 ├── backend/
 └── frontend/
```

### Backend

```bash
backend/
 ├── prisma/
 ├── src/
 ├── uploads/
 ├── .env
 └── package.json
```

### Frontend

```bash
frontend/
 ├── src/
 ├── public/
 └── package.json
```

---

## Instalação

### 1. Clone o projeto

```bash
git clone <url-do-repositorio>
```

---

### 2. Backend

```bash
cd backend
npm install
```

Crie o arquivo `.env`:

```env
PORT=3000
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/finance_db"
JWT_SECRET="your_secret_key"
```

Rode as migrations:

```bash
npx prisma migrate dev
```

Inicie o servidor:

```bash
npm run dev
```

---

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Build

### Frontend

```bash
npm run build
```

Gera a pasta `dist/` pronta para produção.

---

## Rotas principais

### Auth

* `POST /auth/register`
* `POST /auth/login`

### User

* `GET /user/me`
* `PATCH /user/profile`

### Incomes

* `POST /incomes`
* `GET /incomes`
* `PATCH /incomes/:id`
* `DELETE /incomes/:id`

### Expenses

* `POST /expenses`
* `GET /expenses`
* `PATCH /expenses/:id`
* `PATCH /expenses/:id/pay`
* `PATCH /expenses/:id/pending`
* `DELETE /expenses/:id`

### Dashboard

* `GET /dashboard/summary`

### Charts

* `GET /charts/financial-overview`

---

## Próximos passos

* Deploy
* Filtro por mês
* Categorias
* Melhorias de acessibilidade
* Tema claro/escuro

---

## Licença

Projeto para fins de estudo e portfólio.
