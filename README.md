# College Management System

A modern, secure, and responsive **College Management System** developed as a Final Year Project (FYP).

The system is designed to digitize and simplify major college operations including student management, teacher management, attendance, results, subjects, timetables, notices, leaves, notifications, parent access, roles, permissions, and system settings.

---

## 📌 Project Overview

The **College Management System** provides a centralized platform for managing academic and administrative activities of a college.

The system follows a **role-based access control (RBAC)** approach, allowing different users to access only the features and information relevant to their roles.

### Main Roles

* Principal
* HOD
* Teacher
* Class Representative (CR)
* Student
* Parent / Guardian

The Principal has full system access, while other roles have permissions according to their responsibilities.

---

## 🎯 Project Objectives

The main objectives of this project are:

* Digitize college management operations.
* Manage students, teachers, parents, and academic information.
* Manage subjects and timetables.
* Record and manage student attendance.
* Manage student results and marks.
* Provide role-based access control.
* Manage student and teacher leave requests.
* Provide notices and notifications.
* Allow parents to monitor their verified children's academic information.
* Provide a centralized and secure database.
* Reduce manual paperwork and administrative workload.
* Provide a responsive web interface accessible from desktop, tablet, and mobile devices.

---

# 🏗️ System Architecture

The project follows a modern full-stack web application architecture.

```text
┌─────────────────────────────────────────┐
│                Frontend                 │
│         Responsive Web Application      │
└───────────────────┬─────────────────────┘
                    │
                    │ REST API
                    ▼
┌─────────────────────────────────────────┐
│                Backend                  │
│              Node.js + Express          │
│                                         │
│  Routes → Controllers → Services        │
│              ↓                          │
│          Middleware                     │
│              ↓                          │
│           Validators                    │
└───────────────────┬─────────────────────┘
                    │
                    │ Mongoose
                    ▼
┌─────────────────────────────────────────┐
│                MongoDB                  │
│          College Management DB          │
└─────────────────────────────────────────┘
```

---

# 🛠️ Technology Stack

## Frontend

* React.js
* Responsive UI
* HTML5
* CSS3
* JavaScript
* REST API integration

## Backend

* Node.js
* Express.js
* Mongoose
* RESTful APIs
* JWT Authentication
* bcryptjs
* CORS
* dotenv
* cookie-parser

## Database

* MongoDB
* MongoDB Compass
* Mongoose ODM

## Development Tools

* Visual Studio Code
* Git
* GitHub
* Node.js
* npm
* MongoDB Compass

---

# 👥 User Roles

## 1. Principal

The Principal has complete access to the system.

### Permission

```text
*
```

`*` represents full system access.

---

## 2. HOD

The Head of Department manages department-level academic activities.

### Permissions

```text
department.view
students.view
teachers.view
classes.manage
attendance.view
results.view
reports.view
```

---

## 3. Teacher

Teachers manage their assigned academic responsibilities.

### Permissions

```text
assigned_classes.view
attendance.manage
marks.manage
assignments.manage
notices.manage
```

---

## 4. Class Representative (CR)

The Class Representative has limited class-level responsibilities.

### Permissions

```text
assigned_class.view
attendance.submit
class_issues.create
```

---

## 5. Student

Students can access their own academic and personal information.

### Permissions

```text
own_profile.view
own_attendance.view
own_results.view
own_assignments.view
own_fees.view
own_timetable.view
complaints.create
```

---

## 6. Parent / Guardian

Parents can monitor information related to their verified child.

### Permissions

```text
verified_child.view
child_attendance.view
child_results.view
child_fees.view
child_assignments.view
child_timetable.view
```

---

# 🗄️ Database

The project uses **MongoDB** as its primary database.

### Database

```text
college_management_system
```

### Current Collections

```text
notices
notifications
parents
permissions
results
roles
student_leaves
students
subjects
system_settings
teacher_leaves
teachers
timetable_changes
timetables
users
```

---

# 📚 Database Modules

## Users

Stores authentication and user account information.

The user system will support role-based access through:

```text
User → Role → Permissions
```

---

## Roles

Stores the available system roles.

Current roles:

```text
principal
hod
teacher
cr
student
parent
```

---

## Permissions

Stores permissions assigned to each role.

The permission system supports granular access control such as:

```text
students.view
attendance.manage
marks.manage
results.view
```

The Principal uses:

```text
*
```

for full system access.

---

## Students

Manages student-related information.

Expected functionality includes:

* Student profile
* Academic information
* Attendance
* Results
* Assignments
* Timetable
* Leave requests
* Fees information
* Complaints

---

## Teachers

Manages teacher information and academic responsibilities.

Expected functionality includes:

* Teacher profile
* Assigned classes
* Attendance management
* Marks management
* Assignments
* Notices
* Teacher leave requests

---

## Parents

Stores parent/guardian information and verified child relationships.

Parents can view permitted information related to their children.

---

## Subjects

Manages subjects offered by the college.

---

## Results

Manages student academic results and marks.

---

## Timetables

Manages class schedules and academic timetables.

---

## Timetable Changes

Stores changes or updates made to existing timetables.

---

## Student Leaves

Manages student leave applications and their status.

---

## Teacher Leaves

Manages teacher leave applications and their status.

---

## Notices

Manages college and academic notices.

---

## Notifications

Provides system notifications to users.

---

## System Settings

Stores configurable system-level settings.

---

# 🔐 Authentication & Authorization

The system will implement secure authentication and authorization.

### Authentication

Users will authenticate using:

```text
Email + Password
```

Passwords will be securely hashed using:

```text
bcryptjs
```

### Authorization

JWT-based authentication will be used for protected API access.

The authorization flow will be:

```text
Login
   ↓
Validate Credentials
   ↓
Generate JWT
   ↓
Authenticated Request
   ↓
Identify User Role
   ↓
Check Permission
   ↓
Allow / Deny Access
```

---

# 📁 Project Structure

The planned project structure is:

```text
college-management-system-fyp/
│
├── backend/
│   │
│   ├── src/
│   │   ├── config/
│   │   ├── models/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── services/
│   │   ├── validators/
│   │   └── utils/
│   │
│   ├── server.js
│   ├── .env
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│
├── docs/
│   ├── requirements/
│   ├── api/
│   ├── database/
│   ├── architecture/
│   ├── testing/
│   └── project-notes/
│
├── .gitignore
└── README.md
```

---

# 🔌 Backend API Structure

The backend will provide RESTful APIs.

Planned API groups include:

```text
/api/auth
/api/users
/api/roles
/api/permissions
/api/students
/api/teachers
/api/parents
/api/subjects
/api/results
/api/timetables
/api/notices
/api/notifications
/api/student-leaves
/api/teacher-leaves
/api/settings
```

---

# 🔒 Security Requirements

The system will follow basic security best practices.

* Password hashing with bcrypt.
* JWT authentication.
* Protected routes.
* Role-based authorization.
* Permission-based authorization.
* Environment variables for sensitive configuration.
* Input validation.
* Secure error handling.
* CORS configuration.
* Protection against unauthorized resource access.

---

# 📱 Responsive Design

The frontend will be designed to work on:

* Desktop
* Laptop
* Tablet
* Mobile

The dashboard and management interfaces should remain usable across different screen sizes.

---

# 📊 Main System Modules

The major modules planned for the system are:

```text
Authentication
User Management
Role Management
Permission Management
Student Management
Teacher Management
Parent Management
Subject Management
Attendance
Results
Assignments
Timetable
Timetable Changes
Student Leaves
Teacher Leaves
Notices
Notifications
Reports
System Settings
Dashboard
```

---

# 🔄 Development Workflow

The project will be developed in stages.

### Phase 1 — Project Preparation

* Requirements gathering
* System architecture
* Database verification
* Project documentation
* Folder structure

### Phase 2 — Backend Foundation

* Express server
* MongoDB connection
* Models
* Authentication
* Authorization
* Middleware
* API routes

### Phase 3 — Core Modules

* Users
* Roles
* Permissions
* Students
* Teachers
* Parents
* Subjects

### Phase 4 — Academic Modules

* Attendance
* Results
* Assignments
* Timetables
* Timetable changes

### Phase 5 — Administrative Modules

* Notices
* Notifications
* Student leaves
* Teacher leaves
* Reports
* System settings

### Phase 6 — Frontend

* Authentication UI
* Dashboards
* Role-based navigation
* Management pages
* Forms
* Tables
* Responsive design

### Phase 7 — Testing

* API testing
* Authentication testing
* Authorization testing
* Database testing
* UI testing
* Responsive testing
* Security testing

### Phase 8 — Finalization

* Bug fixing
* Performance improvements
* Documentation
* Deployment preparation
* FYP presentation preparation

---

# 🧪 Testing Strategy

Testing will cover:

```text
Unit Testing
Integration Testing
API Testing
Authentication Testing
Authorization Testing
Database Testing
UI Testing
Responsive Testing
Security Testing
```

API testing can be performed using tools such as Postman.

---

# 🚀 Local Development Setup

## Requirements

Install the following:

```text
Node.js
MongoDB
MongoDB Compass
Visual Studio Code
Git
```

## Backend Setup

```powershell
cd backend
npm install
npm run dev
```

The backend server will run on:

```text
http://localhost:5000
```

---

# ⚙️ Environment Variables

The backend uses environment variables for configuration.

Example:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/college_management_system
JWT_SECRET=your_secret_key
```

**Never commit real secrets or passwords to GitHub.**

---

# 📌 Current Development Status

### Project Setup

* [x] Project folder structure
* [x] Backend initialized
* [x] Node.js project initialized
* [x] Express installed
* [x] Mongoose installed
* [x] Authentication dependencies installed
* [x] Nodemon installed
* [x] Express server created
* [x] MongoDB connected
* [x] Database verified
* [x] Collections identified
* [x] Roles identified
* [x] Permissions identified

### In Progress

* [ ] Database models
* [ ] User authentication
* [ ] JWT authentication
* [ ] Role-based authorization
* [ ] Permission middleware
* [ ] REST APIs
* [ ] Frontend
* [ ] Dashboard
* [ ] Testing
* [ ] Deployment

---

# 🎓 FYP Information

**Project:** College Management System

**Project Type:** Final Year Project (FYP)

**Architecture:** Full-Stack Web Application

**Database:** MongoDB

**Backend:** Node.js + Express.js

**Frontend:** React.js

**Authentication:** JWT + bcrypt

**Authorization:** Role-Based Access Control (RBAC)

---

# 📄 Documentation

Project documentation will be maintained inside:

```text
docs/
├── requirements/
├── api/
├── database/
├── architecture/
├── testing/
└── project-notes/
```

These folders will contain project requirements, database documentation, API documentation, architecture decisions, testing documentation, and development notes.

---

# ⚠️ Development Principles

The project will follow these principles:

1. Existing database structure should be verified before creating models.
2. Backend and frontend should remain modular.
3. Sensitive information must remain in environment variables.
4. Authentication and authorization must be implemented before protected modules.
5. API validation should be implemented before accepting user input.
6. Role and permission checks should be centralized in middleware.
7. Database changes should be documented.
8. Code should remain maintainable and scalable.
9. Features should be tested before being considered complete.
10. Documentation should be updated alongside development.

---

# 📌 Project Status

**Status:** Development

**Current Stage:** Backend Foundation & Database Verification

The basic Express backend and MongoDB connection have been successfully established. Existing MongoDB collections, roles, and permissions have been reviewed and will be used as the foundation for the remaining development.

---

## License

This project is developed as a Final Year Project (FYP) for educational purposes.
