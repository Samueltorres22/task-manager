# Task Manager 📋

A full stack task management app with JWT authentication, built with NestJS and React.

## 🚀 Tech Stack

**Backend**
- NestJS + TypeScript
- PostgreSQL + Prisma ORM
- JWT Authentication
- Docker Compose

**Frontend**
- React + TypeScript
- Vite
- Axios + React Router

## ✨ Features

- User registration and login with JWT
- Create, complete and delete tasks
- Protected routes — each user sees only their own tasks
- Dockerized PostgreSQL database

## 🛠️ Getting Started

### Prerequisites
- Node.js 20+
- Docker Desktop

### Installation

```bash
# Clone the repo
git clone https://github.com/Samueltorres22/task-manager.git
cd task-manager

# Start the database
docker compose up -d

# Install and run backend
cd backend
npm install
npx prisma migrate dev
npm run start:dev

# Install and run frontend (new terminal)
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📁 Project Structure