
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./Help.css";

const workflows = {
    PATIENT: [
        {
            number: "01",
            icon: "👤",
            title: "Create Your Patient Profile",
            description:
                "Before making an appointment, create and save your patient profile. Enter your personal information and a valid Sri Lankan NIC.",
            action: "Patient Profile"
        },
        {
            number: "02",
            icon: "📅",
            title: "Book an Appointment",
            description:
                "Select a dentist, treatment and available appointment time. The system checks dentist availability and creates a unique appointment number.",
            action: "Appointments"
        },
        {
            number: "03",
            icon: "💳",
            title: "Complete Your Payment",
            description:
                "After booking an appointment, complete the payment. If payment was not completed, you can continue it later from My Payments.",
            action: "My Payments"
        },
        {
            number: "04",
            icon: "💊",
            title: "View Prescriptions",
            description:
                "View prescriptions issued by your dentist, including medicines, dosage instructions and prescription information.",
            action: "Prescriptions"
        },
        {
            number: "05",
            icon: "🧾",
            title: "Download Your Receipt",
            description:
                "After a successful payment, open My Payments and select the receipt option to view or download your payment receipt.",
            action: "Receipt"
        },
        {
            number: "06",
            icon: "💬",
            title: "Send an Inquiry or Feedback",
            description:
                "Use Inquiries to communicate with the clinic and Feedback to share your experience or suggestions.",
            action: "Inquiries & Feedback"
        }
    ],

    RECEPTIONIST: [
        {
            number: "01",
            icon: "🔍",
            title: "Find a Patient",
            description:
                "Search Patient Records using the patient's NIC or an existing appointment number.",
            action: "Patient Records"
        },
        {
            number: "02",
            icon: "📅",
            title: "Manage Appointments",
            description:
                "Create and manage appointments for registered patients. Confirm the patient NIC, dentist, treatment and appointment time.",
            action: "Appointments"
        },
        {
            number: "03",
            icon: "💰",
            title: "Collect Outstanding Payment",
            description:
                "Open the patient's financial records and select Collect Payment for an unpaid appointment. A receipt is generated after successful payment.",
            action: "Financial Records"
        },
        {
            number: "04",
            icon: "💊",
            title: "Manage Prescriptions",
            description:
                "Search for a patient, review prescriptions and record medicines that were actually dispensed.",
            action: "Prescription Desk"
        },
        {
            number: "05",
            icon: "🛡️",
            title: "Avoid Duplicate Medicine Records",
            description:
                "Check the existing dispensation records before adding medicine. The system prevents duplicate medicine entries for the same prescription.",
            action: "Medicine Desk"
        }
    ],

    ADMIN: [
        {
            number: "01",
            icon: "⚙️",
            title: "Manage Clinic Operations",
            description:
                "Administrators can access and manage the major patient, appointment, payment and prescription functions.",
            action: "Administration"
        },
        {
            number: "02",
            icon: "🔐",
            title: "Access Patient Records Safely",
            description:
                "Search patient records using NIC or appointment number. Clinical information is restricted to authorised users.",
            action: "Patient Records"
        },
        {
            number: "03",
            icon: "💳",
            title: "Review Payments",
            description:
                "Review paid and pending appointments and access the corresponding payment receipts.",
            action: "Payments"
        },
        {
            number: "04",
            icon: "💊",
            title: "Review Medicine History",
            description:
                "Review prescriptions and medicine dispensation records associated with patients.",
            action: "Prescription Desk"
        }
    ],

    DENTIST: [
        {
            number: "01",
            icon: "📋",
            title: "View Assigned Appointments",
            description:
                "Open the dentist workspace to view appointments assigned to your dentist account.",
            action: "Dentist Workspace"
        },
        {
            number: "02",
            icon: "📖",
            title: "Review Prescription History",
            description:
                "Open an assigned appointment and review relevant previous prescriptions for the patient.",
            action: "Prescription History"
        },
        {
            number: "03",
            icon: "💊",
            title: "Create a Prescription",
            description:
                "Select an appointment and record diagnosis, medicines, dosage and instructions for the patient.",
            action: "Dentist Prescriptions"
        },
        {
            number: "04",
            icon: "📝",
            title: "Update Appointment Information",
            description:
                "Add appointment updates and status information. The system records the update and can notify the patient.",
            action: "Appointment Updates"
        },
        {
            number: "05",
            icon: "🔒",
            title: "Protect Patient Privacy",
            description:
                "Only access clinical information required for your assigned patients. Patient information must remain confidential.",
            action: "Privacy"
        }
    ]
};

const roleNames = {
    PATIENT: "Patient",
    RECEPTIONIST: "Receptionist",
    ADMIN: "Administrator",
    DENTIST: "Dentist"
};

const roleIcons = {
    PATIENT: "👤",
    RECEPTIONIST: "🧑‍💼",
    ADMIN: "⚙️",
    DENTIST: "🩺"
};

export default function Help() {
    const { user } = useAuth();

    const role = user?.role || "PATIENT";
    const steps = workflows[role] || workflows.PATIENT;

    const [activeStep, setActiveStep] = useState(0);

    const toggleStep = (index) => {
        setActiveStep(activeStep === index ? -1 : index);
    };

    return (
        <div className="dental-help">

            {/* TOP BAR */}
            <header className="help-topbar">

                <div className="help-brand">
                    <div className="help-brand-icon">
                        +
                    </div>

                    <div>
                        <h2>Sunrise Dental</h2>
                        <span>Clinic Management System</span>
                    </div>
                </div>

                <a href="/dashboard" className="back-dashboard">
                    <span>←</span>
                    Dashboard
                </a>

            </header>


            {/* PAGE */}
            <main className="help-main">

                {/* PAGE INTRO */}
                <section className="help-intro">

                    <div className="intro-text">

                        <div className="page-label">
                            HELP CENTRE
                        </div>

                        <h1>
                            How can we help you?
                        </h1>

                        <p>
                            Find simple instructions for using the Sunrise
                            Dental Clinic Management System. The guide below
                            is customised according to your account role.
                        </p>

                    </div>

                    <div className="intro-tooth">
                        <div className="tooth-circle">
                            🦷
                        </div>
                    </div>

                </section>


                {/* ROLE INFORMATION */}
                <section className="role-information">

                    <div className="role-left">

                        <div className="role-icon">
                            {roleIcons[role]}
                        </div>

                        <div>
                            <span>YOUR ACCOUNT ROLE</span>
                            <h3>
                                {roleNames[role] || "User"}
                            </h3>
                        </div>

                    </div>

                    <div className="role-status">
                        <span className="status-dot"></span>
                        Access permissions active
                    </div>

                </section>


                {/* MAIN CONTENT */}
                <div className="help-layout">

                    {/* LEFT */}
                    <section className="workflow-section">

                        <div className="section-header">

                            <div>
                                <span className="section-label">
                                    GETTING STARTED
                                </span>

                                <h2>
                                    Step-by-step guide
                                </h2>
                            </div>

                            <span className="step-total">
                                {steps.length} steps
                            </span>

                        </div>


                        <div className="workflow-container">

                            {steps.map((step, index) => {

                                const isActive = activeStep === index;

                                return (
                                    <div
                                        className={`workflow-item ${
                                            isActive ? "is-active" : ""
                                        }`}
                                        key={step.number}
                                    >

                                        <button
                                            className="workflow-header"
                                            onClick={() =>
                                                toggleStep(index)
                                            }
                                        >

                                            <div className="step-number">
                                                {step.number}
                                            </div>

                                            <div className="step-icon">
                                                {step.icon}
                                            </div>

                                            <div className="step-title">
                                                <span>
                                                    STEP {step.number}
                                                </span>

                                                <h3>
                                                    {step.title}
                                                </h3>
                                            </div>

                                            <div className="step-arrow">
                                                {isActive ? "−" : "+"}
                                            </div>

                                        </button>


                                        {isActive && (
                                            <div className="workflow-body">

                                                <p>
                                                    {step.description}
                                                </p>

                                                <div className="workflow-action">
                                                    <span>
                                                        Recommended section
                                                    </span>

                                                    <strong>
                                                        {step.action}
                                                    </strong>
                                                </div>

                                            </div>
                                        )}

                                    </div>
                                );

                            })}

                        </div>

                    </section>


                    {/* RIGHT SIDEBAR */}
                    <aside className="help-sidebar">

                        {/* SECURITY CARD */}
                        <div className="security-panel">

                            <div className="security-heading">

                                <div className="security-icon">
                                    🔐
                                </div>

                                <div>
                                    <span>IMPORTANT</span>
                                    <h2>
                                        Security & Validation
                                    </h2>
                                </div>

                            </div>

                            <p className="security-intro">
                                Please follow these rules when using
                                the clinic system.
                            </p>

                            <div className="security-list">

                                <div className="security-item">
                                    <div>✓</div>
                                    <p>
                                        Patient NIC must be in the
                                        accepted Sri Lankan NIC format.
                                    </p>
                                </div>

                                <div className="security-item">
                                    <div>✓</div>
                                    <p>
                                        Patients must create and save
                                        their profile before booking.
                                    </p>
                                </div>

                                <div className="security-item">
                                    <div>✓</div>
                                    <p>
                                        Each appointment receives a
                                        unique appointment number.
                                    </p>
                                </div>

                                <div className="security-item">
                                    <div>✓</div>
                                    <p>
                                        Card number and CVV are not
                                        stored in the system.
                                    </p>
                                </div>

                                <div className="security-item">
                                    <div>✓</div>
                                    <p>
                                        Clinical information is available
                                        only to authorised roles.
                                    </p>
                                </div>

                            </div>

                        </div>


                        {/* QUICK HELP */}
                        <div className="quick-help">

                            <div className="quick-help-icon">
                                ?
                            </div>

                            <h2>
                                Having a problem?
                            </h2>

                            <p>
                                If the system displays a validation message,
                                read the message carefully and correct the
                                requested information before continuing.
                            </p>

                            <a
                                href="/dashboard"
                                className="quick-help-button"
                            >
                                Return to Dashboard
                            </a>

                        </div>



                    </aside>

                </div>


                
            </main>

        </div>
    );
}
