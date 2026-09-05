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
                            Dr. {user?.fullName || "Dentist"}
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
                    <div className="history-modal-backdrop" onClick={() => setHistoryPatient(null)}>
                        <div className="history-modal" onClick={e => e.stopPropagation()}>
                            <div className="history-modal-head">
                                <div><span>PATIENT CLINICAL HISTORY</span><h2>{historyPatient.fullName}</h2><p>NIC: {historyPatient.idNumber}</p></div>
                                <button onClick={() => setHistoryPatient(null)}>×</button>
                            </div>
                            {historyLoading ? <p>Loading prescription history...</p> : history.length ? history.map(p => <article className="history-item" key={p.id}>
                                <div><strong>Prescription #{p.id}</strong><small>{String(p.prescribedAt || "").replace("T", " ")}</small></div>
                                <p><b>Diagnosis:</b> {p.diagnosis}</p><p><b>Medicines:</b> {p.medicines}</p>{p.instructions && <p><b>Instructions:</b> {p.instructions}</p>}
                            </article>) : <div className="empty-history"><h3>No previous prescriptions</h3><p>No prescription has been recorded for this patient yet.</p></div>}
                        </div>
                    </div>
                )}


                {/* =================================================
                    CLINICAL INFORMATION
                ================================================= */}

                <section className="clinical-info-grid">


                    <div className="clinical-info-card">

                        <div className="clinical-card-icon">
                            🦷
                        </div>

                        <div>

                            <span>
                                DENTIST WORKSPACE
                            </span>

                            <h3>
                                Patient Communication
                            </h3>

                            <p>
                                Send important appointment updates
                                directly to patients. Updates can
                                include treatment information,
                                appointment status and follow-up
                                instructions.
                            </p>

                        </div>

                    </div>


                    <div className="clinical-info-card">

                        <div className="clinical-card-icon">
                            🔒
                        </div>

                        <div>

                            <span>
                                CLINICAL PRIVACY
                            </span>

                            <h3>
                                Secure Patient Information
                            </h3>

                            <p>
                                Patient records and clinical information
                                are restricted to authorised healthcare
                                staff within the Sunrise Dental system.
                            </p>

                        </div>

                    </div>

                </section>



               


            </main>

        </div>
    );
}