import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./Prescriptions.css";

export default function Prescriptions() {
    const { user } = useAuth();

    const role = user?.role;

    const patient = role === "PATIENT";
    const dentist = role === "DENTIST";
    const staff = role === "RECEPTIONIST" || role === "ADMIN";

    const [items, setItems] = useState([]);
    const [apps, setApps] = useState([]);
    const [search, setSearch] = useState("");
    const [msg, setMsg] = useState("");
    const [msgType, setMsgType] = useState("");
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        appointmentId: null,
        diagnosis: "",
        medicines: "",
        instructions: ""
    });

    const [disp, setDisp] = useState({});
    const [dispHistory, setDispHistory] = useState({});
    const [dispensingId, setDispensingId] = useState(null);

    /* =========================
       HELPERS
    ========================= */

    const showMessage = (message, type = "info") => {
        setMsg(message);
        setMsgType(type);

        setTimeout(() => {
            setMsg("");
        }, 4500);
    };

    const formatDateTime = (value) => {
        if (!value) return "Date not available";

        try {
            return new Date(value).toLocaleString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            });
        } catch {
            return value.replace("T", " ");
        }
    };

    const initials = (name = "Patient") => {
        return name
            .split(" ")
            .slice(0, 2)
            .map(word => word.charAt(0))
            .join("")
            .toUpperCase();
    };

    /* =========================
       LOAD DATA
    ========================= */

    const load = async () => {
        setLoading(true);

        try {
            if (patient) {
                const r = await api.get("/me/prescriptions");
                setItems(r.data || []);
            } else if (dentist) {
                const r = await api.get("/dentist/appointments");
                setApps(r.data || []);
            }
        } catch (e) {
            showMessage(
                e.response?.data?.message ||
                "Unable to load prescription information.",
                "error"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, [role]);

    /* =========================
       CREATE PRESCRIPTION
    ========================= */

    const prescribe = async (id) => {
        if (!form.diagnosis.trim()) {
            showMessage("Please enter the clinical diagnosis.", "error");
            return;
        }

        if (!form.medicines.trim()) {
            showMessage("Please enter the prescribed medicines.", "error");
            return;
        }

        setSaving(true);

        try {
            await api.post(
                `/dentist/appointments/${id}/prescription`,
                {
                    diagnosis: form.diagnosis,
                    medicines: form.medicines,
                    instructions: form.instructions
                }
            );

            showMessage(
                "Prescription saved successfully.",
                "success"
            );

            setForm({
                appointmentId: null,
                diagnosis: "",
                medicines: "",
                instructions: ""
            });

            await load();

        } catch (e) {
            showMessage(
                e.response?.data?.message ||
                "Unable to save prescription.",
                "error"
            );
        } finally {
            setSaving(false);
        }
    };

    /* =========================
       STAFF SEARCH
    ========================= */

    const staffSearch = async () => {
        if (!search.trim()) {
            showMessage(
                "Please enter the patient's NIC or registered patient ID.",
                "error"
            );
            return;
        }

        setLoading(true);

        try {
            const r = await api.get(
                `/staff/patients/${encodeURIComponent(
                    search.trim()
                )}/prescriptions`
            );

            const rows = r.data || [];

            setItems(rows);

            const historyEntries = await Promise.all(
                rows.map(async (p) => {
                    try {
                        const d = await api.get(
                            `/staff/prescriptions/${p.id}/dispensations`
                        );

                        return [p.id, d.data || []];

                    } catch {
                        return [p.id, []];
                    }
                })
            );

            setDispHistory(
                Object.fromEntries(historyEntries)
            );

            if (rows.length) {
                showMessage(
                    `${rows.length} prescription${rows.length > 1 ? "s" : ""} found.`,
                    "success"
                );
            } else {
                showMessage(
                    "No prescriptions found for this patient.",
                    "info"
                );
            }

        } catch (e) {
            setItems([]);

            showMessage(
                e.response?.data?.message ||
                "Patient not found. Please check the NIC or patient ID.",
                "error"
            );
        } finally {
            setLoading(false);
        }
    };

    /* =========================
       DISPENSE MEDICINE
    ========================= */

    const dispense = async (prescription) => {
        const x = disp[prescription.id];

        if (!x?.medicineName?.trim()) {
            showMessage("Enter the medicine name.", "error");
            return;
        }

        if (!x?.quantity?.trim()) {
            showMessage("Enter the quantity provided.", "error");
            return;
        }

        const existing = (
            dispHistory[prescription.id] || []
        ).some(
            m =>
                String(m.medicineName || "")
                    .trim()
                    .toLowerCase() ===
                String(x.medicineName)
                    .trim()
                    .toLowerCase()
        );

        if (existing) {
            showMessage(
                "This medicine has already been recorded for this prescription.",
                "error"
            );
            return;
        }

        setDispensingId(prescription.id);

        try {
            await api.post(
                `/staff/prescriptions/${prescription.id}/dispense`,
                x
            );

            showMessage(
                "Medicine dispensation recorded successfully.",
                "success"
            );

            setDisp(prev => ({
                ...prev,
                [prescription.id]: {}
            }));

            const refreshed = await api.get(
                `/staff/prescriptions/${prescription.id}/dispensations`
            );

            setDispHistory(prev => ({
                ...prev,
                [prescription.id]: refreshed.data || []
            }));

        } catch (e) {
            showMessage(
                e.response?.data?.message ||
                "Unable to record medicine dispensation.",
                "error"
            );
        } finally {
            setDispensingId(null);
        }
    };

    /* =========================
       UPDATE DISPENSING FIELD
    ========================= */

    const updateDisp = (id, field, value) => {
        setDisp(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                [field]: value
            }
        }));
    };

    /* =========================
       RENDER
    ========================= */

    return (
        <div className="prescription-page">

            {/* HEADER */}

            <header className="rx-header">

                <div className="rx-brand">

                    <div className="rx-brand-icon">
                        +
                    </div>

                    <div>
                        <strong>Sunrise Dental</strong>
                        <span>Clinical Management System</span>
                    </div>

                </div>

                <div className="rx-header-right">

                    <div className="rx-user">

                        <div className="rx-user-avatar">
                            {initials(
                                user?.fullName ||
                                user?.displayName ||
                                "User"
                            )}
                        </div>

                        <div>
                            <strong>
                                {user?.fullName ||
                                    user?.displayName ||
                                    "User"}
                            </strong>

                            <span>
                                {role || "USER"}
                            </span>
                        </div>

                    </div>

                    <a
                        href="/dashboard"
                        className="rx-dashboard-btn"
                    >
                        ← Dashboard
                    </a>

                </div>

            </header>


            <main className="rx-main">

                {/* PAGE HERO */}

                <section className="rx-hero">

                    <div>

                        <div className="rx-breadcrumb">
                            CLINICAL CARE
                            <span>/</span>
                            PRESCRIPTIONS
                        </div>

                        <h1>
                            {patient
                                ? "My Prescriptions"
                                : dentist
                                    ? "Prescription Workspace"
                                    : "Prescription & Medicine Desk"
                            }
                        </h1>

                        <p>
                            {patient
                                ? "View prescriptions issued by your dental care team and follow the treatment instructions provided."
                                : dentist
                                    ? "Create and securely manage prescriptions for your scheduled patients."
                                    : "Search patient prescriptions, review clinical instructions and record medicines provided."
                            }
                        </p>

                    </div>

                    <div className="rx-hero-icon">
                        <div className="rx-cross">
                            +
                        </div>
                    </div>

                </section>


                {/* MESSAGE */}

                {msg && (
                    <div
                        className={`rx-message ${msgType}`}
                        role="alert"
                    >
                        <span className="message-icon">
                            {msgType === "success"
                                ? "✓"
                                : msgType === "error"
                                    ? "!"
                                    : "i"}
                        </span>

                        <span>{msg}</span>

                        <button
                            onClick={() => setMsg("")}
                            aria-label="Close message"
                        >
                            ×
                        </button>

                    </div>
                )}


                {/* LOADING */}

                {loading && (
                    <div className="rx-loading">
                        <div className="rx-spinner"></div>
                        <span>Loading clinical records...</span>
                    </div>
                )}


                {/* ============================================
                    DENTIST WORKSPACE
                ============================================ */}

                {dentist && !loading && (

                    <section className="rx-section">

                        <div className="rx-section-heading">

                            <div>

                                <span className="rx-label">
                                    DENTIST WORKSPACE
                                </span>

                                <h2>
                                    Scheduled Patient Appointments
                                </h2>

                                <p>
                                    Select an appointment below to create a prescription.
                                </p>

                            </div>

                            <div className="rx-count">
                                <strong>{apps.length}</strong>
                                <span>Appointments</span>
                            </div>

                        </div>


                        {apps.length ? (

                            <div className="appointment-grid">

                                {apps.map(a => (

                                    <article
                                        className="appointment-card"
                                        key={a.id}
                                    >

                                        {/* APPOINTMENT TOP */}

                                        <div className="appointment-top">

                                            <div className="appointment-number">
                                                <span>APPOINTMENT</span>
                                                <strong>
                                                    {a.appointmentNumber ||
                                                        `#${a.id}`}
                                                </strong>
                                            </div>

                                            <span className="rx-status">
                                                {a.status || "SCHEDULED"}
                                            </span>

                                        </div>


                                        {/* PATIENT */}

                                        <div className="patient-summary">

                                            <div className="patient-avatar">
                                                {initials(
                                                    a.patient?.fullName
                                                )}
                                            </div>

                                            <div>
                                                <span>Patient</span>

                                                <h3>
                                                    {a.patient?.fullName ||
                                                        "Patient"}
                                                </h3>

                                                <small>
                                                    Patient ID:{" "}
                                                    {a.patient?.idNumber ||
                                                        "Protected"}
                                                </small>
                                            </div>

                                        </div>


                                        {/* APPOINTMENT DETAILS */}

                                        <div className="appointment-details">

                                            <div>
                                                <span>Date & Time</span>
                                                <strong>
                                                    {formatDateTime(
                                                        a.appointmentDateTime
                                                    )}
                                                </strong>
                                            </div>

                                            <div>
                                                <span>Treatment</span>
                                                <strong>
                                                    {a.treatment?.name ||
                                                        "Dental Treatment"}
                                                </strong>
                                            </div>

                                        </div>


                                        {/* PRESCRIPTION FORM */}

                                        <div className="clinical-form">

                                            <div className="form-heading">

                                                <div className="form-icon">
                                                    Rx
                                                </div>

                                                <div>
                                                    <h3>
                                                        New Prescription
                                                    </h3>

                                                    <p>
                                                        Enter clinical treatment details
                                                    </p>
                                                </div>

                                            </div>


                                            <label>
                                                <span>
                                                    Diagnosis
                                                    <b>*</b>
                                                </span>

                                                <input
                                                    type="text"
                                                    placeholder="Enter clinical diagnosis"
                                                    value={
                                                        form.appointmentId === a.id
                                                            ? form.diagnosis
                                                            : ""
                                                    }
                                                    onChange={e =>
                                                        setForm({
                                                            ...form,
                                                            appointmentId: a.id,
                                                            diagnosis:
                                                                e.target.value
                                                        })
                                                    }
                                                />
                                            </label>


                                            <label>
                                                <span>
                                                    Medicines
                                                    <b>*</b>
                                                </span>

                                                <textarea
                                                    rows="4"
                                                    placeholder="Example: Amoxicillin 500mg — 1 capsule 3 times daily"
                                                    value={
                                                        form.appointmentId === a.id
                                                            ? form.medicines
                                                            : ""
                                                    }
                                                    onChange={e =>
                                                        setForm({
                                                            ...form,
                                                            appointmentId: a.id,
                                                            medicines:
                                                                e.target.value
                                                        })
                                                    }
                                                />
                                            </label>


                                            <label>
                                                <span>
                                                    Instructions & Precautions
                                                </span>

                                                <textarea
                                                    rows="3"
                                                    placeholder="Enter dosage instructions, precautions or follow-up advice"
                                                    value={
                                                        form.appointmentId === a.id
                                                            ? form.instructions
                                                            : ""
                                                    }
                                                    onChange={e =>
                                                        setForm({
                                                            ...form,
                                                            appointmentId: a.id,
                                                            instructions:
                                                                e.target.value
                                                        })
                                                    }
                                                />
                                            </label>


                                            <button
                                                className="rx-primary-btn"
                                                disabled={
                                                    saving &&
                                                    form.appointmentId === a.id
                                                }
                                                onClick={() =>
                                                    prescribe(a.id)
                                                }
                                            >
                                                {saving &&
                                                form.appointmentId === a.id
                                                    ? "Saving Prescription..."
                                                    : "Save Prescription"}
                                            </button>

                                        </div>

                                    </article>

                                ))}

                            </div>

                        ) : (

                            <div className="rx-empty">

                                <div className="empty-icon">
                                    ✓
                                </div>

                                <h3>
                                    No Appointments Available
                                </h3>

                                <p>
                                    Appointments assigned to you will appear here.
                                </p>

                            </div>

                        )}

                    </section>

                )}


                {/* ============================================
                    STAFF SEARCH
                ============================================ */}

                {staff && (

                    <section className="rx-section">

                        <div className="search-panel">

                            <div className="search-panel-icon">
                                ⌕
                            </div>

                            <div className="search-content">

                                <span className="rx-label">
                                    RECEPTION DESK
                                </span>

                                <h2>
                                    Find Patient Prescriptions
                                </h2>

                                <p>
                                    Search using the patient's NIC or registered patient ID.
                                </p>

                                <div className="search-box">

                                    <input
                                        type="text"
                                        placeholder="Enter patient NIC / Patient ID"
                                        value={search}
                                        onChange={e =>
                                            setSearch(e.target.value)
                                        }
                                        onKeyDown={e => {
                                            if (e.key === "Enter") {
                                                staffSearch();
                                            }
                                        }}
                                    />

                                    <button
                                        className="rx-primary-btn"
                                        onClick={staffSearch}
                                        disabled={loading}
                                    >
                                        {loading
                                            ? "Searching..."
                                            : "Search Patient"}
                                    </button>

                                </div>

                            </div>

                        </div>

                    </section>

                )}


                {/* ============================================
                    PATIENT / STAFF PRESCRIPTIONS
                ============================================ */}

                {(patient || staff) && !loading && (

                    <section className="rx-section">

                        <div className="rx-section-heading">

                            <div>

                                <span className="rx-label">
                                    CLINICAL RECORD
                                </span>

                                <h2>
                                    Prescription History
                                </h2>

                                <p>
                                    Review diagnosis, medicines and treatment instructions.
                                </p>

                            </div>

                            <div className="rx-count">
                                <strong>{items.length}</strong>
                                <span>Records</span>
                            </div>

                        </div>


                        {items.length ? (

                            <div className="patient-rx-grid">

                                {items.map(p => (

                                    <article
                                        className="patient-rx-card"
                                        key={p.id}
                                    >

                                        {/* CARD HEADER */}

                                        <div className="patient-rx-header">

                                            <div className="rx-id">
                                                <span>
                                                    PRESCRIPTION
                                                </span>

                                                <strong>
                                                    #{p.id}
                                                </strong>
                                            </div>

                                            <span className="rx-date">
                                                {formatDateTime(
                                                    p.prescribedAt
                                                )}
                                            </span>

                                        </div>


                                        {/* DENTIST / PATIENT */}

                                        <div className="rx-person">

                                            <div className="patient-avatar">
                                                {initials(
                                                    p.patient?.fullName
                                                )}
                                            </div>

                                            <div>

                                                <span>
                                                    {staff
                                                        ? "Patient"
                                                        : "Prescribed by"}
                                                </span>

                                                <h3>
                                                    {staff
                                                        ? p.patient?.fullName ||
                                                          "Patient"
                                                        : p.dentist?.displayName ||
                                                          "Dentist"}
                                                </h3>

                                            </div>

                                        </div>


                                        {/* CLINICAL INFORMATION */}

                                        <div className="clinical-record">

                                            <div className="record-row">

                                                <div className="record-icon">
                                                    D
                                                </div>

                                                <div>
                                                    <span>Diagnosis</span>

                                                    <p>
                                                        {p.diagnosis ||
                                                            "Not specified"}
                                                    </p>
                                                </div>

                                            </div>


                                            <div className="record-row">

                                                <div className="record-icon">
                                                    M
                                                </div>

                                                <div>
                                                    <span>Medicines</span>

                                                    <p>
                                                        {p.medicines ||
                                                            "No medicines specified"}
                                                    </p>
                                                </div>

                                            </div>


                                            <div className="record-row">

                                                <div className="record-icon">
                                                    i
                                                </div>

                                                <div>
                                                    <span>
                                                        Instructions & Precautions
                                                    </span>

                                                    <p>
                                                        {p.instructions ||
                                                            "Follow dentist guidance."}
                                                    </p>
                                                </div>

                                            </div>

                                        </div>


                                        {/* STAFF DISPENSING */}

                                        {staff && (

                                            <div className="dispensing-panel">

                                                <div className="dispensing-header">

                                                    <div className="dispensing-icon">
                                                        Rx
                                                    </div>

                                                    <div>
                                                        <span>
                                                            PHARMACY / RECEPTION
                                                        </span>

                                                        <h3>
                                                            Medicine Dispensing
                                                        </h3>
                                                    </div>

                                                </div>


                                                <p className="dispensing-description">
                                                    Record the medicine physically supplied to the patient.
                                                </p>


                                                {/* HISTORY */}

                                                {(dispHistory[p.id] || [])
                                                    .length > 0 && (

                                                    <div className="dispensed-history">

                                                        <div className="history-title">
                                                            Previously Provided
                                                        </div>

                                                        {(
                                                            dispHistory[p.id] || []
                                                        ).map(m => (

                                                            <div
                                                                className="history-item"
                                                                key={m.id}
                                                            >

                                                                <div>
                                                                    <strong>
                                                                        {m.medicineName}
                                                                    </strong>

                                                                    <span>
                                                                        Quantity:{" "}
                                                                        {m.quantity}
                                                                    </span>
                                                                </div>

                                                                <div>
                                                                    {m.batchNumber && (
                                                                        <span>
                                                                            Batch:{" "}
                                                                            {m.batchNumber}
                                                                        </span>
                                                                    )}

                                                                    <small>
                                                                        {formatDateTime(
                                                                            m.dispensedAt
                                                                        )}
                                                                    </small>
                                                                </div>

                                                            </div>

                                                        ))}

                                                    </div>

                                                )}


                                                {/* DISPENSING FORM */}

                                                <div className="dispensing-form">

                                                    <input
                                                        type="text"
                                                        placeholder="Medicine name"
                                                        value={
                                                            disp[p.id]
                                                                ?.medicineName ||
                                                            ""
                                                        }
                                                        onChange={e =>
                                                            updateDisp(
                                                                p.id,
                                                                "medicineName",
                                                                e.target.value
                                                            )
                                                        }
                                                    />

                                                    <input
                                                        type="text"
                                                        placeholder="Quantity"
                                                        value={
                                                            disp[p.id]
                                                                ?.quantity ||
                                                            ""
                                                        }
                                                        onChange={e =>
                                                            updateDisp(
                                                                p.id,
                                                                "quantity",
                                                                e.target.value
                                                            )
                                                        }
                                                    />

                                                    <input
                                                        type="text"
                                                        placeholder="Batch number (optional)"
                                                        value={
                                                            disp[p.id]
                                                                ?.batchNumber ||
                                                            ""
                                                        }
                                                        onChange={e =>
                                                            updateDisp(
                                                                p.id,
                                                                "batchNumber",
                                                                e.target.value
                                                            )
                                                        }
                                                    />

                                                </div>


                                                <textarea
                                                    rows="2"
                                                    placeholder="Dispensing notes"
                                                    value={
                                                        disp[p.id]?.notes || ""
                                                    }
                                                    onChange={e =>
                                                        updateDisp(
                                                            p.id,
                                                            "notes",
                                                            e.target.value
                                                        )
                                                    }
                                                />


                                                <button
                                                    className="rx-primary-btn dispensing-btn"
                                                    disabled={
                                                        dispensingId === p.id
                                                    }
                                                    onClick={() =>
                                                        dispense(p)
                                                    }
                                                >
                                                    {dispensingId === p.id
                                                        ? "Recording..."
                                                        : "✓ Record Medicine Provided"}
                                                </button>

                                            </div>

                                        )}

                                    </article>

                                ))}

                            </div>

                        ) : (

                            <div className="rx-empty">

                                <div className="empty-icon">
                                    Rx
                                </div>

                                <h3>
                                    No Prescriptions Found
                                </h3>

                                <p>
                                    {staff
                                        ? "Search using a patient NIC or registered patient ID to view prescriptions."
                                        : "Prescriptions issued by your dentist will appear here."
                                    }
                                </p>

                            </div>

                        )}

                    </section>

                )}

            </main>

           

        </div>
    );
}