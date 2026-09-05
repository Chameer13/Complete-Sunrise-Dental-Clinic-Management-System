import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const clinicImages = [
    {
        image:
            "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=1200&q=80",
        title: "Modern Dental Care",
        text: "Professional care in a comfortable environment."
    },
    {
        image:
            "https://images.unsplash.com/photo-1588776814546-daab30f310ce?auto=format&fit=crop&w=1200&q=80",
        title: "Healthy Smiles Start Here",
        text: "Advanced dental treatments for every stage of life."
    },
    {
        image:
            "https://images.unsplash.com/photo-1550831107-1553da8c8464?auto=format&fit=crop&w=1200&q=80",
        title: "Expert Dental Team",
        text: "Experienced professionals focused on your wellbeing."
    },
    {
        image:
            "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=1200&q=80",
        title: "Complete Dental Services",
        text: "From routine checkups to advanced treatments."
    }
];

const quickTips = [
    {
        icon: "🪥",
        title: "Brush Twice Daily",
        text: "Brush for at least two minutes in the morning and before bedtime."
    },
    {
        icon: "🦷",
        title: "Regular Checkups",
        text: "Routine dental visits help identify problems before they become serious."
    },
    {
        icon: "💧",
        title: "Stay Hydrated",
        text: "Drinking water helps maintain a healthy mouth and supports saliva production."
    },
    {
        icon: "🍎",
        title: "Healthy Choices",
        text: "Reduce sugary snacks and choose foods that support strong teeth."
    }
];

function formatDate(value) {
    if (!value) return "Date not available";

    try {
        return new Date(value).toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric"
        });
    } catch {
        return String(value).replace("T", " ");
    }
}

function formatTime(value) {
    if (!value) return "";

    try {
        return new Date(value).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit"
        });
    } catch {
        return "";
    }
}

function getFirstName(name) {
    if (!name) return "there";
    return name.trim().split(" ")[0];
}

function getStatusClass(status) {
    return String(status || "BOOKED")
        .toLowerCase()
        .replaceAll(" ", "-");
}

function StatCard({ icon, value, label, className = "" }) {
    return (
        <div className={`dash-stat ${className}`}>
            <div className="dash-stat-icon">{icon}</div>

            <div>
                <strong>{value}</strong>
                <span>{label}</span>
            </div>
        </div>
    );
}

function QuickAction({ icon, title, text, to, className = "" }) {
    return (
        <Link to={to} className={`dash-action ${className}`}>
            <div className="dash-action-icon">{icon}</div>

            <div>
                <strong>{title}</strong>
                <span>{text}</span>
            </div>

            <b className="dash-arrow">→</b>
        </Link>
    );
}

function AppointmentCard({ appointment }) {
    const patientName =
        appointment?.patient?.fullName || "Patient";

    const dentistName =
        appointment?.dentist?.fullName ||
        appointment?.dentist?.name ||
        "Assigned Dentist";

    const treatmentName =
        appointment?.treatment?.name ||
        "Dental Treatment";

    const appointmentDate =
        appointment?.appointmentDateTime ||
        appointment?.dateTime ||
        appointment?.date;

    return (
        <div className="dash-appointment-card">

            <div className="appointment-date-box">
                <span>
                    {appointmentDate
                        ? new Date(appointmentDate).toLocaleDateString(
                              "en-US",
                              { month: "short" }
                          )
                        : "N/A"}
                </span>

                <strong>
                    {appointmentDate
                        ? new Date(appointmentDate).getDate()
                        : "--"}
                </strong>
            </div>

            <div className="appointment-main">

                <div className="appointment-title-row">
                    <div>
                        <h3>{treatmentName}</h3>

                        <p>
                            {appointment?.appointmentNumber ||
                                "Appointment"}
                        </p>
                    </div>

                    <span
                        className={`dash-status ${getStatusClass(
                            appointment?.status
                        )}`}
                    >
                        {appointment?.status || "BOOKED"}
                    </span>
                </div>

                <div className="appointment-details">

                    <span>
                        <b>📅</b>
                        {formatDate(appointmentDate)}
                    </span>

                    <span>
                        <b>🕐</b>
                        {formatTime(appointmentDate) || "Time pending"}
                    </span>

                    <span>
                        <b>👨‍⚕️</b>
                        {dentistName}
                    </span>

                    {appointment?.patient?.fullName && (
                        <span>
                            <b>👤</b>
                            {patientName}
                        </span>
                    )}

                </div>

            </div>
        </div>
    );
}

function PatientDashboard({ user, appointments }) {

    const upcoming = useMemo(() => {
        return appointments
            .filter(
                (item) =>
                    String(item.status).toUpperCase() !==
                        "CANCELLED" &&
                    String(item.status).toUpperCase() !==
                        "COMPLETED"
            )
            .slice(0, 4);
    }, [appointments]);

    const completed = appointments.filter(
        (item) =>
            String(item.status).toUpperCase() === "COMPLETED"
    ).length;

    const pending = appointments.filter(
        (item) =>
            ["BOOKED", "CONFIRMED"].includes(
                String(item.status).toUpperCase()
            )
    ).length;

    return (
        <>

            {/* HERO */}
            <section className="dash-hero patient-hero">

                <div className="dash-hero-content">

                    <div className="dash-eyebrow">
                        <span></span>
                        SUNRISE DENTAL CLINIC
                    </div>

                    <h1>
                        Welcome back,{" "}
                        <em>{getFirstName(user?.fullName)}!</em>
                    </h1>

                    <p>
                        Your smile deserves the best care. Manage
                        your appointments, profile and dental
                        information from one secure place.
                    </p>

                    <div className="hero-buttons">
                        <Link
                            to="/appointments"
                            className="primary-dash-button"
                        >
                            <span>＋</span>
                            Book an Appointment
                        </Link>

                        <Link
                            to="/patients"
                            className="secondary-dash-button"
                        >
                            View My Profile
                            <span>→</span>
                        </Link>
                    </div>

                </div>

                <div className="dash-hero-decoration">
                    <div className="hero-circle hero-circle-one"></div>
                    <div className="hero-circle hero-circle-two"></div>

                    <div className="hero-tooth">
                        🦷
                    </div>
                </div>

            </section>

            {/* STATS */}
            <section className="dash-stats-grid">

                <StatCard
                    icon="📅"
                    value={appointments.length}
                    label="Total Appointments"
                />

                <StatCard
                    icon="⏱"
                    value={pending}
                    label="Upcoming Visits"
                    className="green"
                />

                <StatCard
                    icon="✓"
                    value={completed}
                    label="Completed Visits"
                    className="purple"
                />

                <StatCard
                    icon="💙"
                    value="24/7"
                    label="Patient Support"
                    className="orange"
                />

            </section>

            {/* MAIN GRID */}
            <section className="dash-main-grid">

                <div className="dash-large-column">

                    <div className="dash-section-heading">
                        <div>
                            <span>YOUR SCHEDULE</span>
                            <h2>Upcoming Appointments</h2>
                        </div>

                      
                    </div>

                    {upcoming.length > 0 ? (
                        <div className="appointment-list">

                            {upcoming.map((appointment) => (
                                <AppointmentCard
                                    key={appointment.id}
                                    appointment={appointment}
                                />
                            ))}

                        </div>
                    ) : (
                        <div className="dash-empty-card">

                            <div>🗓️</div>

                            <h3>No Upcoming Appointments</h3>

                            <p>
                                You currently don't have any upcoming
                                visits scheduled.
                            </p>

                            <Link
                                to="/appointments"
                                className="primary-dash-button small"
                            >
                                Book Your Visit
                            </Link>

                        </div>
                    )}

                </div>

                <aside className="dash-side-column">

                    <div className="dash-welcome-card">

                        <div className="mini-avatar">
                            {getFirstName(user?.fullName)
                                .charAt(0)
                                .toUpperCase()}
                        </div>

                        <span>YOUR ACCOUNT</span>

                        <h3>{user?.fullName}</h3>

                        <p>
                            Patient ID:{" "}
                            <strong>
                                {user?.username || "Registered Patient"}
                            </strong>
                        </p>

                        <Link to="/patients">
                            Manage Profile →
                        </Link>

                    </div>

                    <div className="dash-info-card">

                        <div className="info-card-icon">
                            💡
                        </div>

                        <div>
                            <span>HEALTH TIP</span>

                            <h3>
                                Don't skip your regular checkup
                            </h3>

                            <p>
                                Early detection can prevent small
                                dental problems from becoming major
                                treatments.
                            </p>
                        </div>

                    </div>

                </aside>

            </section>

            {/* QUICK ACTIONS */}
            <section className="dash-section">

                <div className="dash-section-heading">
                    <div>
                        <span>QUICK ACCESS</span>
                        <h2>What would you like to do?</h2>
                    </div>
                </div>

                <div className="dash-actions-grid">

                    <QuickAction
                        icon="📅"
                        title="Book Appointment"
                        text="Find a suitable appointment time"
                        to="/appointments"
                    />

                    <QuickAction
                        icon="💳"
                        title="My Payments"
                        text="Check paid or pending appointments and continue payment"
                        to="/payment"
                    />

                    <QuickAction
                        icon="👤"
                        title="My Profile"
                        text="View and update your information"
                        to="/patients"
                    />

                    <QuickAction
                        icon="🔔"
                        title="Appointment Updates"
                        text="Check messages from your dentist"
                        to="/updates"
                    />

                    <QuickAction
                        icon="💬"
                        title="Ask Your Dentist"
                        text="Send a private inquiry and receive a reply"
                        to="/inquiries"
                    />

                    <QuickAction
                        icon="💊"
                        title="My Prescriptions"
                        text="View prescriptions issued by your dentist"
                        to="/prescriptions"
                    />

                    <QuickAction
                        icon="⭐"
                        title="Rate Our Service"
                        text="Share your experience with Sunrise Dental"
                        to="/feedback"
                    />

                    <QuickAction
                        icon="ℹ️"
                        title="About Sunrise Dental"
                        text="Learn about our care and clinic values"
                        to="/about"
                    />

                    <QuickAction
                        icon="❓"
                        title="System Help"
                        text="Learn the steps for each main function"
                        to="/help"
                    />

                    <QuickAction
                       
                        title="Go Back"
                        text="Go back to Login Page"
                        to="/login"
                    />

                </div>

            </section>

            {/* SCROLLING IMAGES */}
            <section className="dash-gallery-section">

                <div className="dash-section-heading gallery-heading">

                    <div>
                        <span>SUNRISE DENTAL EXPERIENCE</span>
                        <h2>Care designed around your smile</h2>
                    </div>

                    <p>
                        Modern care. Experienced professionals.
                        Comfortable visits.
                    </p>

                </div>

                <div className="dash-image-marquee">

                    <div className="dash-image-track">

                        {[...clinicImages, ...clinicImages].map(
                            (item, index) => (
                                <div
                                    className="dash-image-card"
                                    key={`${item.title}-${index}`}
                                >
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                    />

                                    <div>
                                        <strong>{item.title}</strong>
                                        <span>{item.text}</span>
                                    </div>
                                </div>
                            )
                        )}

                    </div>

                </div>

            </section>

            {/* TIPS */}
            <section className="dash-section">

                <div className="dash-section-heading">

                    <div>
                        <span>DENTAL WELLNESS</span>
                        <h2>Simple habits for a healthier smile</h2>
                    </div>

                </div>

                <div className="dash-tips-grid">

                    {quickTips.map((tip) => (
                        <div
                            className="dash-tip-card"
                            key={tip.title}
                        >
                            <div>{tip.icon}</div>

                            <h3>{tip.title}</h3>

                            <p>{tip.text}</p>
                        </div>
                    ))}

                </div>

            </section>

        </>
    );
}

function StaffDashboard({ user, appointments, dentists }) {

    const today = new Date();

    const todayAppointments = appointments.filter((item) => {

        const value =
            item.appointmentDateTime ||
            item.dateTime ||
            item.date;

        if (!value) return false;

        const date = new Date(value);

        return (
            date.getFullYear() === today.getFullYear() &&
            date.getMonth() === today.getMonth() &&
            date.getDate() === today.getDate()
        );
    });

    const pending = appointments.filter((item) =>
        ["BOOKED", "CONFIRMED"].includes(
            String(item.status).toUpperCase()
        )
    ).length;

    return (
        <>

            <section className="dash-hero staff-hero">

                <div className="dash-hero-content">

                    <div className="dash-eyebrow">
                        <span></span>
                        FRONT DESK OPERATIONS
                    </div>

                    <h1>
                        Welcome,{" "}
                        <em>{getFirstName(user?.fullName)}</em>
                    </h1>

                    <p>
                        Keep today's clinic running smoothly.
                        Manage patients, appointments, dentists
                        and payment records from your reception
                        dashboard.
                    </p>

                    <div className="hero-buttons">

                        <Link
                            to="/appointments"
                            className="primary-dash-button"
                        >
                            ＋ Book Appointment
                        </Link>

                        <Link
                            to="/patients"
                            className="secondary-dash-button"
                        >
                            🔎 Find Patient
                        </Link>

                    </div>

                </div>

                <div className="staff-hero-stat">

                    <span>TODAY</span>

                    <strong>
                        {todayAppointments.length}
                    </strong>

                    <p>
                        scheduled appointments
                    </p>

                    <div className="hero-stat-line">
                        <span></span>
                    </div>

                </div>

            </section>

            <section className="dash-stats-grid">

                <StatCard
                    icon="📅"
                    value={todayAppointments.length}
                    label="Today's Appointments"
                />

                <StatCard
                    icon="⏳"
                    value={pending}
                    label="Pending / Confirmed"
                    className="green"
                />

                <StatCard
                    icon="👥"
                    value="Patients"
                    label="Patient Management"
                    className="purple"
                />

                <StatCard
                    icon="👨‍⚕️"
                    value={dentists.length || "—"}
                    label="Available Dentists"
                    className="orange"
                />

            </section>

            <section className="dash-section">

                <div className="dash-section-heading">

                    <div>
                        <span>RECEPTION DESK</span>
                        <h2>Common Tasks</h2>
                    </div>

                </div>

                <div className="dash-actions-grid staff-actions">

                    <QuickAction
                        icon="👤"
                        title="Patient Profiles"
                        text="Search, create and update patient information"
                        to="/patients"
                    />

                    <QuickAction
                        icon="📅"
                        title="Book Appointment"
                        text="Schedule a new patient appointment"
                        to="/appointments"
                    />

                    <QuickAction
                        icon="👨‍⚕️"
                        title="Dentist Schedules"
                        text="Check appointments assigned to dentists"
                        to="/staff/appointments"
                    />

                    <QuickAction
                        icon="💳"
                        title="Patient Records & Payments"
                        text="Review records and outstanding payments"
                        to="/staff/records"
                    />

                    <QuickAction
                        icon="⭐"
                        title="Patient Feedback"
                        text="Review patient ratings and comments"
                        to="/feedback"
                    />

                    <QuickAction
                        icon="💊"
                        title="Prescriptions & Medicines"
                        text="Review prescriptions and record medicines provided"
                        to="/staff/prescriptions"
                    />

                    <QuickAction
                        icon="❓"
                        title="Reception Help"
                        text="Step-by-step guidance for reception functions"
                        to="/help"
                    />

                    

                </div>

            </section>

            <section className="dash-main-grid">

                <div className="dash-large-column">

                    <div className="dash-section-heading">

                        <div>
                            <span>CLINIC SCHEDULE</span>
                            <h2>Recent Appointments</h2>
                        </div>

                        <Link to="/staff/appointments">
                            Full schedule →
                        </Link>

                    </div>

                    {appointments.length > 0 ? (
                        <div className="appointment-list">

                            {appointments.slice(0, 5).map(
                                (appointment) => (
                                    <AppointmentCard
                                        key={appointment.id}
                                        appointment={appointment}
                                    />
                                )
                            )}

                        </div>
                    ) : (
                        <div className="dash-empty-card">
                            <div>📋</div>
                            <h3>No appointment data</h3>
                            <p>
                                Appointments will appear here when
                                they are available.
                            </p>
                        </div>
                    )}

                </div>

                <aside className="dash-side-column">

                    <div className="dash-control-card">

                        <div className="control-card-heading">
                            <div>⚡</div>

                            <span>QUICK STATUS</span>
                        </div>

                        <div className="control-row">
                            <span>Clinic status</span>
                            <strong className="online">
                                ● Open
                            </strong>
                        </div>

                        <div className="control-row">
                            <span>Reception</span>
                            <strong className="online">
                                ● Active
                            </strong>
                        </div>

                        <div className="control-row">
                            <span>Dentists</span>
                            <strong>
                                {dentists.length || "—"} registered
                            </strong>
                        </div>

                        <div className="control-row">
                            <span>Today's workload</span>
                            <strong>
                                {todayAppointments.length} visits
                            </strong>
                        </div>

                    </div>

                    <div className="dash-info-card staff-info">

                        <div className="info-card-icon">
                            💡
                        </div>

                        <div>
                            <span>FRONT DESK TIP</span>

                            <h3>
                                Confirm patient details
                            </h3>

                            <p>
                                Always verify the patient's contact
                                details before creating or changing
                                an appointment.
                            </p>
                        </div>

                    </div>

                </aside>

            </section>

            <section className="dash-gallery-section">

                <div className="dash-section-heading gallery-heading">

                    <div>
                        <span>SUNRISE DENTAL CLINIC</span>
                        <h2>Professional care at every visit</h2>
                    </div>

                </div>

                <div className="dash-image-marquee">

                    <div className="dash-image-track">

                        {[...clinicImages, ...clinicImages].map(
                            (item, index) => (
                                <div
                                    className="dash-image-card"
                                    key={`${item.title}-staff-${index}`}
                                >
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                    />

                                    <div>
                                        <strong>{item.title}</strong>
                                        <span>{item.text}</span>
                                    </div>
                                </div>
                            )
                        )}

                    </div>

                </div>

            </section>

        </>
    );
}

function DentistDashboard({ user, appointments }) {

    const today = new Date();

    const todayAppointments = appointments.filter((item) => {

        const value =
            item.appointmentDateTime ||
            item.dateTime ||
            item.date;

        if (!value) return false;

        const date = new Date(value);

        return (
            date.getFullYear() === today.getFullYear() &&
            date.getMonth() === today.getMonth() &&
            date.getDate() === today.getDate()
        );
    });

    const confirmed = appointments.filter(
        (item) =>
            String(item.status).toUpperCase() === "CONFIRMED"
    ).length;

    const completed = appointments.filter(
        (item) =>
            String(item.status).toUpperCase() === "COMPLETED"
    ).length;

    return (
        <>

            <section className="dash-hero dentist-hero">

                <div className="dash-hero-content">

                    <div className="dash-eyebrow">
                        <span></span>
                        CLINICAL DASHBOARD
                    </div>

                    <h1>
                        Welcome,{" "}
                        <em>  {user?.fullName}</em>
                    </h1>

                    <p>
                        Review your clinical schedule, manage
                        today's appointments and keep your patients
                        informed through Sunrise Dental.
                    </p>

                    <div className="hero-buttons">

                        <Link
                            to="/dentist"
                            className="primary-dash-button"
                        >
                            View My Appointments
                            <span>→</span>
                        </Link>

                        <Link
                            to="/updates"
                            className="secondary-dash-button"
                        >
                            Patient Updates
                        </Link>

                    </div>

                </div>

                <div className="doctor-hero-symbol">
                    <div className="doctor-cross">
                        ✚
                    </div>

                    <span>
                        DENTAL<br />
                        CARE
                    </span>
                </div>

            </section>

            <section className="dash-stats-grid">

                <StatCard
                    icon="📅"
                    value={todayAppointments.length}
                    label="Today's Patients"
                />

                <StatCard
                    icon="✓"
                    value={confirmed}
                    label="Confirmed Visits"
                    className="green"
                />

                <StatCard
                    icon="🩺"
                    value={completed}
                    label="Completed Treatments"
                    className="purple"
                />

                <StatCard
                    icon="💙"
                    value="Active"
                    label="Clinical Status"
                    className="orange"
                />

            </section>

            <section className="dash-main-grid">

                <div className="dash-large-column">

                    <div className="dash-section-heading">

                        <div>
                            <span>YOUR CLINICAL SCHEDULE</span>
                            <h2>Today's Appointments</h2>
                        </div>

                        <Link to="/dentist">
                            Manage schedule →
                        </Link>

                    </div>

                    {todayAppointments.length > 0 ? (
                        <div className="appointment-list">

                            {todayAppointments.map(
                                (appointment) => (
                                    <AppointmentCard
                                        key={appointment.id}
                                        appointment={appointment}
                                    />
                                )
                            )}

                        </div>
                    ) : (
                        <div className="dash-empty-card">

                            <div>🩺</div>

                            <h3>
                                No appointments today
                            </h3>

                            <p>
                                Your clinical schedule currently
                                has no appointments for today.
                            </p>

                            <Link
                                to="/dentist"
                                className="primary-dash-button small"
                            >
                                View Full Schedule
                            </Link>

                        </div>
                    )}

                </div>

                <aside className="dash-side-column">

                    <div className="doctor-profile-card">

                        <div className="doctor-avatar">
                            👨‍⚕️
                        </div>

                        <span>DENTIST ACCOUNT</span>

                        <h3>
                             {user?.fullName}
                        </h3>

                        <p>
                            @{user?.username}
                        </p>

                        <div className="doctor-status">
                            <span></span>
                            Available for clinic appointments
                        </div>

                    </div>

                    <div className="dash-control-card">

                        <div className="control-card-heading">
                            <div>📊</div>
                            <span>CLINICAL OVERVIEW</span>
                        </div>

                        <div className="control-row">
                            <span>Today's patients</span>
                            <strong>
                                {todayAppointments.length}
                            </strong>
                        </div>

                        <div className="control-row">
                            <span>Confirmed</span>
                            <strong>
                                {confirmed}
                            </strong>
                        </div>

                        <div className="control-row">
                            <span>Completed</span>
                            <strong>
                                {completed}
                            </strong>
                        </div>

                    </div>

                </aside>

            </section>

            <section className="dash-section">

                <div className="dash-section-heading">

                    <div>
                        <span>CLINICAL ACTIONS</span>
                        <h2>Quick Access</h2>
                    </div>

                </div>

                <div className="dash-actions-grid dentist-actions">

                    <QuickAction
                        icon="📅"
                        title="My Appointments"
                        text="Review and manage assigned appointments"
                        to="/dentist"
                    />

                    

                    <QuickAction
                        icon="💬"
                        title="Patient Inquiries"
                        text="Reply to patient questions and email them securely"
                        to="/inquiries"
                    />

                    <QuickAction
                        icon="💊"
                        title="Prescriptions"
                        text="Add prescriptions to your appointments"
                        to="/dentist/prescriptions"
                    />

                    <QuickAction
                        icon="❓"
                        title="Clinical Help"
                        text="Review the dentist workflow and patient-history steps"
                        to="/help"
                    />

                </div>

            </section>

            <section className="dash-gallery-section">

                <div className="dash-section-heading gallery-heading">

                    <div>
                        <span>CLINICAL ENVIRONMENT</span>
                        <h2>Professional care with modern standards</h2>
                    </div>

                </div>

                <div className="dash-image-marquee">

                    <div className="dash-image-track">

                        {[...clinicImages, ...clinicImages].map(
                            (item, index) => (
                                <div
                                    className="dash-image-card"
                                    key={`${item.title}-dentist-${index}`}
                                >
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                    />

                                    <div>
                                        <strong>{item.title}</strong>
                                        <span>{item.text}</span>
                                    </div>
                                </div>
                            )
                        )}

                    </div>

                </div>

            </section>

        </>
    );
}

export default function Dashboard() {

    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [appointments, setAppointments] = useState([]);
    const [dentists, setDentists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const role = user?.role;

    const isPatient = role === "PATIENT";

    const isDentist = role === "DENTIST";

    const isStaff =
        role === "RECEPTIONIST" ||
        role === "ADMIN";

    useEffect(() => {

        let mounted = true;

        async function loadDashboardData() {

            setLoading(true);
            setError("");

            try {

                if (isPatient) {

                    const response =
                        await api.get("/me/appointments");

                    if (mounted) {
                        setAppointments(
                            Array.isArray(response.data)
                                ? response.data
                                : []
                        );
                    }

                } else if (isDentist) {

                    const response =
                        await api.get("/dentist/appointments");

                    if (mounted) {
                        setAppointments(
                            Array.isArray(response.data)
                                ? response.data
                                : []
                        );
                    }

                } else if (isStaff) {

                    const dentistResponse =
                        await api.get("/dentists");

                    if (mounted) {

                        setDentists(
                            Array.isArray(dentistResponse.data)
                                ? dentistResponse.data
                                : []
                        );
                    }

                    /*
                     * Staff appointment screen already uses
                     * dentist-specific appointment loading.
                     *
                     * We don't make a random appointment API call
                     * here because the existing backend requires
                     * a dentist ID for this staff endpoint.
                     */

                }

            } catch (err) {

                console.error(
                    "Dashboard loading error:",
                    err
                );

                if (mounted) {
                    setError(
                        "Some dashboard information could not be loaded."
                    );
                }

            } finally {

                if (mounted) {
                    setLoading(false);
                }

            }
        }

        if (user) {
            loadDashboardData();
        }

        return () => {
            mounted = false;
        };

    }, [user, isPatient, isDentist, isStaff]);

    const handleLogout = () => {

        logout();

        navigate("/login");

    };

    if (!user) {

        return (
            <div className="dashboard-loading-screen">

                <div className="dashboard-loader">
                    🦷
                </div>

                <h2>Loading Sunrise Dental...</h2>

            </div>
        );
    }

    return (
        <div className="modern-dashboard">

            {/* TOP NAVIGATION */}

            <header className="modern-dashboard-header">

                <Link
                    to="/dashboard"
                    className="dashboard-brand"
                >

                    <div className="brand-tooth">
                        🦷
                    </div>

                    <div>
                        <strong>SUNRISE</strong>
                        <span>DENTAL CLINIC</span>
                    </div>

                </Link>

                <div className="dashboard-header-right">

                    <div className="dashboard-user">

                        <div className="dashboard-user-avatar">
                            {getFirstName(user.fullName)
                                .charAt(0)
                                .toUpperCase()}
                        </div>

                        <div className="dashboard-user-info">
                            <strong>
                                {user.fullName}
                            </strong>

                            <span>
                                {user.role}
                            </span>
                        </div>

                    </div>

                    <button
                        className="dashboard-logout"
                        onClick={handleLogout}
                        title="Logout"
                    >
                        ⇥
                        <span>Logout</span>
                    </button>

                </div>

            </header>

            {/* PAGE */}

            <main className="modern-dashboard-content">

                {error && (
                    <div className="dashboard-error">
                        ⚠ {error}
                    </div>
                )}

                {loading && (
                    <div className="dashboard-loading-bar">
                        <span></span>
                    </div>
                )}

                {isPatient && (
                    <PatientDashboard
                        user={user}
                        appointments={appointments}
                    />
                )}

                {isStaff && (
                    <StaffDashboard
                        user={user}
                        appointments={appointments}
                        dentists={dentists}
                    />
                )}

                {isDentist && (
                    <DentistDashboard
                        user={user}
                        appointments={appointments}
                    />
                )}

            </main>

            {/* FOOTER */}

          

        </div>
    );
}