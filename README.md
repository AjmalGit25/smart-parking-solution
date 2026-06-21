# 🚗 Smart Parking Solution

A full-stack MERN application for hassle-free, smart vehicle parking management. Users can browse real-time parking slot availability, book slots, check out with auto-calculated fees, and manage their bookings — while admins get a full dashboard with revenue stats and booking oversight.

---

## 🧩 Problem Statement

Urban parking is chaotic. Drivers waste time circling lots looking for free spaces, there's no visibility into availability, and manual management is error-prone. This system solves that with a digital, real-time slot management platform accessible from any browser.

---

## ✅ Solution

- Visual floor-by-floor parking map with live slot status (available / occupied / reserved)
- One-click booking with vehicle number registration
- Automatic hourly fee calculation on checkout ($50/hour, minimum 1 hour)
- Role-based access: regular users manage their own bookings; admins oversee everything
- Secure JWT authentication with bcrypt password hashing

---

## 🛠 Tech Stack

| Layer     | Technology                              |
|-----------|-----------------------------------------|
| Frontend  | React 19, Vite, Tailwind CSS v4, Axios  |
| Backend   | Node.js, Express 5                      |
| Database  | MongoDB, Mongoose                       |
| Auth      | JWT (jsonwebtoken), bcryptjs            |
| Dev Tools | Nodemon, react-hot-toast, react-router-dom |

---

## 📁 Folder Structure

```
Smart Parking Solution/
├── backend/
│   ├── controllers/
│   │   ├── authController.js       # register, login, getMe
│   │   ├── bookingController.js    # create, list, checkout, cancel
│   │   └── slotController.js       # CRUD + seed slots
│   ├── middleware/
│   │   └── authMiddleware.js       # JWT protect + adminOnly guards
│   ├── models/
│   │   ├── User.js                 # name, email, password (hashed), role
│   │   ├── Slot.js                 # slotNumber, floor, type, status
│   │   └── Booking.js              # user, slot, vehicle, times, amount
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── slotRoutes.js
│   │   └── bookingRoutes.js
│   ├── .env                        # environment variables (not committed)
│   ├── .env.example
│   ├── .gitignore
│   ├── index.js                    # Express entry point
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── context/
    │   │   └── AuthContext.jsx     # global user state, login/logout
    │   ├── components/
    │   │   └── Navbar.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx       # parking map + booking modal
    │   │   ├── Bookings.jsx        # user's bookings with checkout/cancel
    │   │   └── Admin.jsx           # stats + all bookings table
    │   ├── services/
    │   │   └── api.js              # axios instance with JWT interceptor
    │   ├── App.jsx                 # routes + private route guard
    │   ├── main.jsx
    │   └── index.css               # Tailwind import + base styles
    ├── .gitignore
    ├── vite.config.js              # Vite + Tailwind plugin + /api proxy
    └── package.json
```

---

## 🔌 API Reference

Base URL: `http://localhost:5000/api`

### Auth — `/api/auth`

| Method | Endpoint    | Auth     | Description              |
|--------|-------------|----------|--------------------------|
| POST   | `/register` | —        | Create a new user account |
| POST   | `/login`    | —        | Login and receive JWT     |
| GET    | `/me`       | User     | Get current user profile  |

**Register / Login body:**
```json
{
  "name": "Ajmal Hussain",
  "email": "ajmal@email.com",
  "password": "secret123",
  "role": "user"
}
```

---

### Slots — `/api/slots`

| Method | Endpoint     | Auth     | Description                        |
|--------|--------------|----------|------------------------------------|
| GET    | `/`          | User     | Get all parking slots               |
| POST   | `/seed`      | Admin    | Seed 20 default slots (2 floors)    |
| POST   | `/`          | Admin    | Create a single slot                |
| PUT    | `/:id`       | Admin    | Update slot (status, type, etc.)    |
| DELETE | `/:id`       | Admin    | Delete a slot                       |

**Slot object:**
```json
{
  "slotNumber": "F1-03",
  "floor": 1,
  "type": "standard | disabled | ev",
  "status": "available | occupied | reserved"
}
```

---

### Bookings — `/api/bookings`

| Method | Endpoint          | Auth     | Description                          |
|--------|-------------------|----------|--------------------------------------|
| POST   | `/`               | User     | Book an available slot               |
| GET    | `/my`             | User     | Get current user's bookings          |
| GET    | `/`               | Admin    | Get all bookings (admin only)        |
| PUT    | `/:id/checkout`   | User     | Check out — calculates total fee     |
| PUT    | `/:id/cancel`     | User     | Cancel an active booking             |

**Create booking body:**
```json
{
  "slotId": "<mongoId>",
  "vehicleNumber": "ABC-123"
}
```

**Checkout response includes:**
```json
{
  "status": "completed",
  "endTime": "...",
  "totalAmount": 150
}
```

> Fee is calculated as: `ceil((endTime - startTime) / 1hr) × $50`, minimum 1 hour.

---

## ⚙️ Environment Variables

Create `backend/.env` (use `backend/.env.example` as a template):

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/smart_parking
JWT_SECRET=your_jwt_secret_key_change_this
```

---

## 🚀 Setup & Run

### Prerequisites
- Node.js v18+
- MongoDB running locally (or a MongoDB Atlas URI)

### 1. Clone the repo

```bash
git clone <repo-url>
cd "Smart Parking Solution"
```

### 2. Backend

```bash
cd backend
npm install
npm run dev        # starts on http://localhost:5000
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev        # starts on http://localhost:5173
```

> The Vite dev server proxies `/api` requests to `http://localhost:5000` automatically — no CORS issues.

### 4. Seed parking slots

Log in as an **admin** user, then click the **"Seed Slots"** button on the Dashboard to populate 20 slots across 2 floors. Alternatively:

```bash
curl -X POST http://localhost:5000/api/slots/seed \
  -H "Authorization: Bearer <your_admin_token>"
```

---

## 👤 Roles

| Role  | Capabilities                                                         |
|-------|----------------------------------------------------------------------|
| user  | View slots, book a slot, view own bookings, checkout, cancel         |
| admin | All user capabilities + seed slots, manage all slots, view all bookings + revenue stats |

Set the role during registration by selecting **Admin** from the dropdown.

---

## 📸 Pages Overview

| Page       | Route       | Access | Description                              |
|------------|-------------|--------|------------------------------------------|
| Login      | `/login`    | Public | Email + password login                   |
| Register   | `/register` | Public | Create account with role selection       |
| Dashboard  | `/`         | User   | Live parking map, click slot to book     |
| My Bookings| `/bookings` | User   | View, checkout, or cancel your bookings  |
| Admin      | `/admin`    | Admin  | Revenue stats + full bookings table      |

---

## 🔒 Security Notes

- Passwords are hashed with **bcryptjs** (salt rounds: 10) — never stored in plain text
- JWTs expire after **7 days**
- The `.env` file is excluded from version control via `.gitignore`
- Admin-only routes are protected by both JWT middleware and a role check

---

## 📄 License

ISC © Ajmal Hussain
