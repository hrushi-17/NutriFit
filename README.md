<div align="center">

# 🔥 NutriFit

### *A Premium Fitness & Nutrition Tracker*

[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![.NET](https://img.shields.io/badge/.NET-8.0-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)](https://dotnet.microsoft.com/)
[![MySQL](https://img.shields.io/badge/MySQL-Railway-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://railway.app/)
[![Vercel](https://img.shields.io/badge/Frontend-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
[![Render](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://render.com/)
[![Railway](https://img.shields.io/badge/Database-Railway-0B0D0E?style=for-the-badge&logo=railway&logoColor=white)](https://railway.app/)

**NutriFit** is a full-stack fitness and nutrition web application built with a premium Netflix-inspired dark UI. It provides personalized workout plans, diet recommendations, BMI tracking, goal management, and real-time body progress analytics — all in one streamlined dashboard.

[🌐 Live Demo](https://your-vercel-url.vercel.app) · [🐛 Report Bug](https://github.com/hrushi-17/NutriFit/issues) · [✨ Request Feature](https://github.com/hrushi-17/NutriFit/issues)

</div>

---

## 📸 Screenshots

> Netflix-inspired dark cinematic UI with dynamic glassmorphism, red accent glows, and real-time analytics.

| Dashboard | Admin Panel | Goal Tracker |
|-----------|-------------|--------------|
| BMI Report, Workout & Diet Cards | User Profile, Progress Graph | Dynamic Status Badges |

---

## ✨ Features

### 👤 User Side
- 🔐 **JWT Authentication** — Secure login, registration, forgot/reset password
- 📊 **Personal Dashboard** — BMI, Workouts, Diet, Goals, Progress all in one view
- 🏋️ **Workout Planner** — Personalized routines with intensity color-coding
- 🥗 **Diet Planner** — Personalized meal plans by type (Breakfast, Lunch, Dinner, Snack)
- 🎯 **Goal Tracker** — Set, track and dynamically complete Weight Loss / Muscle Gain goals
- 📈 **Progress Graph** — Real-time weight + BMI chart with Chart.js
- 🩺 **BMI Report** — Animated BMI circle with dynamic health tier coloring
- 💪 **Health Conditions** — Track and manage personal health conditions

### 🛡️ Admin Side
- 👥 **User Management** — Browse all registered users
- 📋 **Full User Profile** — Age, height, weight, BMI health stats
- 📉 **Progress Analytics** — Per-user Weight & BMI chart
- 🎯 **Goal & Body Status** — Real-time active target and body status cards
- 🩺 **Health Conditions** — View user-reported health issues

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, React Router DOM, Bootstrap 5, Chart.js, jQuery |
| **Backend** | ASP.NET Core 8 Web API (C#) |
| **Database** | MySQL (hosted on Railway) |
| **Authentication** | JWT Bearer Tokens |
| **Styling** | Vanilla CSS — Netflix dark glassmorphism, gradients, animations |
| **Deployment** | Vercel (frontend) + Render (backend) + Railway (MySQL) |

---

## 📁 Project Structure

```
NutriFit/
├── backend/
│   └── NutriFit.Api/
│       └── NutriFit.Api/
│           ├── Controllers/        # API Controllers
│           │   ├── AuthController.cs
│           │   ├── ProfileController.cs
│           │   ├── WorkoutController.cs
│           │   ├── DietController.cs
│           │   ├── GoalsController.cs
│           │   ├── ProgressController.cs
│           │   ├── AdminController.cs
│           │   └── UserHealthController.cs
│           ├── Models/             # Entity / DB models
│           ├── DTOs/               # Data Transfer Objects
│           ├── Data/               # DB context / connection
│           ├── Program.cs          # App entry point + DI
│           ├── appsettings.json    # Configuration
│           └── Dockerfile          # Docker config for Render
│
└── frontend/
    └── nutrifit-ui/
        ├── public/
        │   └── images/             # Logo and static assets
        └── src/
            ├── api/
            │   └── axios.js        # Axios base config + interceptors
            ├── components/
            │   └── Navbar.js       # Responsive Netflix navbar
            ├── pages/
            │   ├── Home.js
            │   ├── Login.js / Register.js
            │   ├── ForgotPassword.js / ResetPassword.js
            │   ├── Dashboard.js    # User dashboard shell
            │   ├── BmiPage.js
            │   ├── WorkoutPage.js
            │   ├── DietPage.js
            │   ├── GoalPage.js
            │   ├── ProgressPage.js
            │   ├── Profile.js
            │   ├── UserHealth.js
            │   ├── AdminDashboard.js
            │   └── AdminHealth.js
            └── styles/             # Component and page CSS files
```

---

## 🔌 API Endpoints

### 🔐 Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register new user or admin |
| `POST` | `/api/auth/login` | Login and get JWT token |
| `POST` | `/api/auth/forgot-password` | Send password reset email |
| `POST` | `/api/auth/reset-password` | Reset password with token |

### 👤 Profile
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/profile` | Get current user profile |
| `PUT` | `/api/profile/update` | Update user profile |

### 🏋️ Workout & Diet
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/workout/my` | Get personalized workout plan |
| `GET` | `/api/diet/my` | Get personalized meal plan |

### 🎯 Goals & Progress
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/goals/set` | Set a new fitness goal |
| `GET` | `/api/goals/my` | Get current active goal |
| `DELETE` | `/api/goals/reset` | Reset all goals & progress |
| `POST` | `/api/progress/add` | Log today's weight |
| `GET` | `/api/progress/latest` | Get latest progress entry |
| `GET` | `/api/progress/my` | Get full progress history |

### 🛡️ Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/admin/users` | Get all registered users |
| `GET` | `/api/admin/users/{id}` | Get specific user full profile |

---

## 🚀 Deployment Guide

### 1. 🗄️ Database — Railway (MySQL)

1. Go to [railway.app](https://railway.app/) and create a new project
2. Add a **MySQL** service
3. Copy the **MySQL connection string** from the Variables tab
4. Format: `Server=host;Port=port;Database=NutriFit;User=user;Password=password;`

---

### 2. ⚙️ Backend — Render

1. Go to [render.com](https://render.com/) and create a **New Web Service**
2. Connect your GitHub repository
3. Set the **Root Directory** to: `backend/NutriFit.Api`
4. Set **Runtime** to `Docker`
5. Add the following **Environment Variables**:

```env
DEFAULT_CONNECTION=Server=host;Port=3306;Database=NutriFit;User=root;Password=yourpassword;
JWT_SECRET=your_super_secret_jwt_key_here
FRONTEND_URL=https://your-vercel-app.vercel.app
```

6. Deploy! Your backend will be live at `https://your-app.onrender.com`

---

### 3. 🌐 Frontend — Vercel

1. Go to [vercel.com](https://vercel.com/) and import your GitHub repository
2. Set **Root Directory** to: `frontend/nutrifit-ui`
3. Add the following **Environment Variable**:

```env
REACT_APP_API_URL=https://your-render-backend.onrender.com/api
```

4. Deploy! Your frontend will be live at `https://your-app.vercel.app`

---

### 4. 🔧 Update Axios Base URL

In `frontend/nutrifit-ui/src/api/axios.js`:

```js
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "https://your-render-backend.onrender.com/api"
});
```

---

## 💻 Local Development

### Prerequisites
- Node.js 18+
- .NET SDK 8.0+
- MySQL Server (local or Railway)

### Backend
```bash
cd backend/NutriFit.Api/NutriFit.Api
dotnet restore
dotnet run
# Runs on https://localhost:7xxx
```

### Frontend
```bash
cd frontend/nutrifit-ui
npm install
npm start
# Runs on http://localhost:3000
```

### Environment Variables (local)

Create `appsettings.Development.json` in the backend:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Port=3306;Database=NutriFit;User=root;Password=yourpassword;"
  },
  "JwtSettings": {
    "Secret": "your_local_secret_key"
  }
}
```

---

## 🎨 Design Highlights

- 🎬 **Netflix-Inspired UI** — Dark glassmorphism with cinematic red accents
- 📊 **Dynamic Color Badges** — BMI and health categories change color by tier
- ✅ **Real-time Goal Status** — Automatically detects when weight goal is achieved
- 🌀 **Animated Charts** — Smooth Chart.js line graphs for weight/BMI trends
- 📱 **Fully Responsive** — Mobile-first with sliding offcanvas navigation
- ⚡ **Micro-animations** — Fade-in, pulse, and glow effects throughout

---

## 📝 License

This project is for educational purposes. Feel free to fork and build upon it.

---

<div align="center">

Made with ❤️ using **React** + **.NET** + **MySQL**

⭐ **Star this repo** if you found it helpful!

</div>