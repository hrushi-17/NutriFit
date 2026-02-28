<div align="center">



# 🔥 NutriFit
### *A Premium Full-Stack Fitness & Nutrition Tracker*

<br/>

[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![.NET](https://img.shields.io/badge/.NET-8.0-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)](https://dotnet.microsoft.com/)
[![MySQL](https://img.shields.io/badge/MySQL-Railway-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://railway.app/)
[![Vercel](https://img.shields.io/badge/Frontend-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
[![Render](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render&logoColor=black)](https://render.com/)
[![Railway](https://img.shields.io/badge/Database-Railway-0B0D0E?style=for-the-badge&logo=railway&logoColor=white)](https://railway.app/)

<br/>

> 🔥 **NutriFit** is a full-stack fitness and nutrition web application with a premium **Netflix-inspired dark UI**.
> Track your workouts, meals, BMI, goals, and body progress — all from a beautiful cinematic dashboard.

<br/>

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Visit_Now-e50914?style=for-the-badge)](https://your-vercel-url.vercel.app)
[![Report Bug](https://img.shields.io/badge/🐛_Bug_Report-Open_Issue-orange?style=for-the-badge)](https://github.com/hrushi-17/NutriFit/issues)
[![Request Feature](https://img.shields.io/badge/✨_Feature_Request-Open_Issue-blueviolet?style=for-the-badge)](https://github.com/hrushi-17/NutriFit/issues)

</div>

<br/>

---

## 📸 Preview

> Netflix-inspired dark cinematic UI with dynamic glassmorphism, red accent glows, and real-time analytics.

| 📊 User Dashboard | 🛡️ Admin Panel | 🎯 Goal Tracker |
|:-----------------:|:--------------:|:---------------:|
| BMI Report, Workout & Diet Cards | User Profile, Progress Graph | Dynamic Status Badges |

<br/>

---

## ✨ Features

<details open>
<summary><b>👤 User Side</b></summary>
<br/>

| Feature | Description |
|---------|-------------|
| 🔐 **JWT Authentication** | Secure login, registration, forgot/reset password |
| 📊 **Personal Dashboard** | BMI, Workouts, Diet, Goals, Progress all in one view |
| 🏋️ **Workout Planner** | Personalized routines with intensity color-coding |
| 🥗 **Diet Planner** | Personalized meal plans by type (Breakfast, Lunch, Dinner, Snack) |
| 🎯 **Goal Tracker** | Set, track and dynamically complete Weight Loss / Muscle Gain goals |
| 📈 **Progress Graph** | Real-time weight + BMI chart with Chart.js |
| 🩺 **BMI Report** | Animated BMI circle with dynamic health tier coloring |
| 💪 **Health Conditions** | Track and manage personal health conditions |

</details>

<details>
<summary><b>🛡️ Admin Side</b></summary>
<br/>

| Feature | Description |
|---------|-------------|
| 👥 **User Management** | Browse all registered users |
| 📋 **Full User Profile** | Age, height, weight, BMI health stats |
| 📉 **Progress Analytics** | Per-user Weight & BMI chart |
| 🎯 **Goal & Body Status** | Real-time active target and body status cards |
| 🩺 **Health Conditions** | View user-reported health issues |

</details>

<br/>

---

## 🛠️ Tech Stack

<div align="center">

| 🎨 Layer | ⚙️ Technology |
|:--------:|:-------------:|
| **Frontend** | React 18 · React Router DOM · Bootstrap 5 · Chart.js · jQuery |
| **Backend** | ASP.NET Core 8 Web API (C#) |
| **Database** | MySQL (hosted on Railway) |
| **Auth** | JWT Bearer Tokens |
| **Recommendations** | Custom rule-based engine for diet & workout plans |
| **Styling** | Vanilla CSS · Glassmorphism · Animations · Netflix Dark Theme |
| **Deployment** | Vercel · Render · Railway |

</div>

<br/>

---

## 📁 Project Structure

```
NutriFit/
├── 📂 backend/
│   └── NutriFit.Api/
│       └── NutriFit.Api/
│           ├── 📂 Controllers/
│           │   ├── AuthController.cs
│           │   ├── ProfileController.cs
│           │   ├── WorkoutController.cs
│           │   ├── DietController.cs
│           │   ├── GoalsController.cs
│           │   ├── ProgressController.cs
│           │   ├── AdminController.cs
│           │   └── UserHealthController.cs
│           ├── 📂 Models/             # MySQL data models
│           ├── 📂 DTOs/               # Data Transfer Objects
│           ├── 📂 Data/               # DB context / connection
│           ├── Program.cs             # App entry point + DI
│           ├── appsettings.json       # Configuration
│           └── Dockerfile             # Docker config for Render
│
└── 📂 frontend/
    └── nutrifit-ui/
        ├── 📂 public/
        │   └── images/                # Logo and static assets
        └── 📂 src/
            ├── 📂 api/
            │   └── axios.js           # Axios base config + interceptors
            ├── 📂 components/
            │   └── Navbar.js          # Responsive Netflix navbar
            ├── 📂 pages/
            │   ├── Home.js · Login.js · Register.js
            │   ├── ForgotPassword.js · ResetPassword.js
            │   ├── Dashboard.js       # User dashboard shell
            │   ├── BmiPage.js · WorkoutPage.js · DietPage.js
            │   ├── GoalPage.js · ProgressPage.js · Profile.js
            │   ├── UserHealth.js · AdminDashboard.js · AdminHealth.js
            └── 📂 styles/             # Component and page CSS files
```

<br/>

---

## 🔌 API Endpoints

<details open>
<summary><b>🔐 Auth</b></summary>

| Method | Endpoint | Description |
|:------:|----------|-------------|
| `POST` | `/api/auth/register` | Register new user or admin |
| `POST` | `/api/auth/login` | Login and get JWT token |
| `POST` | `/api/auth/forgot-password` | Send password reset email |
| `POST` | `/api/auth/reset-password` | Reset password with token |

</details>

<details>
<summary><b>👤 Profile</b></summary>

| Method | Endpoint | Description |
|:------:|----------|-------------|
| `GET` | `/api/profile` | Get current user profile |
| `PUT` | `/api/profile/update` | Update user profile |

</details>

<details>
<summary><b>🏋️ Workout & Diet</b></summary>

| Method | Endpoint | Description |
|:------:|----------|-------------|
| `GET` | `/api/workout/my` | Get personalized workout plan |
| `GET` | `/api/diet/my` | Get personalized meal plan |

</details>

<details>
<summary><b>🎯 Goals & Progress</b></summary>

| Method | Endpoint | Description |
|:------:|----------|-------------|
| `POST` | `/api/goals/set` | Set a new fitness goal |
| `GET` | `/api/goals/my` | Get current active goal |
| `DELETE` | `/api/goals/reset` | Reset all goals & progress |
| `POST` | `/api/progress/add` | Log today's weight |
| `GET` | `/api/progress/latest` | Get latest progress entry |
| `GET` | `/api/progress/my` | Get full progress history |

</details>

<details>
<summary><b>🛡️ Admin</b></summary>

| Method | Endpoint | Description |
|:------:|----------|-------------|
| `GET` | `/api/admin/users` | Get all registered users |
| `GET` | `/api/admin/users/{id}` | Get specific user full profile |

</details>

<br/>

---

## 🚀 Deployment Guide

### `Step 1` — 🗄️ Database via Railway (MySQL)

```
1. Go to railway.app → New Project
2. Add a MySQL service from the template library
3. Copy the MySQL connection string from the Variables tab
   Format: Server=host;Port=3306;Database=nutrifit;User=root;Password=yourpassword;
```

---

### `Step 2` — ⚙️ Backend via Render

```
1. Go to render.com → New Web Service
2. Connect your GitHub repository
3. Root Directory: backend/NutriFit.Api
4. Runtime: Docker
5. Add Environment Variables:
```

```env
MYSQL_CONNECTION_STRING=Server=host;Port=3306;Database=nutrifit;User=root;Password=yourpassword;
JWT_SECRET=your_super_secret_jwt_key_here
FRONTEND_URL=https://your-vercel-app.vercel.app
```

---

### `Step 3` — 🌐 Frontend via Vercel

```
1. Go to vercel.com → Import GitHub Repo
2. Root Directory: frontend/nutrifit-ui
3. Add Environment Variable:
```

```env
REACT_APP_API_URL=https://your-render-backend.onrender.com/api
```

---

### `Step 4` — 🔧 Update Axios Base URL

In `frontend/nutrifit-ui/src/api/axios.js`:

```js
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "https://your-render-backend.onrender.com/api"
});
```

<br/>

---

## 💻 Local Development

### Prerequisites

```
✅ Node.js 18+
✅ .NET SDK 8.0+
✅ MySQL 8.0+ (local or Railway)
```

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

### `appsettings.Development.json`

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Port=3306;Database=nutrifit;User=root;Password=yourpassword;"
  },
  "JwtSettings": {
    "Secret": "your_local_secret_key"
  }
}
```

<br/>

---

## 🎨 Design Highlights

<div align="center">

| 🎬 | Feature | Details |
|:--:|---------|---------|
| 🎨 | **Netflix-Inspired UI** | Dark glassmorphism with cinematic red accents |
| 📊 | **Dynamic Color Badges** | BMI and health categories change color by tier |
| ✅ | **Real-time Goal Status** | Automatically detects when weight goal is achieved |
| 🌀 | **Animated Charts** | Smooth Chart.js line graphs for weight/BMI trends |
| 📱 | **Fully Responsive** | Mobile-first with sliding offcanvas navigation |
| ⚡ | **Micro-animations** | Fade-in, pulse, and glow effects throughout |

</div>

<br/>

---

## 📝 License

This project is open-source and free to use for educational and personal purposes.
Feel free to fork and build on top of it!

<br/>

---

<div align="center">



**Made with ❤️ using React + .NET + MySQL**

⭐ **If you found this helpful, please star this repo!**

</div>