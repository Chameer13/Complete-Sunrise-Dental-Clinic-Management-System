# Sunrise Dental Clinic Management System — Complete Version

## Stack
- Frontend: React + Vite + Axios
- Backend: Spring Boot 4.1, Spring Security, JWT, JPA/Hibernate
- Database: H2 file database with relational foreign keys
- API documentation: Swagger/OpenAPI
- Email: Spring Mail with configurable SMTP
- Passwords: BCrypt hashing

## Main roles
- PATIENT — creates profile, books appointments by unique ID/NIC, views appointments, updates and bills.
- RECEPTIONIST — searches patient by ID, creates/updates profiles, books appointments, views appointments/updates, creates bills.
- DENTIST — views only assigned appointments and can update status/message; patient receives system update and email when SMTP is configured.
- ADMIN — administrative access foundation.

## Important workflows
1. Patient registers with email and password.
2. Verification token is sent by email. Login is blocked until verification.
3. Patient completes profile using unique Sri Lankan NIC/ID number.
4. Patient or receptionist books appointment by patient ID number.
5. Dentist conflict validation prevents overlapping appointments.
6. Dentist sees only their own appointments.
7. Dentist can change appointment status and add a patient message.
8. Message is stored in `appointment_updates` and email is attempted to the patient.
9. Receptionist can view all updates.
10. Billing is linked directly to the appointment and therefore the patient and treatment through foreign keys.
11. Forgot password generates a 6-digit OTP valid for 10 minutes.

## H2
The database is persistent:
`./backend/data/sunrise_dental_db`

H2 console:
`http://localhost:8080/h2-console`

JDBC URL:
`jdbc:h2:file:./data/sunrise_dental_db;AUTO_SERVER=TRUE`

Username: `sa`
Password: empty

## Swagger
`http://localhost:8080/swagger-ui.html`

## Development accounts
Created automatically only when the database is empty:
- admin / `Admin@123`
- dentist1 / `Dentist@123`

These two are pre-verified for local testing. Change passwords before any real deployment.

## Email configuration
By default `MAIL_ENABLED=false`, so email operations are printed in the backend console for development.

For real email, set:
- `MAIL_ENABLED=true`
- `MAIL_FROM`
- `MAIL_HOST`
- `MAIL_PORT`
- `MAIL_USERNAME`
- `MAIL_PASSWORD`
- `MAIL_SMTP_AUTH=true`
- `MAIL_SMTP_STARTTLS=true` when required by the provider

Never commit SMTP passwords or JWT secrets to source control.

## Run
Backend:
```bash
cd backend
mvn spring-boot:run
```

Frontend:
```bash
cd frontend
npm install
npm run dev
```

Frontend: `http://localhost:5173`
Backend: `http://localhost:8080`

## Validation and database relationships
Key relationships:
- `users` 1—1 `patients`
- `users` 1—1 `dentists`
- `patients` 1—many `appointments`
- `dentists` 1—many `appointments`
- `treatments` 1—many `appointments`
- `appointments` 1—many `appointment_updates`
- `dentists` 1—many `appointment_updates`
- `appointments` 1—1 `bills`
- `patients` 1—many `bills`
- `users` 1—1 active email verification token
- `users` 1—many password reset OTP records

Do not use `ddl-auto=update` for production migrations; use Flyway/Liquibase and environment-specific secrets for a production deployment.

## Version History

- v1.0.0 - Login and Registration
- v1.1.0 - Basic Clinic Management System
- v1.2.0 - Patient Module and Dashboard
- v1.3.0 - Final Staff Requirements and Dentist Search
