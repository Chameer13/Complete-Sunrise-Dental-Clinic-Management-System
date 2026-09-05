# Sunrise Dental Clinic – Completed Feature Upgrade

This package keeps the existing Sunrise Dental theme, frontend structure, Spring Boot backend, H2 database connection and existing functions. The requested security and workflow features have been added without changing the overall design direction.

## Added / improved functions

1. **Patient profile security before booking**
   - Patient booking is blocked when the logged-in patient does not have a patient profile.
   - The screen clearly asks the patient to create/complete the profile first.
   - Backend also enforces this rule, so it cannot be bypassed from the browser.

2. **NIC validation**
   - Accepted formats are exactly:
     - 12 digits, e.g. `200299108740`
     - 9 digits followed by `V`/`X`, e.g. `694479542V`
   - Invalid values show an understandable `Invalid NIC format` message.
   - Validation is applied in the appointment request and patient profile request.

3. **Recover an unpaid appointment payment**
   - A new patient **My Payments** page lists appointment numbers, amounts and payment status.
   - If a patient books and leaves the payment screen, the appointment remains stored.
   - Returning to **My Payments** shows `Payment Pending` and a **Continue Payment** action.
   - Paid appointments show the payment information and receipt action where available.

4. **Reception patient lookup by NIC or appointment number**
   - Staff Patient Records keeps NIC search.
   - A database-backed appointment-number dropdown is added.
   - Selecting an appointment number finds the associated patient automatically.
   - Staff can therefore locate a patient using either NIC or appointment number.

5. **Medicine dispensing history**
   - Staff can view medicines dispensed to a patient together with prescription number, appointment number, diagnosis and dispensing details.
   - Prescription & Medicine Desk also shows medicines previously provided for each prescription.

6. **Duplicate medicine protection**
   - The same medicine cannot be recorded twice for the same prescription, case-insensitive.
   - Both backend validation and a database unique constraint protect the record.

7. **Dentist prescription history**
   - Dentist appointment cards now include **View Prescription History**.
   - The dentist can see previous prescriptions for an assigned patient.
   - Backend checks that the dentist has an appointment relationship with the patient before exposing the clinical history.

8. **Role-based Help & Workflow Guide**
   - A new Help page explains the normal steps for patients, reception staff/admins and dentists.
   - Dashboard quick access links have been added for Help and patient My Payments.

## Existing functions retained

- JWT authentication and role-based access
- Patient profiles
- Appointment scheduling and dentist availability checking
- Dentist appointment updates
- Prescriptions
- Medicine dispensing
- Billing and payment
- PDF receipts
- Email attempts for receipts and dentist updates
- Patient inquiries and feedback
- Swagger/OpenAPI configuration
- H2 file database
- Existing Sunrise Dental header/footer/theme components

## Run the system

### Backend
1. Open the `backend` folder in IntelliJ IDEA.
2. Use a JDK compatible with the project configuration (Java 21 is configured in `pom.xml`).
3. Make sure Maven is available in IntelliJ.
4. Run `SunriseDentalApplication.java`.
5. Backend URL: `http://localhost:8080`
6. Swagger UI: `http://localhost:8080/swagger-ui.html`
7. H2 console: `http://localhost:8080/h2-console`

The project uses a file-based H2 database at `./data/sunrise_dental_db` and `spring.jpa.hibernate.ddl-auto=update`, so the new medicine uniqueness constraint is applied when the backend starts.

### Frontend
1. Open the `frontend` folder in Visual Studio Code.
2. Run `npm install` if dependencies are not already installed.
3. Run `npm run dev`.
4. Open the Vite URL shown by the terminal, normally `http://localhost:5173`.

## Important test scenarios

- Patient account without profile → Appointments → should be blocked with profile message.
- Invalid NIC such as `12345678` or `1234567890123` → should show Invalid NIC format.
- Valid NIC `200299108740` → should pass format validation.
- Valid old NIC `694479542V` → should pass format validation.
- Book appointment → leave payment → open My Payments → select Continue Payment.
- Reception → Patient Records → select an appointment number → patient should load.
- Reception → Prescription & Medicine Desk → record medicine → try the same medicine again for the same prescription → duplicate should be rejected.
- Reception → Patient Records → medicine history should show the supplied medicine and related prescription.
- Dentist → appointment → View Prescription History → previous prescriptions for that assigned patient should appear.
- Dashboard → Help → role-specific workflow instructions should appear.
