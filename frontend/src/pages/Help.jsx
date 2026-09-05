import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const workflows = {
    PATIENT: [
        ["Create your profile", "Open Patient Profile, enter a valid NIC and personal details, then save. A patient profile is required before booking."],
        ["Book an appointment", "Open Appointments, choose dentist, treatment and time. The system checks the dentist's availability and creates a unique appointment number."],
        ["Complete payment", "After booking you are taken to payment. If you leave, open My Payments later, find the appointment marked Payment Pending, and select Continue Payment."],
        ["View clinical information", "Use Prescriptions to view prescriptions issued by your dentist and Updates to read appointment messages."],
        ["Download receipts", "Open My Payments and select Receipt beside a paid appointment."],
        ["Send an inquiry / feedback", "Use Inquiries to contact a dentist and Feedback to submit your clinic experience."],
    ],
    RECEPTIONIST: [
        ["Find a patient", "Open Patient Records and search by NIC. You can also select a stored appointment number from the dropdown to locate the related patient."],
        ["Manage appointments", "Open Appointments to create an appointment for a registered patient. Confirm the patient NIC and requested dentist, treatment and time."],
        ["Collect outstanding payment", "From a patient's financial records, select Collect Payment for an unpaid appointment. A receipt is generated after successful payment."],
        ["Review prescriptions", "Open Prescription & Medicine Desk, search the patient, review prescriptions and record medicines actually given."],
        ["Prevent duplicate medicine", "A medicine already recorded for the same prescription cannot be added again. Check the existing dispensation list first."],
        ["Use Help", "This page explains the normal reception workflow and reduces the need to remember individual screens or API actions."],
    ],
    ADMIN: [
        ["Manage the clinic workflow", "Use the same patient, appointment, payment and prescription functions available to reception staff, with administrative access."],
        ["Search records safely", "Use Patient Records by NIC or appointment number. Clinical records are restricted to authorised staff roles."],
        ["Review payments", "Open patient financial records to see paid and pending appointments and access receipts."],
        ["Review medicine history", "Use the Prescription & Medicine Desk to see prescriptions and medicines dispensed to a patient."],
    ],
    DENTIST: [
        ["View assigned appointments", "Open the Dentist workspace. Only appointments assigned to the logged-in dentist are displayed."],
        ["Review previous prescriptions", "Select View Prescription History on an appointment to see the patient's previous prescriptions relevant to your assigned patient."],
        ["Create a prescription", "Open Dentist Prescriptions, choose an appointment and record diagnosis, medicines and instructions."],
        ["Update a patient", "Add an appointment update and status. The system records the update and attempts to email the patient."],
        ["Maintain privacy", "Only access clinical information for patients assigned to you. Do not share patient information outside the clinic."],
    ]
};

export default function Help() {
    const { user } = useAuth();
    const [open, setOpen] = useState(0);
    const items = workflows[user?.role] || workflows.PATIENT;
    return <div className="app">
        <header><b>✦ SYSTEM HELP</b><a href="/dashboard">Dashboard</a></header>
        <main><div className="feature-page">
            <div className="feature-title"><span>SUNRISE DENTAL</span><h1>Help & Workflow Guide</h1><p>Follow these simple steps to complete the main functions in the system. The available instructions are tailored to your role.</p></div>
            <div className="feature-card" style={{marginBottom:18}}><h2>Your role: {user?.role || "User"}</h2><p>Security, validation and database checks run on the backend as well as the interface. If a validation message appears, follow the message before continuing.</p></div>
            <div className="help-list">{items.map(([title, text], i) => <div className="feature-card" key={title} style={{marginBottom:12}}><button style={{width:"100%",display:"flex",justifyContent:"space-between",background:"transparent",border:0,padding:0,cursor:"pointer",textAlign:"left"}} onClick={() => setOpen(open===i ? -1 : i)}><h2 style={{margin:0}}>{i+1}. {title}</h2><strong>{open===i ? "−" : "+"}</strong></button>{open===i && <p style={{marginTop:12,lineHeight:1.65}}>{text}</p>}</div>)}</div>
            <div className="feature-card"><h2>Security & validation reminders</h2><ul><li>Patient NIC must be 12 digits or 9 digits followed by V/X.</li><li>Patients must have a saved profile before booking their own appointment.</li><li>Appointments have unique numbers and payment status is retained in the database.</li><li>Card number and CVV are not stored; only the last four digits are retained for a payment record.</li><li>Reception staff and dentists see only the clinical functions permitted to their roles.</li></ul></div>
        </div></main>
    </div>;
}
