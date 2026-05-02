# 💸 My Finance

Full-stack financial management application for personal expense tracking, income control, reports, charts and profile customization.

> Private production deployment with real usage.

---

## 📸 Preview

<p align="center">
  <img src="./src/assets/login.png" width="48%" />
  <img src="./src/assets/dashboard.png" width="48%" />
  <img src="./src/assets/metas.png" width="48%" />
  <img src="./src/assets/dashboard.png" width="48%" />
</p>

<p align="center">
  <img src="./src/assets/relatorios.png" width="48%" />
  <img src="./src/assets/settings.png" width="48%" />
</p>

---

## 🚀 Tech Stack

### Frontend

* React.js
* Vite
* React Router DOM
* Axios
* Recharts
* Pure CSS

### Backend

* Node.js
* Express
* Prisma ORM
* PostgreSQL
* JWT
* Multer
* Cloudinary

### Infrastructure

* PostgreSQL hosted on Neon
* Frontend hosted on Netlify
* API hosted on Vercel

---

## ✨ Features

### Authentication

* User registration
* Login with username or email
* JWT authentication
* Public and protected routes

### Dashboard

* Financial summary
* Current balance
* Total income
* Total expenses
* Paid bills
* Pending bills
* Monthly period filter
* Search and advanced filters
* Automatic financial insights

### Income Management

* Create income
* Edit income
* Delete income
* Filter by period and category

### Expense Management

* Create expense
* Edit expense
* Mark as paid
* Mark as pending
* Delete expense
* Recurring expense option

### Reports

* Monthly financial reports
* Paid and pending bills summary
* PDF export

### Charts

* Financial overview
* Interactive charts with Recharts

### Profile

* Update username
* Upload avatar
* Profile customization
* Password update
* Account deletion

### Financial Goals

* Create financial goals
* Track target value
* Track current value
* Set deadline

---

## 📁 Project Structure

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

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone <repository-url>
```

### 2. Backend

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=3000
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/finance_db"
JWT_SECRET="your_secret_key"
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
```

Run Prisma migrations:

```bash
npx prisma migrate dev
```

Start the backend server:

```bash
npm run dev
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 📦 Build

```bash
npm run build
```

Generates the `dist/` folder for production.

---

## 🔗 Main API Routes

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

## 🗺️ Roadmap

* Light/dark theme
* More accessibility improvements
* Advanced category management
* More detailed financial insights
* Mobile layout improvements

---

## 📄 License

This project was built for study, portfolio and real usage.
