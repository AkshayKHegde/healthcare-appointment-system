# HealthCare Appointment Management System — Backend

Spring Boot 3 + JPA + MySQL.

## 1. Create the database

```sql
CREATE DATABASE healthcare_db;
```

## 2. Set your MySQL credentials

Edit `src/main/resources/application.properties`:

```properties
spring.datasource.username=root
spring.datasource.password=root   <-- change to your MySQL password
```

Tables are created/updated automatically on startup (`spring.jpa.hibernate.ddl-auto=update`).

## 3. Run it

```bash
mvn spring-boot:run
```

The API starts on **http://localhost:8080**.

## 4. Try it with curl

```bash
# Register a patient
curl -X POST http://localhost:8080/api/patient/register \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","password":"pass123","email":"alice@mail.com"}'

# Register a doctor
curl -X POST http://localhost:8080/api/doctor/register \
  -H "Content-Type: application/json" \
  -d '{"username":"drsmith","password":"pass123","email":"smith@mail.com","specialty":"Cardiology"}'

# Login
curl -X POST http://localhost:8080/api/user/login \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","password":"pass123"}'

# Book an appointment (use the ids returned above)
curl -X POST "http://localhost:8080/api/patient/appointment?patientId=1&doctorId=2" \
  -H "Content-Type: application/json" \
  -d '{"appointmentTime":"2026-08-20 10:00:00"}'
```

## Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/patient/register | Register patient |
| POST | /api/doctor/register | Register doctor |
| POST | /api/receptionist/register | Register receptionist |
| POST | /api/user/login | Login (all roles) |
| GET | /api/patient/doctors?specialty= | Search doctors |
| POST | /api/patient/appointment?patientId=&doctorId= | Book appointment |
| GET | /api/patient/appointments?patientId= | View patient's appointments |
| GET | /api/patient/records?patientId= | View patient's medical records |
| GET | /api/doctor/appointments?doctorId= | View doctor's appointments |
| POST | /api/doctor/availability?doctorId=&availability= | Set availability |
| POST | /api/doctor/record?patientId=&doctorId= | Add a medical record |
| GET | /api/receptionist/appointments | View all appointments |
| POST | /api/receptionist/appointment?patientId=&doctorId= | Schedule appointment |
| PUT | /api/receptionist/appointment/reschedule/{id} | Reschedule appointment |
| PUT | /api/receptionist/appointment/cancel/{id} | Cancel appointment |

All appointment/record request bodies use `{"appointmentTime": "yyyy-MM-dd HH:mm:ss"}` or `{"notes": "..."}`.
