import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Dentist() {
    const { user } = useAuth();

    const [appointments, setAppointments] = useState([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(null);

    const loadAppointments = async () => {
        setLoading(true);
        setMessage("");

        try {
            const response = await api.get("/dentist/appointments");

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

        const finalStatus = status.trim().toUpperCase();

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

    return (
        <div className="app">

            <header>

                <b>✦ DENTIST PORTAL</b>

                <span>
                    {user?.fullName || "Dentist"}
                    {" · "}
                    @{user?.username || ""}
                </span>

                <a href="/dashboard">
                    Dashboard
                </a>

            </header>

            <main>

                <div className="panel">

                    <h1>
                        My Appointments
                    </h1>

                    <p>
                        Welcome, {user?.fullName}.
                        This schedule contains only appointments
                        assigned to your dentist account.
                    </p>

                    {message && (
                        <div className="dentist-message">
                            {message}
                        </div>
                    )}

                    {loading ? (

                        <div className="dentist-loading">
                            <div className="loading-spinner"></div>
                            <p>
                                Loading your appointments...
                            </p>
                        </div>

                    ) : appointments.length === 0 ? (

                        <div className="dentist-empty">

                            <div className="empty-icon">
                                ✓
                            </div>

                            <h2>
                                No Appointments Scheduled
                            </h2>

                            <p>
                                There are currently no appointments
                                assigned to your dentist account.
                            </p>

                        </div>

                    ) : (

                        <div className="table dentist-table">

                            <div className="dentist-table-header">

                                <span>
                                    Appointment
                                </span>

                                <span>
                                    Patient
                                </span>

                                <span>
                                    Treatment
                                </span>

                                <span>
                                    Status
                                </span>

                                <span>
                                    Action
                                </span>

                            </div>

                            {appointments.map(
                                appointment => (

                                    <div
                                        className="row"
                                        key={appointment.id}
                                    >

                                        <div>
                                            <b>
                                                {
                                                    appointment.appointmentNumber
                                                }
                                            </b>

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

                                        <div>
                                            <b>
                                                {
                                                    appointment.patient?.fullName ||
                                                    "Patient"
                                                }
                                            </b>

                                            <small>
                                                {
                                                    appointment.patient?.idNumber ||
                                                    "NIC unavailable"
                                                }
                                            </small>
                                        </div>

                                        <div>
                                            <b>
                                                {
                                                    appointment.treatment?.name ||
                                                    "Treatment"
                                                }
                                            </b>

                                            <small>
                                                {
                                                    appointment.treatment?.defaultPrice
                                                        ? `Rs. ${Number(
                                                              appointment.treatment.defaultPrice
                                                          ).toLocaleString()}`
                                                        : ""
                                                }
                                            </small>
                                        </div>

                                        <div>

                                            <span
                                                className={
                                                    "appointment-status " +
                                                    String(
                                                        appointment.status ||
                                                        "BOOKED"
                                                    ).toLowerCase()
                                                }
                                            >
                                                {
                                                    appointment.status ||
                                                    "BOOKED"
                                                }
                                            </span>

                                        </div>

                                        <div>

                                            <button
                                                className="dentist-update-button"
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
                                                    : "Add Patient Update"}
                                            </button>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </div>

            </main>

        </div>
    );
}