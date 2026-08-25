# Sunrise Dental Clinic — Registration & Login Module

Degree-level starter for the Sunrise Dental Clinic appointment and patient management system.

## Stack
- Backend: Java 21, Spring Boot 4.1.0, Spring Security, JWT, BCrypt, JPA, H2, Swagger/OpenAPI
- Frontend: React 19.2.0, Vite 7.2.2, React Router 7.9.6, Axios 1.7.9

## 1. Run backend in IntelliJ IDEA
Open the `backend` folder as a Maven project. Use Java 21 (Java 17+ is also suitable for Spring Boot 4, but this project targets 21).
Run `SunriseDentalApplication.java`.

Backend: http://localhost:8080
Swagger: http://localhost:8080/swagger-ui.html
OpenAPI JSON: http://localhost:8080/v3/api-docs
H2 Console: http://localhost:8080/h2-console

H2 JDBC URL:
`jdbc:h2:file:./data/sunrise_dental_db;AUTO_SERVER=TRUE`
User: `sa`
Password: blank

## 2. Run frontend in VS Code
Open `frontend` in VS Code.

```bash
npm install
npm run dev
```

Frontend: http://localhost:5173

## 3. API examples
### Register
POST `/api/auth/register`
```json
{
  "fullName":"Nimal Perera",
  "username":"nimal.staff",
  "email":"nimal@sunrisedental.lk",
  "password":"Strong@123",
  "role":"RECEPTIONIST"
}
```

### Login
POST `/api/auth/login`
```json
{
  "username":"nimal.staff",
  "password":"Strong@123"
}
```

## Validation
Both client and server validate input. Passwords are BCrypt hashed. Username/email are unique. JWT is returned after successful login and attached to protected API requests.

## Development note
The H2 database is suitable for development/testing. For final deployment, use a production database and store the JWT secret in environment variables rather than committing it to source control.
