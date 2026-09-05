import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

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

                {user?.role === "PATIENT" && list.length > 0 && <section className="panel" style={{marginTop: 24}}>
                    <h2>My Recent Appointments</h2>
                    <p>If you left before paying, your appointment is still available from the Payment page.</p>
                    {list.slice(0, 5).map(a => <div key={a.id} style={{display:"flex",justifyContent:"space-between",gap:16,padding:"12px 0",borderBottom:"1px solid #eee"}}>
                        <span><b>{a.appointmentNumber}</b> · {String(a.appointmentDateTime).replace("T", " ")}</span>
                        <Link to={`/payment/${a.id}`}>View / Pay</Link>
                    </div>)}
                </section>}
            </div>
        </main>
    </div>;
}
