# 💰 ExpenseIQ — College Expense Tracker

A full-stack expense tracker built with **React + Spring Boot + MySQL** for a college project.
No login required. Clean, dark UI with charts, budget planner, and monthly reports..

---

## 🖥️ Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | React 18, Vite, Recharts, Axios   |
| Backend   | Spring Boot 3.2, Spring Data JPA  |
| Database  | MySQL 8                           |
| Styling   | Pure CSS (no Tailwind/Bootstrap)  |
| API Docs  | Swagger UI                        |

---

## 📁 Project Structure

```
expense-app/
├── backend/               ← Spring Boot API
│   ├── schema.sql         ← Database schema + sample data
│   ├── src/main/java/com/college/expense/
│   │   ├── controller/    ← REST endpoints
│   │   ├── service/       ← Business logic
│   │   ├── repository/    ← JPA queries
│   │   ├── model/         ← Entity classes
│   │   ├── dto/           ← Request/Response objects
│   │   └── exception/     ← Error handling
│   └── src/main/resources/
│       └── application.properties
│
└── frontend/              ← React app
    └── src/
        ├── pages/         ← Dashboard, Transactions, Budget, Reports
        ├── components/    ← Sidebar, TransactionModal, MonthSelector
        ├── api/           ← Axios API calls
        └── utils/         ← Formatters and constants
```

---

## 🚀 How to Run

### Prerequisites
- Java 17+
- Node.js 18+
- MySQL 8+
- Maven

---

### Step 1: Set up MySQL

Open MySQL and run:

```sql
CREATE DATABASE expense_tracker;
```

Then run `backend/schema.sql` to create tables and insert sample data:
```bash
mysql -u root -p expense_tracker < backend/schema.sql
```

---

### Step 2: Configure database password

Open `backend/src/main/resources/application.properties` and update:

```properties
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

---

### Step 3: Start the backend

```bash
cd backend
./mvnw spring-boot:run
```

Backend runs on → **http://localhost:8080**
Swagger UI → **http://localhost:8080/swagger-ui.html**

---

### Step 4: Start the frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on → **http://localhost:5173** ✅

---

## 📱 Features

| Page         | Features                                                          |
|--------------|-------------------------------------------------------------------|
| Dashboard    | Income/expense/balance cards, bar chart, pie chart, recent txns  |
| Transactions | Add/edit/delete, filter by type, monthly view                     |
| Budget       | Set per-category budgets, visual progress bars, overspend alerts  |
| Reports      | Monthly summary, trend chart, category breakdown, full table      |

---

## 🔗 API Endpoints

| Method | URL                                  | Description                     |
|--------|--------------------------------------|---------------------------------|
| GET    | `/api/dashboard?month=4&year=2025`   | Dashboard summary               |
| GET    | `/api/transactions`                  | All transactions                |
| GET    | `/api/transactions/monthly?month=4&year=2025` | Filter by month        |
| POST   | `/api/transactions`                  | Add transaction                 |
| PUT    | `/api/transactions/{id}`             | Update transaction              |
| DELETE | `/api/transactions/{id}`             | Delete transaction              |
| GET    | `/api/budgets?month=4&year=2025`     | Get budgets with spending       |
| POST   | `/api/budgets`                       | Set/update a budget             |
| DELETE | `/api/budgets/{id}`                  | Remove a budget                 |

---

## 📦 Categories

`Food` · `Travel` · `Shopping` · `Rent` · `Bills` · `Education` · `Health` · `Other`

---

## 💡 Sample API request (curl)

```bash
# Add an expense
curl -X POST http://localhost:8080/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "title": "College canteen",
    "amount": 120,
    "type": "EXPENSE",
    "category": "Food",
    "date": "2025-04-25"
  }'

# Set a budget
curl -X POST http://localhost:8080/api/budgets \
  -H "Content-Type: application/json" \
  -d '{
    "category": "Food",
    "amount": 3000,
    "month": 4,
    "year": 2025
  }'
```

---

## 🎓 What This Project Covers

- REST API design with Spring Boot
- JPA entities, repositories, and custom JPQL queries
- DTOs to separate API from database layers
- Global error handling
- React with hooks (useState, useEffect)
- Client-side routing with React Router
- Data visualization with Recharts
- Responsive CSS without any framework
- Axios for HTTP requests
