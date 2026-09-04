# HealthCare Appointment Management System

Full-stack case study project: React (frontend) + Spring Boot (backend) + MySQL (database).

```
healthcare-appointment-system/
├── backend/     Spring Boot API (Java, Maven, MySQL)
└── frontend/    React app (Vite)
```

## Quick start

### 1. Backend
```bash
cd backend
# create the database first: CREATE DATABASE healthcare_db;
# set your MySQL password in src/main/resources/application.properties
mvn spring-boot:run
```
Runs on **http://localhost:8080**.

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```
Runs on **http://localhost:5173**.

Start the backend first, then the frontend — the React app calls the API at `localhost:8080`.

See `backend/README.md` and `frontend/README.md` for full endpoint lists, curl examples,
and a breakdown of what each file does.
