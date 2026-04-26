# 🌿 R-Eco Pilot Setup Guide

This project consists of a **React (Vite)** frontend and an **Express (Node.js)** backend using **SQLite**.

## 📋 Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** or **yarn**

---

## 🚀 Getting Started

### 1. Backend Setup (API Server)
The backend manages the database and AI evaluation logic.

1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```
   *The server will run on [http://localhost:3001](http://localhost:3001). It will automatically create `eco_pilot.db` and seed it with initial data if it doesn't exist.*

### 2. Frontend Setup (React App)
The frontend provides the user interface for students, teachers, and admins.

1. Navigate to the root directory (r-eco-pilot):
   ```bash
   cd r-eco-pilot
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   *The app will usually run on [http://localhost:5173](http://localhost:5173).*

---

## 🔑 Default Accounts
You can use these accounts to log in during development:

| Role | Username | Password |
| :--- | :--- | :--- |
| **Admin** | `admin` | `admin123` |
| **Teacher** | `teacher` | `teacher123` |
| **Sage** | `sage` | `sage123` |
| **Student** | `student` | `student123` |

---

## 🛠️ Tech Stack
- **Frontend**: React, Vite, Framer Motion, Lucide React.
- **Backend**: Node.js, Express, better-sqlite3, JWT, Bcrypt.
- **Database**: SQLite (Local file: `server/eco_pilot.db`).
