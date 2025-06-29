# Finease – Personal Finance Tracker

Finease is a modern, full-stack personal finance tracker that helps users manage expenses, analyze spending, and set monthly budgets. Built with Next.js, Express, MongoDB, and Tailwind CSS, it features robust authentication, analytics, and a user-friendly UI.

---

## 🚀 Features

- **User Authentication** (JWT-secured)
- **Expense Management:** Add, edit, delete, filter, and search expenses
- **Category & Payment Method Management**
- **Analysis & Visualization:**
  - Total spent, top category, top payment methods
  - Pie and line charts for category and time-based analysis
  - Custom date range selector for analysis
- **Monthly Budget:** View and edit monthly spend limit

---

## 🛠️ Tech Stack

- **Frontend:** Next.js (React), Tailwind CSS
- **Backend:** Express.js, MongoDB (Mongoose)
- **Authentication:** JWT

---

## ⚡ Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd finease
```

### 2. Install dependencies

```bash
# For frontend
npm install
# For backend (in /server)
cd server && npm install
```

### 3. Environment Variables

Create a `.env` file in the root and add:

```
NEXT_PUBLIC_BASE_URL=https://finease-0dj7.onrender.com/api
```

(See `.env.example` for reference)

### 4. Run the development server

```bash
npm run dev
# or
yarn dev
```

### 5. Start the backend

```bash
cd server
npm start
```

---

## 🧩 Project Structure

- `/src/app` – Next.js app pages and layouts
- `/src/components` – UI components (charts, modals, filter bar, etc.)
- `/server` – Express backend (controllers, models, routes)

---

## 📦 Deployment

- Environment variables managed via `.env` files
- Ready for deployment on Vercel, Render, or any Node.js hosting

---

## 🙌 Credits

- Built by Amritpal Singh

---

## 📄 License

MIT
