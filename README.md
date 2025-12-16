# 📚 Library Management System API

A fully functional **RESTful Library Management System API** built using **Node.js, Express, and MySQL**. This project demonstrates real-world backend engineering concepts such as **state machines**, **business rule enforcement**, **database transactions**, and **relational data modeling**.

This system manages **books**, **members**, **borrowing transactions**, and **fines**, ensuring data integrity and accurate reflection of library workflows.

---

## 🚀 Features

### 📘 Books
- Full CRUD operations
- Track total and available copies
- List only available books

### 👤 Members
- Full CRUD operations
- Track member status (`active`, `suspended`)
- View books currently borrowed by a member

### 🔄 Transactions
- Borrow and return books
- Enforces borrowing rules:
  - Max 3 active borrows per member
  - No borrowing with unpaid fines
  - Cannot borrow if suspended
- Automatic due date calculation (14 days)

### 💰 Fines
- Automatic fine calculation for overdue books ($0.50/day)
- Track paid and unpaid fines

### 🛑 State & Business Rules
- Atomic borrow/return operations using DB transactions
- Auto-suspend members with 3+ concurrently overdue books
- Accurate state transitions for books and transactions

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **DB Driver**: mysql2
- **API Testing**: Postman

---

## 📂 Project Structure

```
src/
├── app.js
├── server.js
├── config/
│   └── db.js
├── routes/
│   ├── book.routes.js
│   ├── member.routes.js
│   ├── transaction.routes.js
│   └── fine.routes.js
├── controllers/
│   ├── book.controller.js
│   ├── member.controller.js
│   ├── transaction.controller.js
│   └── fine.controller.js
├── services/
│   ├── book.service.js
│   ├── member.service.js
│   ├── transaction.service.js
│   └── fine.service.js
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone <your-repo-url>
cd library-management-api
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Configure Database
Create a MySQL database:
```sql
CREATE DATABASE library_db;
```

Update `src/config/db.js` with your MySQL credentials.

### 4️⃣ Create Tables
Run the SQL scripts for:
- `books`
- `members`
- `transactions`
- `fines`

(Provided in the repository or README appendix)

### 5️⃣ Start the Server
```bash
node src/server.js
```

Server runs at:
```
http://localhost:3000
```

---

## 📡 API Endpoints

### 📘 Books
- `POST /books`
- `GET /books`
- `GET /books/{id}`
- `PUT /books/{id}`
- `DELETE /books/{id}`
- `GET /books/available`

### 👤 Members
- `POST /members`
- `GET /members`
- `GET /members/{id}`
- `PUT /members/{id}`
- `DELETE /members/{id}`
- `GET /members/{id}/borrowed`

### 🔄 Transactions
- `POST /transactions/borrow`
- `POST /transactions/{id}/return`
- `GET /transactions/overdue`

### 💰 Fines
- `POST /fines/{id}/pay`

---

## 🔁 State Machine Design

### Book State
- Availability controlled via `available_copies`
- Prevents borrowing when `available_copies = 0`

### Transaction State
- `active` → book currently borrowed
- `returned` → returned on time
- `overdue` → returned late

### Member State
- `active` → allowed to borrow
- `suspended` → blocked due to 3+ concurrent overdue books

All state transitions are validated and executed within **database transactions** to ensure consistency.

---

## 🧪 API Testing (Postman)

A complete Postman collection is included in this repository to test all API endpoints.

**File location:**
postman/Library_Management_System_API.postman_collection.json


### How to use:
1. Open Postman
2. Click **Import**
3. Select the above JSON file
4. Update the `baseUrl` variable if needed (default: http://localhost:3000)
5. Run requests in order (Books → Members → Transactions → Fines)

---

## 📌 Key Learnings

- Implementing state machines in backend systems
- Enforcing complex business rules
- Handling concurrency with DB transactions
- Designing scalable REST APIs

---

## ✅ Status

✔ All core requirements implemented
✔ Business rules enforced
✔ Ready for evaluation and submission

---

## 👤 Author

**Ch V M Kiran**
23P31A4211

