import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "/Dentist.css";

export default function Dentist() {

    const { user } = useAuth();

    const [appointments, setAppointments] = useState([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(null);
    const [historyPatient, setHistoryPatient] = useState(null);
    const [history, setHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);

    const loadAppointments = async () => {

        setLoading(true);
        setMessage("");

        try {

            const response =
                await api.get("/dentist/appointments");

            setAppointments(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );

        } catch (error) {

            console.error(
                "Dentist appointments error:",
                error
            );

            setMessage(
                error.response?.data?.message ||
                "Unable to load your appointments. Please try again."
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {
        loadAppointments();
    }, []);


    const viewPatientHistory = async (appointment) => {
        setHistoryLoading(true);
        setHistoryPatient(appointment.patient);
        try {
            const r = await api.get(`/dentist/patients/${encodeURIComponent(appointment.patient?.idNumber || "")}/prescriptions`);
            setHistory(r.data || []);
        } catch (error) {
            setHistory([]);
            setMessage(error.response?.data?.message || "Unable to load this patient's prescription history.");
        } finally { setHistoryLoading(false); }
    };

    const updateAppointment = async (appointment) => {

        const updateMessage = window.prompt(
            "Enter the message to send to the patient:",
            ""
        );

        if (!updateMessage || !updateMessage.trim()) {
            return;
        }


        const status = window.prompt(
            "Appointment status:\n\nBOOKED\nCONFIRMED\nCOMPLETED\nCANCELLED",
            appointment.status || "CONFIRMED"
        );

        if (!status || !status.trim()) {
            return;
        }


        const finalStatus =
            status.trim().toUpperCase();


        const allowedStatuses = [
            "BOOKED",
            "CONFIRMED",
            "COMPLETED",
            "CANCELLED"
        ];


        if (!allowedStatuses.includes(finalStatus)) {

            setMessage(
                "Invalid appointment status. Please use BOOKED, CONFIRMED, COMPLETED or CANCELLED."
            );

            return;
        }


        setUpdating(appointment.id);
        setMessage("");


        try {

            await api.put(
                `/dentist/appointments/${appointment.id}`,
                {
                    status: finalStatus,
                    message: updateMessage.trim()
                }
            );


            setMessage(
                "Appointment update saved successfully. The patient's email was attempted automatically."
            );


            await loadAppointments();

        } catch (error) {

            console.error(
                "Appointment update error:",
                error
            );

            setMessage(
                error.response?.data?.message ||
                "Unable to save the appointment update."
            );

        } finally {

            setUpdating(null);

        }
    };


    /* =========================================================
       STATISTICS
       ========================================================= */

    const total = appointments.length;

    const confirmed = appointments.filter(
        x =>
            String(x.status).toUpperCase() ===
            "CONFIRMED"
    ).length;

    const booked = appointments.filter(
        x =>
            String(x.status).toUpperCase() ===
            "BOOKED"
    ).length;

    const completed = appointments.filter(
        x =>
            String(x.status).toUpperCase() ===
            "COMPLETED"
    ).length;


    const firstName =
        user?.fullName
            ?.split(" ")[0] ||
        "Doctor";


    return (

        <div className="dentist-page">


            {/* =====================================================
                HEADER
            ===================================================== */}

            <header className="dentist-header">

                <div className="dentist-brand">

                    <div className="dentist-logo">
                        🦷
                    </div>

                    <div>

                        <h2>
                            SUNRISE DENTAL
                        </h2>

                        <span>
                            Clinical Management System
                        </span>

                    </div>

                </div>


                <div className="dentist-header-right">

                    <div className="doctor-online">

                        <span></span>

                        Online

                    </div>


                    <div className="doctor-name">

                        <strong>
                             {user?.fullName || "Dentist"}
                        </strong>

                        <small>
                            Dentist Portal
                        </small>

                    </div>


                    <a
                        href="/dashboard"
                        className="dentist-dashboard-link"
                    >
                        ← Dashboard
                    </a>

                </div>

            </header>



            {/* =====================================================
                MAIN
            ===================================================== */}

            <main className="dentist-main">


                {/* =================================================
                    HERO
                ================================================= */}

                <section className="dentist-hero">

                    <div className="hero-content">

                        <span className="hero-label">
                            DENTIST WORKSPACE
                        </span>

                        <h1>
                            Good morning,  {user?.fullName}
                        </h1>

                        <p>
                            Manage your patient appointments,
                            review treatment schedules and keep
                            patients informed about their dental care.
                        </p>


                        <div className="hero-details">

                            <div>

                                <span>
                                    TODAY
                                </span>

                                <strong>
                                    {new Date().toLocaleDateString(
                                        "en-GB",
                                        {
                                            weekday: "long",
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric"
                                        }
                                    )}
                                </strong>

                            </div>


                            <div>

                                <span>
                                    CLINIC STATUS
                                </span>

                                <strong>
                                    ● All systems operational
                                </strong>

                            </div>

                        </div>

                    </div>


                    <div className="hero-visual">

                        <div className="hero-circle">

                            🦷

                        </div>

                        <div className="floating-card">

                            <span>
                                TODAY'S PATIENTS
                            </span>

                            <strong>
                                {total}
                            </strong>

                        </div>

                    </div>

                </section>



                {/* =================================================
                    MESSAGE
                ================================================= */}

                {message && (

                    <div className="dentist-alert">

                        <span>
                            ✓
                        </span>

                        <div>
                            {message}
                        </div>

                        <button
                            onClick={() => setMessage("")}
                        >
                            ×
                        </button>

                    </div>

                )}



                {/* =================================================
                    STATISTICS
                ================================================= */}

                <section className="dentist-stats">


                    <div className="dentist-stat">

                        <div className="stat-icon blue">
                            ▣
                        </div>

                        <div>

                            <span>
                                TOTAL APPOINTMENTS
                            </span>

                            <strong>
                                {total}
                            </strong>

                            <small>
                                Your current schedule
                            </small>

                        </div>

                    </div>


                    <div className="dentist-stat">

                        <div className="stat-icon green">
                            ✓
                        </div>

                        <div>

                            <span>
                                CONFIRMED
                            </span>

                            <strong>
                                {confirmed}
                            </strong>

                            <small>
                                Confirmed patients
                            </small>

                        </div>

                    </div>


                    <div className="dentist-stat">

                        <div className="stat-icon orange">
                            ◷
                        </div>

                        <div>

                            <span>
                                BOOKED
                            </span>

                            <strong>
                                {booked}
                            </strong>

                            <small>
                                Awaiting confirmation
                            </small>

                        </div>

                    </div>


                    <div className="dentist-stat">

                        <div className="stat-icon purple">
                            ✓
                        </div>

                        <div>

                            <span>
                                COMPLETED
                            </span>

                            <strong>
                                {completed}
                            </strong>

                            <small>
                                Completed visits
                            </small>

                        </div>

                    </div>

                </section>



                {/* =================================================
                    APPOINTMENTS
                ================================================= */}

                <section className="appointments-panel">


                    <div className="appointments-heading">

                        <div>

                            <span>
                                CLINICAL SCHEDULE
                            </span>

                            <h2>
                                My Patient Appointments
                            </h2>

                            <p>
                                Appointments assigned to your dentist account.
                            </p>

                        </div>


                        <button
                            className="refresh-btn"
                            onClick={loadAppointments}
                            disabled={loading}
                        >
                            ↻ Refresh
                        </button>

                    </div>



                    {loading ? (

                        <div className="dentist-loading">

                            <div className="loading-spinner"></div>

                            <h3>
                                Loading your schedule
                            </h3>

                            <p>
                                Please wait while we retrieve
                                your appointments.
                            </p>

                        </div>

                    ) : appointments.length === 0 ? (

                        <div className="dentist-empty">

                            <div className="empty-tooth">
                                🦷
                            </div>

                            <h2>
                                No Appointments Scheduled
                            </h2>

                            <p>
                                There are currently no appointments
                                assigned to your dentist account.
                            </p>

                            <button
                                onClick={loadAppointments}
                            >
                                Refresh Schedule
                            </button>

                        </div>

                    ) : (

                        <div className="appointment-list">


                            {/* TABLE HEADER */}

                            <div className="appointment-header">

                                <span>
                                    APPOINTMENT
                                </span>

                                <span>
                                    PATIENT
                                </span>

                                <span>
                                    TREATMENT
                                </span>

                                <span>
                                    STATUS
                                </span>

                                <span>
                                    ACTION
                                </span>

                            </div>



                            {/* APPOINTMENTS */}

                            {appointments.map(
                                appointment => (

                                    <div
                                        className="appointment-row"
                                        key={appointment.id}
                                    >


                                        {/* Appointment */}

                                        <div className="appointment-time">

                                            <div className="appointment-icon">
                                                ◷
                                            </div>

                                            <div>

                                                <strong>
                                                    {
                                                        appointment.appointmentNumber
                                                    }
                                                </strong>

                                                <small>
                                                    {String(
                                                        appointment.appointmentDateTime ||
                                                        ""
                                                    ).replace(
                                                        "T",
                                                        " "
                                                    )}
                                                </small>

                                            </div>

                                        </div>



                                        {/* Patient */}

                                        <div className="patient-info">

                                            <div className="patient-avatar">

                                                {appointment.patient?.fullName
                                                    ?.charAt(0)
                                                    ?.toUpperCase() || "P"}

                                            </div>

                                            <div>

                                                <strong>
                                                    {
                                                        appointment.patient?.fullName ||
                                                        "Patient"
                                                    }
                                                </strong>

                                                <small>
                                                    ID:{" "}
                                                    {
                                                        appointment.patient?.idNumber ||
                                                        "Not available"
                                                    }
                                                </small>

                                            </div>

                                        </div>



                                        {/* Treatment */}

                                        <div className="treatment-info">

                                            <strong>
                                                {
                                                    appointment.treatment?.name ||
                                                    "Dental Treatment"
                                                }
                                            </strong>

                                            <small>

                                                {appointment.treatment?.defaultPrice
                                                    ? `Rs. ${Number(
                                                        appointment.treatment.defaultPrice
                                                    ).toLocaleString()}`
                                                    : "Price not available"}

                                            </small>

                                        </div>



                                        {/* Status */}

                                        <div>

                                            <span
                                                className={
                                                    "dentist-status " +
                                                    String(
                                                        appointment.status ||
                                                        "BOOKED"
                                                    ).toLowerCase()
                                                }
                                            >

                                                <i></i>

                                                {
                                                    appointment.status ||
                                                    "BOOKED"
                                                }

                                            </span>

                                        </div>



                                        {/* Action */}

                                        <div>

                                            <button
                                                className="update-patient-btn history-btn"
                                                onClick={() => viewPatientHistory(appointment)}
                                            >
                                                View Prescription History
                                            </button>

                                            <button
                                                className="update-patient-btn"
                                                disabled={
                                                    updating ===
                                                    appointment.id
                                                }
                                                onClick={() =>
                                                    updateAppointment(
                                                        appointment
                                                    )
                                                }
                                            >

                                                {updating === appointment.id
                                                    ? "Saving..."
                                                    : "Add Patient Update"
                                                }

                                            </button>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </section>


{historyPatient && (
    <div
        className="history-modal-backdrop"
        onClick={() => setHistoryPatient(null)}
    >
        <div
            className="history-modal"
            onClick={(e) => e.stopPropagation()}
        >

            {/* =========================
                MODAL HEADER
            ========================== */}

            <div className="history-modal-header">

                <div className="history-patient-profile">

                    <div className="history-patient-avatar">
                        {historyPatient?.fullName
                            ?.charAt(0)
                            ?.toUpperCase() || "P"}
                    </div>

                    <div>

                        <span className="history-label">
                            PATIENT PRESCRIPTION HISTORY
                        </span>

                        <h2>
                            {historyPatient?.fullName || "Patient"}
                        </h2>

                        <div className="history-patient-meta">

                            <span>
                                Patient ID:{" "}
                                {historyPatient?.idNumber ||
                                    "Protected"}
                            </span>

                            <span className="history-dot">
                                •
                            </span>

                            <span>
                                {history.length} Prescription
                                {history.length !== 1 ? "s" : ""}
                            </span>

                        </div>

                    </div>

                </div>

                <button
                    className="history-close-btn"
                    onClick={() => setHistoryPatient(null)}
                    aria-label="Close prescription history"
                >
                    ×
                </button>

            </div>


            {/* =========================
                MODAL BODY
            ========================== */}

            <div className="history-modal-body">

                {historyLoading ? (

                    <div className="history-loading">

                        <div className="history-spinner"></div>

                        <h3>
                            Loading clinical history
                        </h3>

                        <p>
                            Retrieving this patient's previous
                            prescriptions...
                        </p>

                    </div>

                ) : history.length ? (

                    <>

                        {/* SUMMARY */}

                        <div className="history-summary">

                            <div className="history-summary-icon">
                                Rx
                            </div>

                            <div>

                                <strong>
                                    Prescription Records
                                </strong>

                                <span>
                                    Previous prescriptions issued
                                    by the dental care team
                                </span>

                            </div>

                        </div>


                        {/* TIMELINE */}

                        <div className="history-timeline">

                            {history.map((p, index) => (

                                <article
                                    className="history-prescription"
                                    key={p.id}
                                >

                                    {/* TIMELINE NUMBER */}

                                    <div className="history-timeline-side">

                                        <div className="history-number">
                                            {history.length - index}
                                        </div>

                                        {index !== history.length - 1 && (
                                            <div className="history-line"></div>
                                        )}

                                    </div>


                                    {/* PRESCRIPTION CARD */}

                                    <div className="history-record">

                                        {/* RECORD HEADER */}

                                        <div className="history-record-header">

                                            <div>

                                                <span>
                                                    PRESCRIPTION
                                                </span>

                                                <h3>
                                                    Prescription #{p.id}
                                                </h3>

                                            </div>

                                            <div className="history-date">

                                                <span>
                                                    ISSUED
                                                </span>

                                                <strong>
                                                    {String(
                                                        p.prescribedAt || ""
                                                    ).replace(
                                                        "T",
                                                        " "
                                                    )}
                                                </strong>

                                            </div>

                                        </div>


                                        {/* DIAGNOSIS */}

                                        <div className="history-clinical-row">

                                            <div className="history-info-icon diagnosis">
                                                D
                                            </div>

                                            <div>

                                                <span>
                                                    Clinical Diagnosis
                                                </span>

                                                <p>
                                                    {p.diagnosis ||
                                                        "Not specified"}
                                                </p>

                                            </div>

                                        </div>


                                        {/* MEDICINES */}

                                        <div className="history-clinical-row">

                                            <div className="history-info-icon medicine">
                                                M
                                            </div>

                                            <div>

                                                <span>
                                                    Prescribed Medicines
                                                </span>

                                                <p>
                                                    {p.medicines ||
                                                        "No medicines specified"}
                                                </p>

                                            </div>

                                        </div>


                                        {/* INSTRUCTIONS */}

                                        {p.instructions && (

                                            <div className="history-clinical-row">

                                                <div className="history-info-icon instruction">
                                                    i
                                                </div>

                                                <div>

                                                    <span>
                                                        Instructions &
                                                        Precautions
                                                    </span>

                                                    <p>
                                                        {p.instructions}
                                                    </p>

                                                </div>

                                            </div>

                                        )}


                                        {/* DENTIST */}

                                        <div className="history-dentist">

                                            <div className="history-dentist-avatar">
                                                Dr
                                            </div>

                                            <div>

                                                <span>
                                                    PRESCRIBED BY
                                                </span>

                                                <strong>
                                                    {p.dentist?.displayName ||
                                                        "Dentist"}
                                                </strong>

                                            </div>

                                        </div>

                                    </div>

                                </article>

                            ))}

                        </div>

                    </>

                ) : (

                    /* EMPTY STATE */

                    <div className="history-empty">

                        <div className="history-empty-icon">
                            Rx
                        </div>

                        <h3>
                            No Previous Prescriptions
                        </h3>

                        <p>
                            There are no prescription records
                            available for this patient.
                        </p>

                    </div>

                )}

            </div>


            {/* =========================
                MODAL FOOTER
            ========================== */}

            <div className="history-modal-footer">

                <span>
                    🔒 Confidential clinical information
                </span>

                <button
                    onClick={() => setHistoryPatient(null)}
                >
                    Close
                </button>

            </div>

        </div>
    </div>
)}


                


               


            </main>

        </div>
    );
}