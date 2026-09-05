import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./Appointment.css";

const NIC_RE = /^(?:\d{12}|\d{9}[VvXx])$/;

export default function Appointment() {
    const { user } = useAuth();
    const nav = useNavigate();
    const staff = user?.role === "RECEPTIONIST" || user?.role === "ADMIN";

    const [f, setF] = useState({
        patientIdNumber: "",
        dentistId: "",
        treatmentId: "",
        appointmentDateTime: "",
        patientNote: ""
    });
    const [d, setD] = useState([]);
    const [t, setT] = useState([]);
    const [list, setList] = useState([]);
    const [s, setS] = useState("");
    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState(null);

    const minDateTime = () => {
        const dt = new Date(Date.now() + 15 * 60000);
        dt.setSeconds(0, 0);
        return new Date(dt.getTime() - dt.getTimezoneOffset() * 60000)
            .toISOString().slice(0, 16);
    };

    useEffect(() => {
        api.get("/dentists").then(x => setD(x.data || []))
            .catch(() => setS("Unable to load dentists."));
        api.get("/treatments").then(x => setT(x.data || []))
            .catch(() => setS("Unable to load treatments."));

        if (user?.role === "PATIENT") {
            api.get("/me/patient").then(x => {
                setProfile(x.data || null);
                setF(z => ({ ...z, patientIdNumber: x.data?.idNumber || "" }));
                if (!x.data) {
                    setS("Please create your patient profile before making an appointment.");
                }
            }).catch(e => setS(e.response?.data?.message || "Unable to check your patient profile."));
        }
    }, [user?.role]);

    useEffect(() => {
        if (user?.role === "PATIENT") {
            api.get("/me/appointments").then(x => setList(x.data || [])).catch(() => {});
        }
    }, [user?.role, loading]);

    const validateNic = value => {
        const v = value.trim();
        if (!NIC_RE.test(v)) {
            setS("Invalid NIC format. Use 12 digits (e.g. 200299108740) or 9 digits followed by V/X (e.g. 694479542V).");
            return false;
        }
        return true;
    };

    const book = async e => {
        e.preventDefault();
        setS("");

        if (!staff && !profile) {
            setS("Please create your profile before making an appointment.");
            return;
        }
        if (!validateNic(f.patientIdNumber)) return;
        if (!f.dentistId || !f.treatmentId || !f.appointmentDateTime) {
            setS("Please complete the dentist, treatment and appointment date/time fields.");
            return;
        }

        setLoading(true);
        try {
            const x = await api.post("/appointments", {
                ...f,
                patientIdNumber: f.patientIdNumber.trim().toUpperCase()
            });
            setList(z => [x.data, ...z]);
            nav((staff ? "/staff/payment/" : "/payment/") + x.data.id);
        } catch (e) {
            setS(e.response?.data?.message || "Booking failed. Please try another time.");
        } finally {
            setLoading(false);
        }
    };

    return <div className="app">
        <header><b>✦ APPOINTMENTS</b><a href="/dashboard">Dashboard</a></header>
        <main>
            <div className="panel">
                <h1>{staff ? "Schedule Patient Appointment" : "Book an Appointment"}</h1>
                <p>{staff
                    ? "Search the patient NIC, confirm the requested dentist and treatment, then reserve a clinic slot."
                    : "Choose your preferred dentist, treatment and appointment slot. Your profile must exist before an appointment can be booked."}</p>

                {!staff && !profile && <div className="feature-message error">
                    <strong>Profile required.</strong> Please create your patient profile before booking an appointment. <Link to="/patients">Create / Complete Profile</Link>
                </div>}

                <form className="formgrid" onSubmit={book}>
                    <label>Patient NIC<input
                        required
                        disabled={user?.role === "PATIENT"}
                        value={f.patientIdNumber}
                        onChange={e => setF({ ...f, patientIdNumber: e.target.value })}
                        onBlur={() => f.patientIdNumber && validateNic(f.patientIdNumber)}
                        placeholder="200299108740 or 694479542V"
                    /></label>
                    <label> Dentist<select required value={f.dentistId} onChange={e => setF({ ...f, dentistId: e.target.value })}>
                        <option value="">Select dentist</option>{d.map(x => <option value={x.id} key={x.id}>{x.fullName} · {x.specialization}</option>)}
                    </select></label>
                    <label>Treatment<select required value={f.treatmentId} onChange={e => setF({ ...f, treatmentId: e.target.value })}>
                        <option value="">Select treatment</option>{t.map(x => <option value={x.id} key={x.id}>{x.name} · Rs. {Number(x.defaultPrice).toLocaleString()}</option>)}
                    </select></label>
                    <label>Date & Time<input required type="datetime-local" min={minDateTime()} value={f.appointmentDateTime} onChange={e => setF({ ...f, appointmentDateTime: e.target.value })}/></label>
                    <label>Additional note<textarea placeholder="Add any relevant information for the clinic..." value={f.patientNote} onChange={e => setF({ ...f, patientNote: e.target.value })}/></label>
                    <button disabled={loading || (!staff && !profile)}>{loading ? "Checking availability..." : "Book Appointment & Continue to Payment"}</button>
                </form>
                {s && <p>{s}</p>}

                {user?.role === "PATIENT" && (
    <section className="recent-appointments">

        {/* SECTION HEADER */}
        <div className="appointments-section-header">

            <div className="appointments-title-area">
                <div className="appointments-icon">
                    <i className="fa-regular fa-calendar-check"></i>
                </div>

                <div>
                    <span className="appointments-eyebrow">
                        YOUR APPOINTMENTS
                    </span>

                    <h2>My Recent Appointments</h2>

                    <p>
                        Keep track of your upcoming visits and appointment history.
                    </p>
                </div>
            </div>

            <div className="appointment-total-box">
                <span className="total-number">{list.length}</span>
                <span className="total-label">TOTAL VISITS</span>
            </div>

        </div>


        {/* EMPTY STATE */}
        {list.length === 0 ? (

            <div className="appointment-empty">

                <div className="empty-calendar">
                    <i className="fa-regular fa-calendar-days"></i>
                </div>

                <h3>No appointments yet</h3>

                <p>
                    You don't have any appointments at the moment.
                    Book your first visit and it will appear here.
                </p>

                <button
                    type="button"
                    className="empty-book-btn"
                    onClick={() =>
                        window.scrollTo({
                            top: 0,
                            behavior: "smooth"
                        })
                    }
                >
                    <i className="fa-solid fa-calendar-plus"></i>
                    Book an Appointment
                </button>

            </div>

        ) : (

            <div className="appointment-list">

                {list.slice(0, 5).map(a => {

                    const appointmentDate =
                        new Date(a.appointmentDateTime);

                    const isUpcoming =
                        appointmentDate >= new Date();

                    const isPaid =
                        a.paid === true ||
                        a.paymentStatus === "PAID" ||
                        a.status === "PAID";

                    const appointmentNumber =
                        a.appointmentNumber ||
                        `APT-${a.id}`;

                    const dentist =
                        a.dentistName ||
                        a.dentist?.fullName ||
                        a.dentist?.name ||
                        "Assigned Dentist";

                    const treatment =
                        a.treatmentName ||
                        a.treatment?.name ||
                        "Dental Consultation";

                    return (

                        <article
                            className={`modern-appointment-card ${
                                isUpcoming
                                    ? "appointment-upcoming"
                                    : "appointment-completed"
                            }`}
                            key={a.id}
                        >

                            {/* DATE */}
                            <div className="appointment-date-block">

                                <span className="date-month">
                                    {appointmentDate.toLocaleDateString(
                                        "en-US",
                                        { month: "short" }
                                    )}
                                </span>

                                <strong className="date-day">
                                    {appointmentDate.toLocaleDateString(
                                        "en-US",
                                        { day: "2-digit" }
                                    )}
                                </strong>

                                <span className="date-weekday">
                                    {appointmentDate.toLocaleDateString(
                                        "en-US",
                                        { weekday: "short" }
                                    )}
                                </span>

                            </div>


                            {/* APPOINTMENT BODY */}
                            <div className="modern-appointment-body">

                                {/* TOP */}
                                <div className="modern-appointment-top">

                                    <div className="appointment-main-info">

                                        <div className="appointment-number">
                                            <i className="fa-regular fa-calendar-check"></i>
                                            {appointmentNumber}
                                        </div>

                                        <h3>{treatment}</h3>

                                        <div className="dentist-line">
                                            <span className="dentist-avatar">
                                                <i className="fa-solid fa-user-doctor"></i>
                                            </span>

                                            <span>
                                                <small>YOUR DENTIST</small>
                                                <strong>{dentist}</strong>
                                            </span>
                                        </div>

                                    </div>


                                    {/* STATUS */}
                                    <div
                                        className={`appointment-status ${
                                            isUpcoming
                                                ? "status-upcoming"
                                                : "status-completed"
                                        }`}
                                    >
                                        <span className="status-dot"></span>

                                        {isUpcoming
                                            ? "Upcoming"
                                            : "Completed"}
                                    </div>

                                </div>


                                {/* DETAILS */}
                                <div className="modern-appointment-details">

                                    <div className="modern-detail">

                                        <div className="detail-icon">
                                            <i className="fa-regular fa-clock"></i>
                                        </div>

                                        <div>
                                            <span>TIME</span>
                                            <strong>
                                                {appointmentDate.toLocaleTimeString(
                                                    "en-US",
                                                    {
                                                        hour: "2-digit",
                                                        minute: "2-digit"
                                                    }
                                                )}
                                            </strong>
                                        </div>

                                    </div>


                                    <div className="modern-detail">

                                        <div className="detail-icon">
                                            <i className="fa-solid fa-tooth"></i>
                                        </div>

                                        <div>
                                            <span>TREATMENT</span>
                                            <strong>{treatment}</strong>
                                        </div>

                                    </div>


                                    <div className="modern-detail">

                                        <div className="detail-icon">
                                            <i className="fa-regular fa-credit-card"></i>
                                        </div>

                                        <div>
                                            <span>PAYMENT</span>

                                            <strong
                                                className={
                                                    isPaid
                                                        ? "payment-paid"
                                                        : "payment-pending"
                                                }
                                            >
                                                {isPaid
                                                    ? "Paid"
                                                    : "Pending"}
                                            </strong>
                                        </div>

                                    </div>

                                </div>


                                {/* BOTTOM */}
                                <div className="modern-appointment-footer">

                                    <div className="payment-message">

                                        <div
                                            className={`payment-status-icon ${
                                                isPaid
                                                    ? "payment-success"
                                                    : "payment-warning"
                                            }`}
                                        >
                                            <i
                                                className={
                                                    isPaid
                                                        ? "fa-solid fa-check"
                                                        : "fa-solid fa-clock"
                                                }
                                            ></i>
                                        </div>

                                        <div>
                                            <strong>
                                                {isPaid
                                                    ? "Payment completed"
                                                    : "Payment required"}
                                            </strong>

                                            <span>
                                                {isPaid
                                                    ? "Your appointment is fully paid."
                                                    : "Complete your payment to confirm your visit."}
                                            </span>
                                        </div>

                                    </div>


                                    <Link
                                        to={`/payment/${a.id}`}
                                        className={
                                            isPaid
                                                ? "modern-view-button"
                                                : "modern-pay-button"
                                        }
                                    >

                                        <i
                                            className={
                                                isPaid
                                                    ? "fa-regular fa-eye"
                                                    : "fa-solid fa-arrow-right"
                                            }
                                        ></i>

                                        {isPaid
                                            ? "View Payment"
                                            : "Continue Payment"}

                                    </Link>

                                </div>

                            </div>

                        </article>

                    );

                })}

            </div>

        )}

    </section>
)}
            </div>
        </main>
    </div>;
}
