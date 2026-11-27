# TaskFlow – Manual Testing Plan & QA Documentation

This document serves as the comprehensive Quality Assurance (QA) and Software Testing portfolio piece for **TaskFlow**. It includes test cases covering functional, negative, boundary, security, and edge-case scenarios, along with a standard bug reporting template and sample bug reports.

---

## 1. Test Suite Summary

| Module | Test Cases Count | Types Covered |
|---|---|---|
| **Authentication & Authorization** | 8 | Positive, Negative, Boundary, Security Isolation |
| **Task Management (CRUD)** | 9 | Positive, Negative, Validation, Boundary |
| **Search, Filter & Sorting** | 6 | Positive, Boundary, Query combination |
| **Pagination** | 4 | Boundary, Empty page, Indexing |
| **Dashboard Analytics** | 4 | Real-time aggregation, Calculation accuracy |
| **Error Handling & UI States** | 5 | Loading skeleton, Empty state, Toast alerts |

---

## 2. Test Cases Specification

### 2.1 Authentication & Security (AUTH)

| Test ID | Title | Preconditions | Steps to Reproduce | Expected Result | Severity | Type |
|---|---|---|---|---|---|---|
| **AUTH-01** | Successful Registration | Database running, unique email | 1. Enter Name: "Alex Morgan"<br>2. Email: "alex@test.com"<br>3. Password: "password123"<br>4. Submit | HTTP 201 Created. User registered, JWT token returned, redirected to `/dashboard`. | Critical | Positive |
| **AUTH-02** | Registration with Duplicate Email | "alex@test.com" already exists | 1. Fill registration form with "alex@test.com"<br>2. Submit | HTTP 409 Conflict. Message: "An account with this email already exists". Form displays toast error. | High | Negative |
| **AUTH-03** | Registration Password Boundary (< 6 chars) | None | 1. Enter Password: "12345" (5 chars)<br>2. Submit | Frontend validation prevents submission. Backend returns HTTP 400 Bad Request if bypassed. | Medium | Boundary |
| **AUTH-04** | Registration Invalid Email Format | None | 1. Enter Email: "not-an-email"<br>2. Submit | "Please enter a valid email address" displayed. Submission blocked. | Medium | Negative |
| **AUTH-05** | Successful Login | Registered user exists | 1. Enter valid email and password<br>2. Click "Sign In" | HTTP 200 OK. Token stored in localStorage, user redirected to `/dashboard`. | Critical | Positive |
| **AUTH-06** | Login with Incorrect Password | Registered user exists | 1. Enter valid email and wrong password<br>2. Click "Sign In" | HTTP 401 Unauthorized. Message: "Invalid email or password". No token issued. | High | Negative |
| **AUTH-07** | Protected Route Access Without Token | User not logged in (no token) | 1. Direct browser to `/dashboard` or call `GET /api/tasks` without Bearer header | API returns HTTP 401. Frontend redirects immediately to `/login`. | Critical | Security |
| **AUTH-08** | Multi-Tenant Data Isolation Check | User A and User B exist; User A has Task #1 | 1. User B logs in<br>2. User B executes `GET /api/tasks/:id` with User A's task ID | API returns HTTP 404 Not Found. User B cannot read or alter User A's task. | Critical | Security |

---

### 2.2 Task Management CRUD (TASK)

| Test ID | Title | Preconditions | Steps to Reproduce | Expected Result | Severity | Type |
|---|---|---|---|---|---|---|
| **TASK-01** | Create Task with All Fields | User logged in | 1. Open "New Task" modal<br>2. Title: "Build API", Priority: "HIGH", Status: "TODO", DueDate: "2026-12-01"<br>3. Submit | Task created in DB, appears in task list, toast notification appears. | High | Positive |
| **TASK-02** | Create Task with Minimal Fields | User logged in | 1. Enter Title: "Quick task" only<br>2. Submit | Task created with default status `TODO` and priority `MEDIUM`. | High | Positive |
| **TASK-03** | Create Task Empty Title Boundary | User logged in | 1. Leave title empty<br>2. Submit | Form validation blocks submit: "Task title is required". | High | Boundary |
| **TASK-04** | Title Max Length Boundary (255 chars) | User logged in | 1. Enter 256 characters for title<br>2. Submit | Form shows "Title cannot exceed 255 characters". | Medium | Boundary |
| **TASK-05** | Quick Status Transition | Task exists with status `TODO` | 1. Select "IN_PROGRESS" from the status dropdown on task card | Status updates immediately in DB and UI to "In Progress" with amber badge. | Medium | Positive |
| **TASK-06** | Edit Task Details | Existing task | 1. Click Edit icon on task<br>2. Modify title and priority<br>3. Save changes | Task updated in DB and reflected in list immediately. | High | Positive |
| **TASK-07** | Delete Task Confirmation Dialog | Existing task | 1. Click Delete (trash icon)<br>2. Modal asks for confirmation<br>3. Click "Cancel" | Task is NOT deleted. Modal closes. | Medium | Negative |
| **TASK-08** | Delete Task Confirmed | Existing task | 1. Click Delete<br>2. Click "Delete Task" in dialog | Task deleted from MySQL database and removed from list. | High | Positive |
| **TASK-09** | View Task Details Modal | Existing task | 1. Click on task card or Eye icon | Modal displays title, full description, status, priority, due date, created date. | Medium | Positive |

---

### 2.3 Search, Filter, Sort & Pagination (FILTER)

| Test ID | Title | Preconditions | Steps to Reproduce | Expected Result | Severity | Type |
|---|---|---|---|---|---|---|
| **FLTR-01** | Search Tasks by Title Keyword | Tasks exist with "Database", "UI", "Testing" | 1. Type "Database" in search input | Only tasks with "Database" in title are returned. Page resets to 1. | High | Positive |
| **FLTR-02** | Filter by Status | Mixed status tasks exist | 1. Select "Done" from Status filter dropdown | Only completed tasks are displayed. | High | Positive |
| **FLTR-03** | Filter by Priority | Mixed priority tasks exist | 1. Select "High" from Priority dropdown | Only high priority tasks are displayed. | High | Positive |
| **FLTR-04** | Sort by Due Date (Earliest) | Tasks with various due dates | 1. Select "Due Date (Earliest)" in sort dropdown | Tasks ordered chronologically by `dueDate ASC`. | Medium | Positive |
| **FLTR-05** | Combined Filters | Multiple tasks | 1. Status: "TODO" + Priority: "HIGH" + Search: "API" | Intersection query applied at MySQL database level. | High | Positive |
| **FLTR-06** | Reset Filters | Active filters applied | 1. Click "Reset" button | All filters cleared, returns to default paginated list. | Medium | Positive |
| **PAGN-01** | Pagination Navigation | > 8 tasks exist | 1. Click "Next" button<br>2. Click "Previous" button | Page 2 tasks loaded; Next/Previous states disable when on boundary page. | High | Boundary |

---

### 2.4 Dashboard Statistics (DASH)

| Test ID | Title | Preconditions | Steps to Reproduce | Expected Result | Severity | Type |
|---|---|---|---|---|---|---|
| **DASH-01** | Correct Aggregations | 10 tasks (4 Done, 3 In Progress, 3 Todo, 2 Overdue) | 1. Navigate to `/dashboard` | Stat cards display exact counts: Total=10, Completed=4, In Progress=3, Todo=3, Overdue=2. | High | Positive |
| **DASH-02** | Completion Rate Calculation | 4 Done out of 10 Total | 1. Verify Completion Rate card | Shows exactly 40.0% with matching progress bar width. | Medium | Calculation |
| **DASH-03** | Zero Tasks Calculation | New user with 0 tasks | 1. User registers and visits dashboard | Completion Rate shows 0.0% without division-by-zero errors. | Medium | Boundary |
| **DASH-04** | Overdue Alert Banner Display | User has 1 or more overdue tasks | 1. Set task due date in the past with status != DONE | Prominent red alert banner displays overdue task count. | Medium | Positive |

---

## 3. Bug Reporting Template

Use the following standardized format for logging bugs:

```markdown
### [BUG-ID] Title of the Defect

- **Environment**: OS (Windows 11), Browser (Chrome 122), Frontend (Next.js 14), Backend (NestJS 10), Database (MySQL 8.0)
- **Severity**: [Critical / High / Medium / Low]
- **Priority**: [P1 - Urgent / P2 - High / P3 - Normal / P4 - Low]
- **Status**: [New / In Progress / Verified / Closed]

#### Preconditions
- Steps or data required before reproduction.

#### Steps to Reproduce
1. Step 1...
2. Step 2...
3. Step 3...

#### Expected Result
- What the software should do according to specifications.

#### Actual Result
- What the software actually did.

#### Evidence / Logs
- Error messages, HTTP response codes, console errors, or screenshots.
```

---

## 4. Sample Bug Reports (Portfolio QA Reference)

### [BUG-001] Cross-tenant data leak if userId omitted from task update query

- **Environment**: Node v24.11.0, NestJS 10, MySQL 8.0
- **Severity**: Critical
- **Priority**: P1 - Urgent
- **Status**: Closed (Fixed)

#### Preconditions
- User A owns Task `id: "8ef96efc-..."`.
- User B has a valid JWT token.

#### Steps to Reproduce
1. Send `PATCH /api/tasks/8ef96efc-...` with User B's Authorization Bearer header.
2. Provide payload `{ "title": "Tampered Title" }`.

#### Expected Result
- Server must return `HTTP 404 Not Found` or `HTTP 403 Forbidden`. User A's task title remains unchanged.

#### Actual Result
- Server returned `HTTP 200 OK` and allowed User B to overwrite User A's task because the repository query was `prisma.task.update({ where: { id } })` without checking `userId`.

#### Resolution
- Enforced `findOne(userId, id)` before any update or delete operation in `TasksService`. Verified with automated test suite.

---

### [BUG-002] Division by zero in completion rate when user has no tasks

- **Environment**: Next.js 14.2, NestJS 10
- **Severity**: Low
- **Priority**: P3 - Normal
- **Status**: Closed (Fixed)

#### Preconditions
- Brand new registered user with 0 tasks.

#### Steps to Reproduce
1. Register new user.
2. Open Dashboard overview `/dashboard`.

#### Expected Result
- Completion rate displays `0.0%`.

#### Actual Result
- Dashboard rendered `NaN%` because formula was `(completed / total) * 100` where `total = 0`.

#### Resolution
- Updated `DashboardService`: `totalTasks > 0 ? Number(((completedTasks / totalTasks) * 100).toFixed(1)) : 0`.
