# Sunrise Dental Clinic – Final Feature Update

This version preserves the existing Sunrise Dental theme and adds the requested final requirements.

## Patient
- About Us page with modern clinic content.
- Patient feedback and 1–5 star rating; stored against the authenticated patient/user in H2.
- Patient NIC/ID lookup is ownership protected: patients can only retrieve their own profile; reception/admin can search patient profiles.
- Dentist Inquiry page: patient selects an active dentist, sends a private question, and can see the stored conversation.
- Patient prescription page for prescriptions issued by dentists.

## Dentist
- Patient Updates page now includes patient inquiry messages assigned to the logged-in dentist.
- Dentist can reply to an inquiry; reply is stored in H2 and email delivery is attempted automatically.
- Dentist can create/update a prescription for an appointment assigned to that dentist.
- Dentist can view only their own appointment schedule and assigned clinical data.

## Receptionist / Admin
- Dentist Schedule shows all appointments by default.
- Dentist and appointment-date filters can be applied together.
- Patient Feedback page displays ratings/comments.
- Prescription & Medicine Desk searches by patient NIC/ID and displays prescriptions.
- Staff can record medicines physically provided to a patient, including medicine name, quantity, batch number and dispensing notes; the record is stored in H2.
- Staff can continue to search patient records and process payments/receipts.

## Database
New H2/JPA entities/tables are added automatically with `spring.jpa.hibernate.ddl-auto=update`:
- `feedbacks`
- `patient_inquiries`
- `prescriptions`
- `medicine_dispensations`

## New frontend routes
- `/about`
- `/feedback`
- `/inquiries`
- `/prescriptions`
- `/dentist/prescriptions`
- `/staff/prescriptions`

## New backend API areas
- `/api/feedback/**`
- `/api/inquiries/**`
- `/api/dentist/inquiries/**`
- `/api/dentist/appointments/{appointmentId}/prescription`
- `/api/me/prescriptions`
- `/api/staff/patients/{idNumber}/prescriptions`
- `/api/staff/prescriptions/**`
- `/api/staff/appointments?dentistId=&date=`

## Run
Backend: open the `backend` folder in IntelliJ and run `SunriseDentalApplication`.
Frontend: open a terminal in `frontend` and run `npm install`, then `npm run dev`.

The existing H2 file data is included in the project copy. Back up the database before major schema experiments.
