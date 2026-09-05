import { useEffect, useState } from "react";
import api from "../services/api";

export default function StaffAppointments() {
  const [d, setD] = useState([]);
  const [a, setA] = useState([]);
  const [dentistId, setDentistId] = useState("");
  const [date, setDate] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const params = {};
      if (dentistId) params.dentistId = dentistId;
      if (date) params.date = date;
      const r = await api.get("/staff/appointments", { params });
      setA(r.data || []);
      setMsg(
        r.data?.length
          ? `${r.data.length} appointment(s) found.`
          : "No appointments match the selected filters."
      );
    } catch (e) {
      setMsg(e.response?.data?.message || "Unable to load appointments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    api.get("/dentists").then((r) => setD(r.data || []));
    load();
  }, []);

  return (
    <div className="feature-page">
      {/* Header Section */}
      <header className="sa-header">
        <div className="sa-brand">
          <div className="sa-brand-icon">🩺</div>
          <h2>APPOINTMENTS</h2>
        </div>
        <div className="sa-header-right">
          <button
            className="sa-dashboard-btn"
            onClick={() => (window.location.href = "/dashboard")}
          >
            Dashboard
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="sa-layout">
        <div className="sa-content">
          {/* Title and Description */}<br></br>
          <div className="feature-title">
            <span>RECEPTION DESK</span>
            <h1>Dentist Schedule & Appointments</h1>
            <p>
              All appointments are shown by default. Use the dentist and date
              filters together when you need a focused schedule.
            </p>
          </div>

          {/* Filters */}
          <div className="feature-card filter-card">
            <div className="filter-field">
              <label>Dentist</label>
              <select
                value={dentistId}
                onChange={(e) => setDentistId(e.target.value)}
              >
                <option value="">All dentists</option>
                {d.map((x) => (
                  <option key={x.id} value={x.id}>
                    {x.fullName} · {x.specialization}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter-field">
              <label>Appointment date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <button className="feature-button" onClick={load}>
              {loading ? "Loading..." : "Apply Filters"}
            </button>
            <button
              className="ghost-button"
              onClick={() => {
                setDentistId("");
                setDate("");
                setTimeout(load, 0);
              }}
            >
              Show All
            </button>
          </div>

          {/* Message */}
          <p className="feature-message">{msg}</p>

          {/* Appointments List */}
          <div className="schedule-list">
            {a.map((x) => (
              <article className="feature-card schedule-row" key={x.id}>
                <div className="schedule-time">
                  <strong>{x.appointmentDateTime?.slice(11, 16)}</strong>
                  <small>{x.appointmentDateTime?.slice(0, 10)}</small>
                </div>
                <div>
                  <b>{x.patient?.fullName || "Patient"}</b>
                  <small>
                    NIC / ID: {x.patient?.idNumber || "Not available"}
                  </small>
                </div>
                <div>
                  <b>Dr. {x.dentist?.displayName || "Dentist"}</b>
                  <small>{x.dentist?.specialization || ""}</small>
                </div>
                <div>
                  <b>{x.treatment?.name || "Treatment"}</b>
                  <small>{x.appointmentNumber}</small>
                </div>
                <span className={`status-pill ${String(x.status).toLowerCase()}`}>
                  {x.status}
                </span>
              </article>
            ))}
          </div>
        </div>
      </div>

      {/* Inline CSS styles for header and button */}
      <style jsx>{`
        /* Header styles */
        .sa-header {
          height: 72px;
          padding: 0 32px;
          background: #0c3150;
          color: white;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 3px 15px rgba(13, 48, 77, 0.18);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .sa-brand {
          display: flex;
          align-items: center;
          gap: 13px;
        }

        .sa-brand-icon {
          width: 43px;
          height: 43px;
          border-radius: 11px;
          background: rgba(255, 255, 255, 0.11);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
        }

        .sa-header-right {
          display: flex;
          align-items: center;
          gap: 18px;
        }

        .sa-dashboard-btn {
          height: 36px;
          padding: 0 15px;
          border: 1px solid rgba(255,255,255,0.20);
          border-radius: 7px;
          background: rgba(255,255,255,0.07);
          color: white;
          font-size: 10px;
          font-weight: 650;
          cursor: pointer;
          transition: 0.2s;
        }

        .sa-dashboard-btn:hover {
          background: rgba(255,255,255,0.15);
          transform: translateY(-1px);
        }
        /* Additional styles can be added here if needed */
      `}</style>
    </div>
  );
}