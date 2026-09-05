import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "/StaffRecords.css";

export default function StaffRecords() {

    const nav = useNavigate();

    const [id, setId] = useState("");
    const [data, setData] = useState([]);
    const [updates, setUpdates] = useState([]);
    const [patient, setPatient] = useState(null);
    const [s, setS] = useState("");
    const [loading, setLoading] = useState(false);
    const [appointmentOptions, setAppointmentOptions] = useState([]);
    const [appointmentNumber, setAppointmentNumber] = useState("");
    const [dispensations, setDispensations] = useState([]);

    useEffect(() => {
        api.get("/staff/appointments")
            .then(r => setAppointmentOptions(r.data || []))
            .catch(() => setAppointmentOptions([]));
    }, []);

    const findByAppointment = async () => {
        if (!appointmentNumber) {
            setS("Please select an appointment number.");
            return;
        }
        setLoading(true); setS("");
        try {
            const r = await api.get(`/staff/appointments/by-number/${encodeURIComponent(appointmentNumber)}/patient`);
            setId(r.data?.idNumber || "");
            await find(null, r.data?.idNumber);
        } catch (e) {
            setPatient(null); setData([]); setUpdates([]); setDispensations([]);
            setS(e.response?.data?.message || "Unable to find the patient for this appointment.");
        } finally { setLoading(false); }
    };

    const downloadReceipt = async (paymentId) => {
        try {

            const r = await api.get(
                "/payments/" + paymentId + "/receipt",
                {
                    responseType: "blob"
                }
            );

            const url = URL.createObjectURL(r.data);

            const a = document.createElement("a");

            a.href = url;
            a.download = "Sunrise-Dental-Receipt.pdf";

            document.body.appendChild(a);
            a.click();

            a.remove();

            URL.revokeObjectURL(url);

        } catch (e) {

            setS("Unable to download the receipt.");

        }
    };


    const find = async (e, forcedId) => {

        e?.preventDefault();
        const searchId = (forcedId || id).trim();

        if (!searchId) {

            setS("Please enter the patient NIC or ID number.");

            return;
        }

        setLoading(true);
        setS("");

        try {

            const [
                patientResponse,
                financialResponse,
                updatesResponse,
                dispensationResponse
            ] = await Promise.all([
                api.get("/patients/" + encodeURIComponent(searchId)),
                api.get("/staff/patients/" + encodeURIComponent(searchId) + "/financials"),
                api.get("/patients/" + encodeURIComponent(searchId) + "/updates"),
                api.get("/staff/patients/" + encodeURIComponent(searchId) + "/dispensations")
            ]);


            setPatient(patientResponse.data);

            setData(financialResponse.data);

            setUpdates(updatesResponse.data);
            setDispensations(dispensationResponse.data || []);


            if (!financialResponse.data.length) {

                setS(
                    "Patient found, but no appointment records are available."
                );

            } else {

                setS("");

            }

        } catch (e) {

            setPatient(null);
            setData([]);
            setUpdates([]);
            setDispensations([]);

            setS(
                e.response?.data?.message ||
                "Patient record could not be loaded."
            );

        } finally {

            setLoading(false);

        }

    };


    const totalAppointments = data.length;

    const paidAppointments = data.filter(
        x => x.paymentStatus === "PAID"
    ).length;

    const pendingAppointments = data.filter(
        x => x.paymentStatus !== "PAID"
    ).length;

    const totalOutstanding = data.reduce(
        (sum, x) =>
            sum +
            Math.max(
                Number(x.totalAmount || 0) -
                Number(x.paidAmount || 0),
                0
            ),
        0
    );


    return (

        <div className="records-page">


            {/* =================================================
                HEADER
            ================================================= */}

            <header className="records-header">

                <div className="records-brand">

                    <div className="brand-tooth">
                        🦷
                    </div>

                    <div>

                        <h2>
                            SUNRISE DENTAL
                        </h2>

                        <span>
                            Reception Management Portal
                        </span>

                    </div>

                </div>


                <div className="header-right">

                    <div className="staff-online">

                        <span className="online-dot"></span>

                        Reception Staff

                    </div>


                    <button
                        className="header-dashboard"
                        onClick={() => nav("/dashboard")}
                    >
                        ← Dashboard
                    </button>

                </div>

            </header>



            {/* =================================================
                BODY
            ================================================= */}

            <div className="records-layout">


                {/* =================================================
                    SIDEBAR
                ================================================= */}

                <aside className="records-sidebar">

                    <div className="sidebar-title">
                        RECEPTION
                    </div>


                    <button
                        className="sidebar-item"
                        onClick={() => nav("/dashboard")}
                    >
                        <span>⌂</span>
                        Dashboard
                    </button>


                    <button
                        className="sidebar-item"
                        onClick={() => nav("/patients")}
                    >
                        <span>♙</span>
                        Patients
                    </button>


                    <button
                        className="sidebar-item"
                        onClick={() => nav("/staff/appointments")}
                    >
                        <span>▣</span>
                        Appointments
                    </button>


                    <button
                        className="sidebar-item active"
                    >
                        <span>▤</span>
                        Patient Records
                    </button>


                    <button
                        className="sidebar-item"
                        onClick={() => nav("/billing")}
                    >
                        <span>◈</span>
                        Billing & Payments
                    </button>


                    <button
                        className="sidebar-item"
                        onClick={() => nav("/updates")}
                    >
                        <span>◉</span>
                        Dentist Updates
                    </button>


                    <div className="sidebar-bottom">

                        <div className="clinic-status">

                            <span className="status-circle"></span>

                            <div>

                                <b>Clinic System</b>

                                <small>
                                    All services operational
                                </small>

                            </div>

                        </div>

                    </div>

                </aside>



                {/* =================================================
                    MAIN CONTENT
                ================================================= */}

                <main className="records-content">


                    {/* PAGE TITLE */}

                    <div className="page-heading">

                        <div>

                            <span className="page-label">
                                RECEPTION / PATIENT MANAGEMENT
                            </span>

                            <h1>
                                Patient Records
                            </h1>

                            <p>
                                Search and manage patient appointments,
                                payments and dentist updates.
                            </p>

                        </div>


                        <div className="heading-date">

                            <span>
                                TODAY
                            </span>

                            <strong>
                                {new Date().toLocaleDateString(
                                    "en-GB",
                                    {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric"
                                    }
                                )}
                            </strong>

                        </div>

                    </div>



                    {/* =================================================
                        SEARCH
                    ================================================= */}

                    <section className="search-card">

                        <div className="search-card-top">

                            <div className="search-icon">
                                ⌕
                            </div>

                            <div>

                                <h2>
                                    Find Patient
                                </h2>

                                <p>
                                    Search using the patient's NIC
                                    or registered patient ID.
                                </p>

                            </div>

                        </div>


                        <form
                            className="patient-search-form"
                            onSubmit={find}
                        >

                            <div className="search-input">

                                <span>
                                    ID
                                </span>

                                <input
                                    type="text"
                                    placeholder="Enter patient NIC / ID number"
                                    value={id}
                                    onChange={
                                        e =>
                                            setId(e.target.value)
                                    }
                                />

                            </div>


                            <button
                                type="submit"
                                disabled={loading}
                            >

                                {loading
                                    ? "Searching..."
                                    : "Search Patient"
                                }

                            </button>

                        </form>


                        <div className="patient-search-form" style={{marginTop:12}}>
                            <div className="search-input">
                                <span>APPT</span>
                                <select value={appointmentNumber} onChange={e => setAppointmentNumber(e.target.value)}>
                                    <option value="">Select appointment number</option>
                                    {appointmentOptions.map(a => <option key={a.id} value={a.appointmentNumber}>{a.appointmentNumber} · {a.patient?.fullName || "Patient"}</option>)}
                                </select>
                            </div>
                            <button type="button" onClick={findByAppointment} disabled={loading}>Find by Appointment</button>
                        </div>

                        {s && (

                            <div
                                className={
                                    "search-message " +
                                    (
                                        s.toLowerCase().includes(
                                            "could"
                                        ) ||
                                        s.toLowerCase().includes(
                                            "unable"
                                        )
                                            ? "error"
                                            : ""
                                    )
                                }
                            >

                                <span>
                                    {s.toLowerCase().includes(
                                        "could"
                                    )
                                        ? "!"
                                        : "✓"
                                    }
                                </span>

                                {s}

                            </div>

                        )}

                    </section>



                    {/* =================================================
                        PATIENT FOUND
                    ================================================= */}

                    {patient && (

                        <>


                            {/* PATIENT PROFILE */}

                            <section className="patient-profile">

                                <div className="profile-main">

                                    <div className="patient-avatar">

                                        {patient.fullName
                                            ?.charAt(0)
                                            ?.toUpperCase() || "P"
                                        }

                                    </div>


                                    <div>

                                        <span className="profile-label">
                                            PATIENT PROFILE
                                        </span>

                                        <h2>
                                            {patient.fullName}
                                        </h2>

                                        <p>
                                            Patient ID:{" "}
                                            <strong>
                                                {patient.idNumber}
                                            </strong>
                                        </p>

                                    </div>

                                </div>


                                <div className="profile-details">

                                    <div>

                                        <span>
                                            PHONE
                                        </span>

                                        <strong>
                                            {patient.contactNumber ||
                                                "Not provided"}
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            EMAIL
                                        </span>

                                        <strong>
                                            {patient.email ||
                                                "Not provided"}
                                        </strong>

                                    </div>

                                </div>

                            </section>



                            {/* =================================================
                                STATISTICS
                            ================================================= */}

                            <div className="stats-grid">


                                <div className="stat-card">

                                    <div className="stat-icon blue">
                                        ▣
                                    </div>

                                    <div>

                                        <span>
                                            APPOINTMENTS
                                        </span>

                                        <strong>
                                            {totalAppointments}
                                        </strong>

                                        <small>
                                            Total records
                                        </small>

                                    </div>

                                </div>


                                <div className="stat-card">

                                    <div className="stat-icon green">
                                        ✓
                                    </div>

                                    <div>

                                        <span>
                                            PAID
                                        </span>

                                        <strong>
                                            {paidAppointments}
                                        </strong>

                                        <small>
                                            Completed payments
                                        </small>

                                    </div>

                                </div>


                                <div className="stat-card">

                                    <div className="stat-icon orange">
                                        !
                                    </div>

                                    <div>

                                        <span>
                                            PENDING
                                        </span>

                                        <strong>
                                            {pendingAppointments}
                                        </strong>

                                        <small>
                                            Payments required
                                        </small>

                                    </div>

                                </div>


                                <div className="stat-card">

                                    <div className="stat-icon purple">
                                        Rs
                                    </div>

                                    <div>

                                        <span>
                                            OUTSTANDING
                                        </span>

                                        <strong>
                                            Rs.{" "}
                                            {totalOutstanding.toLocaleString(
                                                undefined,
                                                {
                                                    minimumFractionDigits: 2
                                                }
                                            )}
                                        </strong>

                                        <small>
                                            Balance due
                                        </small>

                                    </div>

                                </div>


                            </div>



                            {/* =================================================
                                APPOINTMENTS
                            ================================================= */}

                            <section className="records-card">

                                <div className="records-card-header">

                                    <div>

                                        <span>
                                            PATIENT HISTORY
                                        </span>

                                        <h2>
                                            Appointments & Payments
                                        </h2>

                                        <p>
                                            Review treatment history
                                            and payment status.
                                        </p>

                                    </div>


                                    <span className="record-count">
                                        {data.length} Records
                                    </span>

                                </div>


                                {data.length ? (

                                    <div className="appointment-table">

                                        <div className="table-header">

                                            <span>
                                                APPOINTMENT
                                            </span>

                                            <span>
                                                TREATMENT
                                            </span>

                                            <span>
                                                DENTIST
                                            </span>

                                            <span>
                                                AMOUNT
                                            </span>

                                            <span>
                                                STATUS
                                            </span>

                                            <span>
                                                ACTION
                                            </span>

                                        </div>


                                        {data.map(x => (

                                            <div
                                                className="table-row"
                                                key={x.appointmentId}
                                            >

                                                <div>

                                                    <strong>
                                                        {x.appointmentNumber}
                                                    </strong>

                                                    <small>
                                                        {String(
                                                            x.appointmentDateTime ||
                                                            ""
                                                        ).replace(
                                                            "T",
                                                            " "
                                                        )}
                                                    </small>

                                                </div>


                                                <div>

                                                    <strong>
                                                        {x.treatmentName}
                                                    </strong>

                                                </div>


                                                <div>

                                                    <strong>
                                                        {x.dentistName}
                                                    </strong>

                                                </div>


                                                <div>

                                                    <strong className="amount">
                                                        Rs.{" "}
                                                        {Number(
                                                            x.totalAmount
                                                        ).toLocaleString(
                                                            undefined,
                                                            {
                                                                minimumFractionDigits:
                                                                    2
                                                            }
                                                        )}
                                                    </strong>

                                                    <small>
                                                        Paid: Rs.{" "}
                                                        {Number(
                                                            x.paidAmount
                                                        ).toLocaleString(
                                                            undefined,
                                                            {
                                                                minimumFractionDigits:
                                                                    2
                                                            }
                                                        )}
                                                    </small>

                                                </div>


                                                <div>

                                                    <span
                                                        className={
                                                            "status-badge " +
                                                            (
                                                                x.paymentStatus ===
                                                                "PAID"
                                                                    ? "paid"
                                                                    : "pending"
                                                            )
                                                        }
                                                    >

                                                        <i></i>

                                                        {x.paymentStatus ===
                                                        "PAID"
                                                            ? "Paid"
                                                            : "Payment Pending"
                                                        }

                                                    </span>

                                                </div>


                                                <div>

                                                    {x.paymentStatus !==
                                                    "PAID" ? (

                                                        <button
                                                            className="collect-btn"
                                                            onClick={() =>
                                                                nav(
                                                                    "/staff/payment/" +
                                                                    x.appointmentId
                                                                )
                                                            }
                                                        >
                                                            Collect Payment
                                                        </button>

                                                    ) : (

                                                        <div className="paid-actions">

                                                            <span>
                                                                {x.paymentMethod ||
                                                                    "Paid"}
                                                            </span>


                                                            {x.paymentId && (

                                                                <button
                                                                    className="receipt-btn"
                                                                    onClick={() =>
                                                                        downloadReceipt(
                                                                            x.paymentId
                                                                        )
                                                                    }
                                                                >
                                                                    Receipt
                                                                </button>

                                                            )}

                                                        </div>

                                                    )}

                                                </div>

                                            </div>

                                        ))}

                                    </div>

                                ) : (

                                    <div className="empty-state">

                                        <div>
                                            ▤
                                        </div>

                                        <h3>
                                            No appointments found
                                        </h3>

                                        <p>
                                            There are no appointment
                                            records associated with
                                            this patient.
                                        </p>

                                    </div>

                                )}

                            </section>



                            {/* =================================================
                                MEDICINE DISPENSATION HISTORY
                            ================================================= */}

                            <section className="records-card">
                                <div className="records-card-header">
                                    <div>
                                        <span>PHARMACY / CLINICAL RECORD</span>
                                        <h2>Medicines Given to Patient</h2>
                                        <p>View medicines dispensed by reception staff together with the related prescription and appointment.</p>
                                    </div>
                                    <span className="record-count">{dispensations.length} Records</span>
                                </div>
                                {dispensations.length ? <div className="updates-timeline">
                                    {dispensations.map(m => <article className="timeline-item" key={m.id}>
                                        <div className="timeline-marker"><span>Rx</span></div>
                                        <div className="update-content">
                                            <div className="update-header"><div><span>MEDICINE</span><strong>{m.medicineName}</strong></div><time>{String(m.dispensedAt || "").replace("T", " ")}</time></div>
                                            <div className="update-message"><b>Quantity:</b> {m.quantity} · <b>Prescription:</b> #{m.prescription?.id || "N/A"} · <b>Appointment:</b> {m.prescription?.appointment?.appointmentNumber || "N/A"}<br/>
                                                <b>Diagnosis:</b> {m.prescription?.diagnosis || "Not recorded"}{m.batchNumber ? <><br/><b>Batch:</b> {m.batchNumber}</> : null}
                                            </div>
                                        </div>
                                    </article>)}
                                </div> : <div className="empty-state"><div>Rx</div><h3>No medicine records</h3><p>No medicines have been recorded as dispensed for this patient.</p></div>}
                            </section>


                            {/* =================================================
                                DENTIST UPDATES
                            ================================================= */}

                            <section className="records-card">

                                <div className="records-card-header">

                                    <div>

                                        <span>
                                            CLINICAL COMMUNICATION
                                        </span>

                                        <h2>
                                            Dentist Updates
                                        </h2>

                                        <p>
                                            Updates and messages recorded
                                            by the treating dentist.
                                        </p>

                                    </div>


                                    <span className="record-count">
                                        {updates.length} Updates
                                    </span>

                                </div>


                                {updates.length ? (

                                    <div className="updates-timeline">

                                        {updates.map((x, index) => (

                                            <article
                                                className="timeline-item"
                                                key={x.id}
                                            >

                                                <div className="timeline-marker">

                                                    <span>
                                                        ✓
                                                    </span>

                                                    {index !==
                                                    updates.length - 1 && (
                                                        <i></i>
                                                    )}

                                                </div>


                                                <div className="update-content">

                                                    <div className="update-header">

                                                        <div>

                                                            <span>
                                                                APPOINTMENT
                                                            </span>

                                                            <strong>
                                                                {
                                                                    x.appointment
                                                                        ?.appointmentNumber ||
                                                                    "Appointment"
                                                                }
                                                            </strong>

                                                        </div>


                                                        <time>
                                                            {x.createdAt}
                                                        </time>

                                                    </div>


                                                    <div className="update-message">

                                                        {x.message}

                                                    </div>


                                                    <div className="update-footer">

                                                        <span
                                                            className={
                                                                x.emailSent
                                                                    ? "email-sent"
                                                                    : "system-only"
                                                            }
                                                        >

                                                            {x.emailSent
                                                                ? "✓ Email sent to patient"
                                                                : "● System update only"
                                                            }

                                                        </span>

                                                    </div>

                                                </div>

                                            </article>

                                        ))}

                                    </div>

                                ) : (

                                    <div className="empty-state">

                                        <div>
                                            ◉
                                        </div>

                                        <h3>
                                            No dentist updates
                                        </h3>

                                        <p>
                                            No clinical updates have
                                            been recorded for this patient.
                                        </p>

                                    </div>

                                )}

                            </section>



                            {/* SECURITY NOTICE */}

                            <div className="security-notice">

                                <span>
                                    🔒
                                </span>

                                <div>

                                    <strong>
                                        Patient information is protected
                                    </strong>

                                    <p>
                                        This information is available only
                                        to authorised Sunrise Dental staff.
                                        Do not share patient information
                                        outside the clinic.
                                    </p>

                                </div>

                            </div>

                        </>

                    )}

                </main>

            </div>

        </div>

    );
}