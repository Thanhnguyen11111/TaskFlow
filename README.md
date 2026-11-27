# TaskFlow — Full-Stack Task Management Web Application

[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2014-black?style=flat&logo=next.js)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/Backend-NestJS%2010-red?style=flat&logo=nestjs)](https://nestjs.io/)
[![Prisma](https://img.shields.io/badge/ORM-Prisma%205-2D3748?style=flat&logo=prisma)](https://www.prisma.io/)
[![MySQL](https://img.shields.io/badge/Database-MySQL%208.0-4479A1?style=flat&logo=mysql)](https://www.mysql.com/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript%20Strict-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)

**TaskFlow** is a modern, production-ready, full-stack task management web application designed as an industry portfolio project demonstrating software engineering excellence across **Backend Developer Intern**, **Frontend Developer Intern**, and **Software Quality Assurance (QA) Intern** roles.

---

## 🌟 Key Features

### 🔐 Authentication & Authorization
- **JWT Authentication**: Token-based authentication using Passport.js and custom NestJS execution guards.
- **Cryptographic Security**: Salted password hashing with `bcrypt` (10 rounds).
- **Strict Multi-Tenancy**: Guaranteed user isolation ensuring zero cross-tenant data leakage (`WHERE id = :id AND userId = :currentUserId`).
- **Input Validation**: Robust DTO validation with `class-validator` and client-side schemas using `Zod` and `React Hook Form`.

### 📋 Task Management
- **Full CRUD Capabilities**: Create, view details, update, and delete tasks.
- **Quick Status Transitions**: Interactive one-click status transitions (`TODO`, `IN_PROGRESS`, `DONE`).
- **Priority Categorization**: Color-coded priority badges (`LOW`, `MEDIUM`, `HIGH`).
- **Deadline Tracking**: Real-time overdue detection comparing UTC deadlines against current timestamps.

### 🔍 Advanced Search, Filtering, Sorting & Pagination
- **Server-Side Search**: Full-text keyword matching on task titles.
- **Multi-Param Filtering**: Instant status and priority filtering handled directly in MySQL queries.
- **Dynamic Sorting**: Sort by creation date, deadline date, title, or priority.
- **Offset/Limit Pagination**: Metadata-rich pagination controls (`page`, `limit`, `totalPages`, `hasNextPage`, `hasPrevPage`).

### 📊 Real-Time Analytics Dashboard
- **Total Task Metrics**: Instant computation of Total, Completed, In-Progress, and Pending tasks.
- **Overdue Warnings**: Immediate alert highlighting past-due tasks.
- **Completion Rate Indicator**: Dynamically computed percentage with a visual progress bar.

---

## 🏗️ System Architecture

```
┌────────────────────────────────────────────────────────┐
│                   NEXT.JS FRONTEND                     │
│  (App Router, Tailwind CSS, React Hook Form, Zod)      │
└───────────────────────────┬────────────────────────────┘
                            │ RESTful JSON API
                            │ (Bearer JWT Auth)
┌───────────────────────────▼────────────────────────────┐
│                    NESTJS BACKEND                      │
│ ┌────────────────────────────────────────────────────┐ │
│ │ Global Guard: JwtAuthGuard (@Public bypass)        │ │
│ ├────────────────────────────────────────────────────┤ │
│ │ Global Filter: HttpExceptionFilter                 │ │
│ ├────────────────────────────────────────────────────┤ │
│ │ Global Pipe: ValidationPipe (whitelist: true)      │ │
│ └────────────────────────────────────────────────────┘ │
│        │                 │                 │           │
│  [AuthModule]     [TasksModule]    [DashboardModule]   │
└───────────────────────────┬────────────────────────────┘
                            │ Prisma ORM (Type-Safe Client)
┌───────────────────────────▼────────────────────────────┐
│                    MYSQL DATABASE                      │
│   (Users, Tasks, Foreign Keys, Composite Indexes)      │
└────────────────────────────────────────────────────────┘
```

---

## 🗄️ Database Design (Entity-Relationship)

```
┌─────────────────────────┐             ┌─────────────────────────┐
│          users          │             │          tasks          │
├─────────────────────────┤             ├─────────────────────────┤
│ id: VARCHAR(191) [PK]   │ 1         N │ id: VARCHAR(191) [PK]   │
│ email: VARCHAR(191) [UQ]│────────────<│ userId: VARCHAR(191)[FK]│
│ password: VARCHAR(191)  │             │ title: VARCHAR(255)     │
│ name: VARCHAR(191)      │             │ description: TEXT       │
│ createdAt: DATETIME(3)  │             │ status: ENUM            │
│ updatedAt: DATETIME(3)  │             │ priority: ENUM          │
└─────────────────────────┘             │ dueDate: DATETIME(3)    │
                                        │ createdAt: DATETIME(3)  │
                                        │ updatedAt: DATETIME(3)  │
                                        └─────────────────────────┘
                                        Indexes:
                                        - (userId)
                                        - (userId, status)
                                        - (userId, dueDate)
```

---

## 📡 RESTful API Reference

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Auth Required | Description |
|---|---|:---:|---|
| `POST` | `/auth/register` | No | Register a new user |
| `POST` | `/auth/login` | No | Login and receive Bearer JWT |
| `GET` | `/auth/profile` | **Yes** | Get current authenticated user profile |
| `GET` | `/tasks` | **Yes** | List paginated, filtered, and sorted tasks |
| `POST` | `/tasks` | **Yes** | Create a new task |
| `GET` | `/tasks/:id` | **Yes** | Get task details by ID |
| `PATCH` | `/tasks/:id` | **Yes** | Update task fields |
| `PATCH` | `/tasks/:id/status` | **Yes** | Quick status update |
| `DELETE` | `/tasks/:id` | **Yes** | Delete task |
| `GET` | `/dashboard/stats` | **Yes** | Get aggregated metrics & completion rate |

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.x, v20.x, or v24.x)
- [Docker Desktop](https://www.docker.com/) (or local MySQL 8.0 server)
- [Git](https://git-scm.com/)

### 1. Clone & Start MySQL Container
```bash
git clone https://github.com/your-username/TaskFlow.git
cd TaskFlow

# Start MySQL database in Docker
docker compose up -d
```

### 2. Configure & Run Backend (NestJS)
```bash
cd backend

# Copy environment variables
cp .env.example .env

# Install dependencies
npm install

# Push Prisma schema to MySQL
npx prisma db push

# Run the development server
npm run start:dev
```
Backend will start on: `http://localhost:5000/api`

### 3. Configure & Run Frontend (Next.js)
```bash
cd ../frontend

# Install dependencies
npm install

# Run the development server
npm run dev
```
Frontend will start on: `http://localhost:3000`

---

## 🧪 Testing & Quality Assurance

TaskFlow includes complete QA documentation and Postman artifacts:

1. **Postman Collection**:
   - Location: `postman/TaskFlow_API.postman_collection.json`
   - Environment: `postman/TaskFlow_Local.postman_environment.json`
   - Automatically saves and passes the `jwt_token` on login!
2. **QA Manual Test Plan**:
   - Detailed in [`docs/TESTING.md`](docs/TESTING.md).
   - Covers 36 test scenarios: Positive, Negative, Boundary, Multi-tenant Isolation, and Bug Report templates.

---

## 👨‍💻 Portfolio Relevance & Interview Guide

- **For Backend Developer Intern**:
  - Explains Dependency Injection, NestJS modular architecture, and custom Passport strategies.
  - Demonstrates high-performance database querying with Prisma and composite MySQL indexes.
  - Highlights defensive programming against IDOR / horizontal authorization vulnerabilities.
- **For Frontend Developer Intern**:
  - Explains Next.js App Router, Server vs. Client component boundaries, and reusable UI components.
  - Demonstrates form state management and schema validation with React Hook Form and Zod.
  - Highlights clean state transitions with loading skeletons, toast notifications, and empty states.
- **For Software Tester / QA Intern**:
  - Highlights systematic test case design covering positive, negative, boundary, and security test types.
  - Includes ready-to-run Postman collection and standard industry defect reporting templates.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
