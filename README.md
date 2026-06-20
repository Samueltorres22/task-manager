# ✅ Task Manager

A full-stack task management application with JWT authentication, built with **NestJS**, **React**, **PostgreSQL**, and **Docker** — fully tested with **20 unit tests** covering authentication and task operations.

## 🎯 Features

- 🔐 **JWT Authentication** — secure register/login with bcrypt password hashing
- ✅ **Task CRUD** — create, read, update, and delete tasks
- 🔒 **Protected Routes** — AuthGuard ensures only authenticated users access their own tasks
- 🐳 **Dockerized** — PostgreSQL runs in a container via Docker Compose
- 🧪 **Fully Tested** — 20 unit tests (100% passing) with mocked dependencies

## 🏗️ Architecture

```
Frontend (React + Vite)  →  REST API  →  Backend (NestJS)  →  Prisma ORM  →  PostgreSQL
                                              ↓
                                         JWT + AuthGuard
```

## 🛠️ Tech Stack

**Backend**
- NestJS · TypeScript · Prisma ORM · PostgreSQL
- JWT (`@nestjs/jwt`) · bcrypt for password hashing
- Jest for unit testing

**Frontend**
- React · Vite · TypeScript

**Infrastructure**
- Docker · Docker Compose

## 🧪 Testing

This project includes a complete unit testing suite using **Jest**, covering both services and controllers:

| Module | Tests | Coverage |
|---|---|---|
| `AuthService` | 7 tests | register (success + duplicate email), login (success + invalid user + wrong password) |
| `AuthController` | 2 tests | register and login endpoint delegation |
| `TasksService` | 8 tests | findAll, create, update, remove (including edge cases) |
| `TasksController` | 4 tests | all CRUD endpoints with AuthGuard properly mocked |

**Result:** 5 test suites, 20 tests, 100% passing.

```powershell
cd backend
npm run test
```

Key testing techniques used:
- Mocked `PrismaService` to avoid hitting a real database
- Mocked `bcrypt` module to test password hashing/comparison logic in isolation
- Used `overrideGuard()` to bypass `AuthGuard` in controller tests while still testing the business logic

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Docker Desktop
- PostgreSQL (or use the included Docker Compose setup)

### Installation

```bash
# Clone the repository
git clone https://github.com/Samueltorres22/task-manager.git
cd task-manager

# Start PostgreSQL via Docker
docker-compose up -d

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

### Running Tests

```bash
cd backend
npm run test
```

## 📁 Project Structure

```
task-manager/
├── backend/
│   ├── src/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.guard.ts
│   │   │   ├── auth.controller.spec.ts
│   │   │   └── auth.service.spec.ts
│   │   ├── tasks/
│   │   │   ├── tasks.controller.ts
│   │   │   ├── tasks.service.ts
│   │   │   ├── tasks.controller.spec.ts
│   │   │   └── tasks.service.spec.ts
│   │   └── prisma/
│   └── prisma/
│       └── schema.prisma
├── frontend/
│   └── src/
└── docker-compose.yml
```

## 🔌 API Endpoints

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/auth/register` | Register a new user | No |
| POST | `/auth/login` | Login and receive JWT | No |
| GET | `/tasks` | Get all tasks for authenticated user | Yes |
| POST | `/tasks` | Create a new task | Yes |
| PATCH | `/tasks/:id` | Update a task | Yes |
| DELETE | `/tasks/:id` | Delete a task | Yes |

## 🔗 Related Projects

- [AI Support Classifier](https://github.com/Samueltorres22/ai-support-classifier) — automated support ticket routing with Claude API
- [Lead Enrichment Bot](https://github.com/Samueltorres22/lead-enrichment-bot) — AI-powered lead enrichment with n8n and Claude API

---

Built by [Samuel Torres](https://linkedin.com/in/samuel-torres-8399852a0/) — Full-Stack Developer & AI Automation Engineer