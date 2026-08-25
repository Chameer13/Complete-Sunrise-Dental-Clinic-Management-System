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
                    <ProtectedRoute>
                        <Patient />
                    </ProtectedRoute>
                }
            />


            <Route
                path="/appointments"
                element={
                    <ProtectedRoute>
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
                path="/updates"
                element={
                    <ProtectedRoute>
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