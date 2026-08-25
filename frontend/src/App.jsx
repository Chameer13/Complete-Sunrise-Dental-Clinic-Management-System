import {
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Forgot from "./pages/Forgot";

import Dashboard from "./pages/Dashboard";
import Patient from "./pages/Patient";
import Appointment from "./pages/Appointment";
import Dentist from "./pages/Dentist";
import Billing from "./pages/Billing";
import Payment from "./pages/Payment";
import Updates from "./pages/Updates";
import StaffRecords from "./pages/StaffRecords";
import StaffAppointments from "./pages/StaffAppointments";


export default function App() {

    return (
        <Routes>

            {/* ================= PUBLIC ================= */}

            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/register"
                element={<Register />}
            />

            <Route
                path="/forgot-password"
                element={<Forgot />}
            />


            {/* ================= PROTECTED ================= */}

            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />


            <Route
                path="/patients"
                element={
                    <ProtectedRoute roles={["PATIENT","RECEPTIONIST","ADMIN"]}>
                        <Patient />
                    </ProtectedRoute>
                }
            />


            <Route
                path="/appointments"
                element={
                    <ProtectedRoute roles={["PATIENT","RECEPTIONIST","ADMIN"]}>
                        <Appointment />
                    </ProtectedRoute>
                }
            />


            <Route
                path="/dentist"
                element={
                    <ProtectedRoute roles={["DENTIST"]}>
                        <Dentist />
                    </ProtectedRoute>
                }
            />


            <Route
                path="/billing"
                element={
                    <ProtectedRoute
                        roles={[
                            "ADMIN",
                            "RECEPTIONIST"
                        ]}
                    >
                        <Billing />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/payment/:appointmentId"
                element={
                    <ProtectedRoute roles={["PATIENT"]}>
                        <Payment />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/staff/payment/:appointmentId"
                element={
                    <ProtectedRoute roles={["RECEPTIONIST","ADMIN"]}>
                        <Payment />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/staff/records"
                element={
                    <ProtectedRoute roles={["RECEPTIONIST","ADMIN"]}>
                        <StaffRecords />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/staff/appointments"
                element={
                    <ProtectedRoute roles={["RECEPTIONIST","ADMIN"]}>
                        <StaffAppointments />
                    </ProtectedRoute>
                }
            />


            <Route
                path="/updates"
                element={
                    <ProtectedRoute roles={["PATIENT","RECEPTIONIST","ADMIN"]}>
                        <Updates />
                    </ProtectedRoute>
                }
            />


            {/* ================= DEFAULT ================= */}

            <Route
                path="/"
                element={
                    <Navigate
                        to="/login"
                        replace
                    />
                }
            />


            {/* ================= UNKNOWN ================= */}

            <Route
                path="*"
                element={
                    <Navigate
                        to="/login"
                        replace
                    />
                }
            />

        </Routes>
    );
}