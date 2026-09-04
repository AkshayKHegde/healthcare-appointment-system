# HealthCare Appointment Management System — Frontend

React 18 + Vite + React Router.

## 1. Install dependencies

```bash
npm install
```

## 2. Run the dev server

```bash
npm run dev
```

Opens at **http://localhost:5173**. Make sure the Spring Boot backend is running on
**http://localhost:8080** first (see the backend README) — the API base URL is set in
`src/api/client.js`.

## What's included

- `pages/LoginPage.jsx`, `pages/RegistrationPage.jsx` — auth flows, with role-specific fields
  (Doctor registration asks for a specialty)
- `pages/PatientDashboard.jsx` — search doctors, book appointments, view appointments & records
- `pages/DoctorDashboard.jsx` — toggle availability, view appointments, add patient records
- `pages/ReceptionistDashboard.jsx` — schedule/reschedule/cancel appointments for any patient
- `components/BookAppointmentForm.jsx`, `components/ViewAppointmentsPage.jsx`,
  `components/DoctorAvailabilityForm.jsx`, `components/TopBar.jsx`
- `api/client.js` — fetch wrapper for every backend endpoint
- `api/AuthContext.jsx` — logged-in user stored in session storage, drives role-based routing

## Notes

- Login stores `{ id, username, role }` — the `id` is what gets passed as `patientId` /
  `doctorId` to the backend, so make sure the ids you register with match what you pass
  around when testing manually.
- Session is stored in `sessionStorage`, so it clears when the tab closes (easy to reset while
  testing different roles).
