# 🦷 OroGlee — Dentist Appointment Booking Platform

A full-stack MERN application for booking dental appointments. Built as part of the OroGlee technical assignment.

---

## 🚀 Live Demo

> Add your deployed links here after deployment:
- **Frontend:** `https://oroglee.vercel.app`
- **Backend API:** `https://oroglee-api.onrender.com`

---

## 🛠️ Tech Stack

| Layer     | Technology                                          |
|-----------|-----------------------------------------------------|
| Frontend  | React.js 18, React Router v6, Tailwind CSS          |
| Backend   | Node.js, Express.js                                 |
| Database  | MongoDB (Mongoose ODM)                              |
| Auth      | JWT (JSON Web Tokens) + bcryptjs                    |
| HTTP      | Fetch API (native)                                  |

---

## 📁 Project Structure

```
oroglee-dentist/
├── backend/
│   ├── models/
│   │   ├── Dentist.js          # Dentist schema
│   │   └── Appointment.js      # Appointment schema
│   ├── routes/
│   │   ├── dentistRoutes.js    # GET/POST/PUT/DELETE dentists
│   │   ├── appointmentRoutes.js# POST/GET/PATCH appointments
│   │   └── adminRoutes.js      # Admin login & token verify
│   ├── middleware/
│   │   └── auth.js             # JWT auth middleware
│   ├── seed/
│   │   └── seedDentists.js     # Seed 8 demo dentists
│   ├── server.js               # Express entry point
│   ├── .env.example            # Environment variable template
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx          # Top navigation
│   │   │   ├── DentistCard.jsx     # Individual dentist card
│   │   │   ├── AppointmentModal.jsx# Booking form modal
│   │   │   ├── LoadingSkeleton.jsx # Shimmer loading state
│   │   │   ├── Pagination.jsx      # Page controls
│   │   │   ├── StatusBadge.jsx     # Appointment status pill
│   │   │   └── ProtectedRoute.jsx  # Admin route guard
│   │   ├── pages/
│   │   │   ├── HomePage.jsx        # Dentist listing + search
│   │   │   ├── AdminPage.jsx       # Admin dashboard
│   │   │   └── AdminLoginPage.jsx  # Admin login
│   │   ├── hooks/
│   │   │   └── useAuth.js          # Auth context + hook
│   │   ├── utils/
│   │   │   └── api.js              # All API call functions
│   │   ├── App.js                  # Router + layout
│   │   ├── index.js                # React root
│   │   └── index.css               # Tailwind + global styles
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
│
├── package.json    # Root — run both with concurrently
├── .gitignore
└── README.md
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js v16+
- MongoDB running locally (or MongoDB Atlas URI)
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/oroglee-dentist.git
cd oroglee-dentist
```

### 2. Install All Dependencies
```bash
npm run install:all
```

Or manually:
```bash
# Root
npm install

# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### 3. Configure Environment Variables

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/oroglee_dentist
JWT_SECRET=your_super_secret_key_here
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

### 4. Seed the Database (Optional but recommended)
```bash
npm run seed
# Seeds 8 pre-built dentist profiles across Indian cities
```

### 5. Run the Application

**Development mode (both frontend + backend):**
```bash
npm run dev
```

**Or run separately:**
```bash
# Terminal 1 - Backend
npm run start:backend   # Runs on http://localhost:5000

# Terminal 2 - Frontend
npm run start:frontend  # Runs on http://localhost:3000
```

---

## 📡 API Reference

### Base URL: `http://localhost:5000/api`

#### Dentist Endpoints

| Method | Endpoint              | Auth? | Description                        |
|--------|-----------------------|-------|------------------------------------|
| GET    | `/dentists`           | ❌    | List all dentists (search, filter, paginate) |
| GET    | `/dentists/:id`       | ❌    | Get single dentist                 |
| POST   | `/dentists`           | ✅    | Add new dentist (admin)            |
| PUT    | `/dentists/:id`       | ✅    | Update dentist (admin)             |
| DELETE | `/dentists/:id`       | ✅    | Delete dentist (admin)             |

**Query params for GET `/dentists`:**
- `search` — search by name, specialization, clinic
- `location` — filter by city
- `page` — page number (default: 1)
- `limit` — results per page (default: 10)

#### Appointment Endpoints

| Method | Endpoint                        | Auth? | Description                    |
|--------|---------------------------------|-------|--------------------------------|
| POST   | `/appointments`                 | ❌    | Book a new appointment         |
| GET    | `/appointments`                 | ✅    | List all appointments (admin)  |
| PATCH  | `/appointments/:id/status`      | ✅    | Update appointment status      |

**Query params for GET `/appointments`:**
- `status` — filter by `Booked`, `Completed`, `Cancelled`
- `page`, `limit` — pagination

#### Admin Endpoints

| Method | Endpoint           | Auth? | Description           |
|--------|--------------------|-------|-----------------------|
| POST   | `/admin/login`     | ❌    | Login, get JWT token  |
| POST   | `/admin/verify`    | ❌    | Verify JWT token      |

---

## 🗄️ Database Schema

### Dentist
```js
{
  name: String (required),
  qualification: String (required),
  yearsOfExperience: Number (required),
  clinicName: String (required),
  address: String (required),
  location: String (required),
  photo: String,
  specialization: String,
  rating: Number (1–5),
  availableDays: [String],
  timestamps: true
}
```

### Appointment
```js
{
  patientName: String (required),
  age: Number (required, 1–120),
  gender: Enum ['Male', 'Female', 'Other'] (required),
  appointmentDate: Date (required),
  dentist: ObjectId → ref: Dentist (required),
  status: Enum ['Booked', 'Completed', 'Cancelled'] (default: 'Booked'),
  notes: String,
  timestamps: true
}
```

---

## ✨ Features

### User Features
- 🔍 **Search** dentists by name, specialization, or clinic
- 📍 **Filter** by city/location
- 📄 **Pagination** — 9 dentists per page
- 📅 **Book appointments** with form validation
- ✅ **Success confirmation** after booking

### Admin Features
- 🔐 **Admin login** with JWT authentication
- 📊 **Dashboard stats** — total, booked, completed, cancelled
- 📋 **Appointments table** with status updates
- ➕ **Add dentist** from admin panel
- 🔽 **Filter appointments** by status

### Bonus Features Implemented
- ✅ Admin authentication (JWT)
- ✅ Dentist search & location filter
- ✅ Appointment status (Booked / Completed / Cancelled)
- ✅ Pagination (frontend + backend)
- ✅ Form validation (frontend + backend)
- ✅ Mobile-responsive design

---

## 🌐 Deployment Guide

### Backend → Render
1. Push code to GitHub
2. Create new Web Service on [Render](https://render.com)
3. Set root directory to `backend`
4. Add environment variables from `.env`
5. Build command: `npm install`
6. Start command: `node server.js`

### Frontend → Vercel
1. Import GitHub repo on [Vercel](https://vercel.com)
2. Set root directory to `frontend`
3. Add env variable: `REACT_APP_API_URL=https://your-backend.onrender.com/api`
4. Deploy!

---

## 🧑‍💻 Author

Built by **[Your Name]** as part of the OroGlee MERN Stack Assignment.

---

*Default admin credentials: `admin` / `admin123` (change in production!)*
