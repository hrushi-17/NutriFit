<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=E50914&height=200&section=header&text=NutriFit&fontSize=80&fontColor=ffffff&animation=fadeIn&fontAlignY=38&desc=Premium%20Fitness%20%26%20Nutrition%20Tracker&descAlignY=55&descAlign=50" width="100%"/>

<br/>

[![React](https://img.shields.io/badge/React-18-%2361DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![.NET](https://img.shields.io/badge/.NET-8.0-%23512BD4?style=for-the-badge&logo=dotnet&logoColor=white)](https://dotnet.microsoft.com/)
[![MySQL](https://img.shields.io/badge/MySQL-Railway-%234479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://railway.app/)
[![Vercel](https://img.shields.io/badge/Frontend-Vercel-%23000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
[![Render](https://img.shields.io/badge/Backend-Render-%2346E3B7?style=for-the-badge&logo=render&logoColor=white)](https://render.com/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5-%237952B3?style=for-the-badge&logo=bootstrap&logoColor=white)](https://getbootstrap.com/)

<br/>

> 🔥 A cinematic, **Netflix-inspired** full-stack fitness and nutrition tracker with real-time BMI analytics, goal management, personalized workout & diet plans, and an elegant dark UI.

<br/>

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Visit_NutriFit-E50914?style=for-the-badge)](https://your-vercel-url.vercel.app)
&nbsp;
[![Report Bug](https://img.shields.io/badge/🐛_Report_Bug-Issues-333333?style=for-the-badge)](https://github.com/hrushi-17/NutriFit/issues)
&nbsp;
[![Request Feature](https://img.shields.io/badge/✨_Request_Feature-Ideas-222222?style=for-the-badge)](https://github.com/hrushi-17/NutriFit/issues)

</div>

<br/>

---

## 📌 Table of Contents

- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [🔌 API Endpoints](#-api-endpoints)
- [🚀 Deployment Guide](#-deployment-guide)
- [💻 Local Development](#-local-development)
- [🎨 Design Highlights](#-design-highlights)

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 👤 User Side
| Feature | Description |
|---------|-------------|
| 🔐 **Auth System** | JWT login, register, forgot/reset password |
| 📊 **Dashboard** | BMI, Workouts, Diet, Goals & Progress |
| 🏋️ **Workout Planner** | Personalized routines with intensity tiers |
| 🥗 **Diet Planner** | Meal plans by Breakfast, Lunch, Dinner, Snack |
| 🎯 **Goal Tracker** | Set & auto-complete Weight Loss / Muscle Gain goals |
| 📈 **Progress Graph** | Real-time weight + BMI chart (Chart.js) |
| 🩺 **BMI Report** | Animated BMI circle with dynamic health tiers |
| 💪 **Health Tracker** | Log and manage personal health conditions |
| 🖼️ **Profile** | View and update personal fitness profile |

</td>
<td width="50%">

### 🛡️ Admin Side
| Feature | Description |
|---------|-------------|
| 👥 **User Management** | Browse all registered users |
| 📋 **Full User Profile** | Age, height, weight, BMI card |
| 📉 **Progress Analytics** | Per-user Weight & BMI progress chart |
| 🎯 **Goal & Body Status** | Active target + body status cards |
| 🩺 **Health Overview** | View user-reported health conditions |

</td>
</tr>
</table>

---

## 🛠️ Tech Stack

<div align="center">

| Layer | Technology | Hosting |
|:---:|:---:|:---:|
| **Frontend** | React 18, React Router DOM, Bootstrap 5, Chart.js | Vercel |
| **Backend** | ASP.NET Core 8 Web API (C#) | Render |
| **Database** | MySQL | Railway |
| **Auth** | JWT Bearer Tokens | — |
| **Styling** | Vanilla CSS — Glassmorphism, Gradients, Animations | — |

</div>

---

## 📁 Project Structure

```
NutriFit/
│
├── 📂 backend/
│   └── NutriFit.Api/
│       └── NutriFit.Api/
│           ├── 🎮 Controllers/
│           │   ├── AuthController.cs          ← Register, Login, Forgot/Reset Password
│           │   ├── ProfileController.cs       ← User profile CRUD
│           │   ├── WorkoutController.cs       ← Workout plans
│           │   ├── DietController.cs          ← Meal plans
│           │   ├── GoalsController.cs         ← Goal set/reset/track
│           │   ├── ProgressController.cs      ← Weight & BMI progress log
│           │   ├── AdminController.cs         ← Admin user management
│           │   └── UserHealthController.cs    ← Health conditions
│           ├── 📦 Models/                     ← Entity / DB models
│           ├── 📤 DTOs/                       ← Data Transfer Objects
│           ├── 🗄️  Data/                      ← DB Context & connection
│           ├── ⚙️  Program.cs                 ← App entry point + DI setup
│           ├── 🔧 appsettings.json            ← App configuration
│           └── 🐳 Dockerfile                  ← Docker config for Render
│
└── 📂 frontend/
    └── nutrifit-ui/
        ├── 📂 public/images/                  ← Logo and static assets
        └── 📂 src/
            ├── 🔗 api/axios.js                ← Axios base config + JWT interceptor
            ├── 🧩 components/Navbar.js        ← Responsive Netflix-style navbar
            ├── 📄 pages/
            │   ├── Home.js / Login.js / Register.js
            │   ├── ForgotPassword.js / ResetPassword.js
            │   ├── Dashboard.js               ← User dashboard shell + sidebar
            │   ├── BmiPage.js                 ← Animated BMI report
            │   ├── WorkoutPage.js             ← Workout planner
            │   ├── DietPage.js                ← Diet/meal plan
            │   ├── GoalPage.js                ← Goal tracker
            │   ├── ProgressPage.js            ← Progress chart + snapshot
            │   ├── Profile.js                 ← User profile
            │   ├── UserHealth.js / AdminHealth.js
            │   └── AdminDashboard.js          ← Full admin panel
            └── 🎨 styles/                     ← Netflix dark CSS per component
```

---

## 🔌 API Endpoints

<details>
<summary>🔐 <strong>Auth</strong> — Click to expand</summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register new user or admin |
| `POST` | `/api/auth/login` | Login & receive JWT token |
| `POST` | `/api/auth/forgot-password` | Request password reset email |
| `POST` | `/api/auth/reset-password` | Reset with token |

</details>

<details>
<summary>👤 <strong>Profile</strong> — Click to expand</summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/profile` | Get current user profile |
| `PUT` | `/api/profile/update` | Update profile data |

</details>

<details>
<summary>🏋️ <strong>Workout & Diet</strong> — Click to expand</summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/workout/my` | Get personalized workout plan |
| `GET` | `/api/diet/my` | Get personalized meal plan |

</details>

<details>
<summary>🎯 <strong>Goals & Progress</strong> — Click to expand</summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/goals/set` | Set a new fitness goal |
| `GET` | `/api/goals/my` | Get current active goal |
| `DELETE` | `/api/goals/reset` | Reset all goals & progress |
| `POST` | `/api/progress/add` | Log today's weight |
| `GET` | `/api/progress/latest` | Get latest progress entry |
| `GET` | `/api/progress/my` | Get full progress history |

</details>

<details>
<summary>🛡️ <strong>Admin</strong> — Click to expand</summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/admin/users` | Get all registered users |
| `GET` | `/api/admin/users/{id}` | Get specific user full profile |

</details>

---

## 🚀 Deployment Guide

### Step 1 — 🗄️ Database: Railway (MySQL)

1. Go to **[railway.app](https://railway.app/)** → New Project → Add **MySQL**
2. Copy the connection string from the Variables tab
3. Format: `Server=host;Port=3306;Database=NutriFit;User=root;Password=pass;`

---

### Step 2 — ⚙️ Backend: Render

1. Go to **[render.com](https://render.com/)** → New Web Service → Connect GitHub
2. Set **Root Directory** → `backend/NutriFit.Api`
3. Set **Runtime** → `Docker`
4. Add Environment Variables:

```env
DEFAULT_CONNECTION=Server=host;Port=3306;Database=NutriFit;User=root;Password=yourpass;
JWT_SECRET=your_super_secret_jwt_key_here
FRONTEND_URL=https://your-vercel-app.vercel.app
```

---

### Step 3 — 🌐 Frontend: Vercel

1. Go to **[vercel.com](https://vercel.com/)** → Import GitHub Repo
2. Set **Root Directory** → `frontend/nutrifit-ui`
3. Add Environment Variable:

```env
REACT_APP_API_URL=https://your-render-backend.onrender.com/api
```

---

## 💻 Local Development

### Prerequisites
```
✅ Node.js 18+
✅ .NET SDK 8.0+
✅ MySQL Server (local)
```

### Backend
```bash
cd backend/NutriFit.Api/NutriFit.Api
dotnet restore
dotnet run
# API runs on https://localhost:7xxx
```

### Frontend
```bash
cd frontend/nutrifit-ui
npm install
npm start
# App runs on http://localhost:3000
```

### Local `appsettings.Development.json`
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

```
🎬  Netflix-inspired dark glassmorphism UI with cinematic red accents
📊  Dynamic color-coded BMI badges — Green / Orange / Red by health tier
✅  Real-time goal completion — auto-detects when weight target is reached
🌀  Smooth animated Chart.js graphs for Weight & BMI trends
📱  Fully responsive — mobile-first with sliding offcanvas navigation
⚡  Micro-animations — fade-in, pulse glows, hover effects throughout
🖌️  Netflix-level card design — dark gradients, inner shadows, red borders
```

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=E50914&height=100&section=footer" width="100%"/>

**Made with ❤️ using React · .NET · MySQL**

⭐ **Star this repo if you found it helpful!** ⭐

</div>