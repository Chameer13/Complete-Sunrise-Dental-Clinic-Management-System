import { useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "../styles/AdvancedFeatures.css";

const blank = {
  idNumber: "",
  fullName: "",
  address: "",
  contactNumber: "",
  email: "",
  gender: "",
  dateOfBirth: "",
  emergencyContact: "",
  allergies: "",
  medicalNotes: ""
};

export default function Patient() {
  const { user } = useAuth();

  const [f, setF] = useState(blank);
  const [exists, setExists] = useState(false);
  const [s, setS] = useState("");

  // Popup state
  const [popup, setPopup] = useState({
    show: false,
    type: "",
    title: "",
    message: ""
  });

  const showPopup = (type, title, message) => {
    setPopup({
      show: true,
      type,
      title,
      message
    });

    // Automatically close after 4 seconds
    setTimeout(() => {
      setPopup({
        show: false,
        type: "",
        title: "",
        message: ""
      });
    }, 4000);
  };

  const lookup = async () => {
    if (!f.idNumber.trim()) {
      showPopup(
        "error",
        "Patient ID Required",
        "Please enter a Patient ID or NIC number."
      );
      return;
    }

    try {
      const r = await api.get(
        "/patients/" + encodeURIComponent(f.idNumber)
      );

      if (r.data) {
        setF({
          ...blank,
          ...r.data
        });

        setExists(true);
        setS("Patient profile found.");

        showPopup(
          "success",
          "Patient Found",
          "The patient profile has been loaded successfully."
        );
      } else {
        setExists(false);
        setS("No profile found. You can create one.");

        showPopup(
          "info",
          "Patient Not Found",
          "No patient profile was found. You can create a new profile."
        );
      }
    } catch (e) {
      setExists(false);
      setS("Lookup failed.");

      showPopup(
        "error",
        "Lookup Failed",
        e.response?.data?.message ||
          "Unable to find the patient profile."
      );
    }
  };

  const save = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!f.idNumber.trim()) {
      showPopup(
        "error",
        "Patient ID Required",
        "Please enter the Patient ID or NIC number."
      );
      return;
    }

    if (!/^(?:\d{12}|\d{9}[VvXx])$/.test(f.idNumber.trim())) {
      showPopup("error", "Invalid NIC Format", "Use 12 digits (e.g. 200299108740) or 9 digits followed by V/X (e.g. 694479542V).");
      return;
    }

    if (!f.fullName.trim()) {
      showPopup(
        "error",
        "Name Required",
        "Please enter the patient's full name."
      );
      return;
    }

    try {
      if (exists) {
        await api.put(
          "/patients/" + encodeURIComponent(f.idNumber),
          f
        );

        setS("Patient profile updated successfully.");

        showPopup(
          "success",
          "Profile Updated",
          "The patient profile has been updated successfully."
        );
      } else {
        await api.post("/patients", f);

        setExists(true);
        setS("Patient profile created successfully.");

        showPopup(
          "success",
          "Profile Saved Successfully",
          "The new patient profile has been saved to the Sunrise Dental system."
        );
      }
    } catch (e) {
      const errorMessage =
        e.response?.data?.message ||
        "Could not save the patient profile.";

      setS(errorMessage);

      showPopup(
        "error",
        "Unable to Save Profile",
        errorMessage
      );
    }
  };

  const closePopup = () => {
    setPopup({
      show: false,
      type: "",
      title: "",
      message: ""
    });
  };

  return (
    <div className="app">

      {/* ================= HEADER ================= */}
      <header>
        <b>✦ PATIENT PROFILES</b>

        <a href="/dashboard">
          Dashboard
        </a>
      </header>

      {/* ================= POPUP ================= */}
      {popup.show && (
        <div className={`patient-popup ${popup.type}`}>
          <div className="patient-popup-icon">
            {popup.type === "success" && "✓"}
            {popup.type === "error" && "!"}
            {popup.type === "info" && "i"}
          </div>

          <div className="patient-popup-content">
            <strong>{popup.title}</strong>
            <p>{popup.message}</p>
          </div>

          <button
            className="patient-popup-close"
            onClick={closePopup}
          >
            ×
          </button>
        </div>
      )}

      <main>
        <div className="panel">

          {/* ================= TITLE ================= */}
          <div className="patient-page-heading">
            <span>RECEPTION & PATIENT MANAGEMENT</span>

            <h1>
              {user?.role === "RECEPTIONIST" ||
              user?.role === "ADMIN"
                ? "Patient Profile Search"
                : "My Patient Profile"}
            </h1>

            <p>
              Search, view and securely manage patient information
              within the Sunrise Dental Clinic system.
            </p>
          </div>

          {/* ================= SEARCH ================= */}
          <div className="patient-search-card">

            <div>
              <h2>Find Patient</h2>

              <p>
                Search using the registered Patient ID or NIC number.
              </p>
            </div>

            <div className="patient-search-row">

              <div className="patient-search-input">

                <span>🔎</span>

                <input
                  placeholder="Enter Patient ID / NIC"
                  value={f.idNumber}
                  onChange={(e) =>
                    setF({
                      ...f,
                      idNumber: e.target.value
                    })
                  }
                />

              </div>

              <button
                type="button"
                className="patient-search-button"
                onClick={lookup}
              >
                Find Patient
              </button>

            </div>

            {s && (
              <div className="patient-status">
                {s}
              </div>
            )}

          </div>

          {/* ================= PROFILE FORM ================= */}
          <form
            className="patient-profile-card"
            onSubmit={save}
          >

            <div className="profile-card-header">

              <div>
                <span>PATIENT INFORMATION</span>

                <h2>
                  Patient Details
                </h2>

                <p>
                  Enter accurate patient information for clinic
                  records and appointment management.
                </p>
              </div>

              <div className="profile-icon">
                👤
              </div>

            </div>

            <div className="formgrid">

              {Object.entries(f).map(([k, v]) => {

                if (k === "gender") {
                  return (
                    <label key={k}>
                      Gender

                      <select
                        value={v || ""}
                        onChange={(e) =>
                          setF({
                            ...f,
                            gender: e.target.value
                          })
                        }
                      >
                        <option value="">
                          Select gender
                        </option>

                        <option value="MALE">
                          Male
                        </option>

                        <option value="FEMALE">
                          Female
                        </option>

                        <option value="OTHER">
                          Other
                        </option>
                      </select>
                    </label>
                  );
                }

                return (
                  <label key={k}>

                    {k
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (x) =>
                        x.toUpperCase()
                      )}

                    <input
                      type={
                        k === "dateOfBirth"
                          ? "date"
                          : "text"
                      }
                      value={v || ""}
                      disabled={
                        k === "idNumber" &&
                        !!f.idNumber
                      }
                      onChange={(e) =>
                        setF({
                          ...f,
                          [k]: e.target.value
                        })
                      }
                    />

                  </label>
                );
              })}

            </div>

            {/* ================= SAVE ================= */}
            <div className="patient-save-area">

              <button
                type="submit"
                className="patient-save-button"
              >
                {exists
                  ? "✓ Update Patient Profile"
                  : "✓ Save Patient Profile"}
              </button>

            </div>

          </form>

        </div>
      </main>
    </div>
  );
}