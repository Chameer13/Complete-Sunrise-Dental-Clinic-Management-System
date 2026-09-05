import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "../styles/AdvancedFeatures.css";

export default function Inquiry() {

    const { user } = useAuth();

    const role = user?.role;

    const patient = role === "PATIENT";
    const dentist = role === "DENTIST";
    const staff = !patient && !dentist;

    const [d, setD] = useState([]);
    const [items, setItems] = useState([]);
    const [selected, setSelected] = useState("");
    const [message, setMessage] = useState("");
    const [reply, setReply] = useState({});
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);


    /* =========================================================
       LOAD DENTISTS + INQUIRIES
       ========================================================= */

    const load = async () => {

        try {

            const endpoint =
                patient
                    ? "/me/inquiries"
                    : dentist
                        ? "/dentist/inquiries"
                        : "/staff/inquiries";

            const r = await api.get(endpoint);

            setItems(r.data || []);

        } catch (e) {

            setStatus(
                e.response?.data?.message ||
                "Unable to load inquiries."
            );
        }
    };


    useEffect(() => {

        api.get("/dentists")
            .then(r => setD(r.data || []))
            .catch(() => {});

        load();

    }, [role]);


    /* =========================================================
       PATIENT SEND INQUIRY
       ========================================================= */

    const send = async (e) => {

        e.preventDefault();

        if (!selected) {
            setStatus("Please select a dentist.");
            return;
        }

        if (!message.trim()) {
            setStatus("Please enter your question.");
            return;
        }

        setLoading(true);
        setStatus("");

        try {

            await api.post("/inquiries", {
                dentistId: Number(selected),
                message: message.trim()
            });

            setMessage("");
            setSelected("");

            setStatus(
                "✓ Inquiry sent and saved successfully."
            );

            load();

        } catch (e) {

            setStatus(
                e.response?.data?.message ||
                "Unable to send inquiry."
            );

        } finally {

            setLoading(false);

        }
    };


    /* =========================================================
       DENTIST REPLY
       ========================================================= */

    const answer = async (id) => {

        if (!reply[id]?.trim()) {

            setStatus(
                "Please enter a reply before sending."
            );

            return;
        }

        setLoading(true);

        try {

            await api.put(
                `/dentist/inquiries/${id}/reply`,
                {
                    reply: reply[id].trim()
                }
            );

            setStatus(
                "✓ Reply saved. Email delivery was attempted automatically."
            );

            setReply({
                ...reply,
                [id]: ""
            });

            load();

        } catch (e) {

            setStatus(
                e.response?.data?.message ||
                "Unable to send reply."
            );

        } finally {

            setLoading(false);
        }
    };


    return (

        <div className="app">


            {/* =====================================================
               HEADER
               ===================================================== */}

            <header className="page-header">

                <div className="page-header-title">

                    <span className="header-icon">
                        ✦
                    </span>

                    <span>
                        <b>
                        {patient
                            ? "ASK YOUR DENTIST"
                            : dentist
                                ? "PATIENT INQUIRIES"
                                : "DENTIST INQUIRIES"
                        }
                        </b>
                    </span>

                </div>


                <a
                    href="/dashboard"
                    className="header-dashboard-btn"
                >
                    Dashboard
                </a>

            </header>



            {/* =====================================================
               MAIN PAGE
               ===================================================== */}

            <main className="feature-page">


                {/* =================================================
                   PAGE INTRO
                   ================================================= */}

                <div className="feature-title">

                    <span>
                        SECURE DENTIST COMMUNICATION
                    </span>


                    <h1>

                        {patient
                            ? "Ask Your Dentist"
                            : dentist
                                ? "Patient Inquiries"
                                : "Patient Inquiry Management"
                        }

                    </h1>


                    <p>

                        {patient

                            ? "Have a question about your dental care? Send a private message directly to your dentist and receive a secure response."

                            : dentist

                                ? "Review patient questions related to their dental care and provide professional responses securely."

                                : "View patient inquiries and communication records to support efficient reception and front-desk services."
                        }

                    </p>

                </div>



                {/* =================================================
                   PATIENT - SEND QUESTION
                   ================================================= */}

                {patient && (

                    <div className="feature-card inquiry-form">

                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "15px",
                                marginBottom: "22px"
                            }}
                        >

                            <div
                                style={{
                                    width: "54px",
                                    height: "54px",
                                    borderRadius: "14px",
                                    background: "#eaf5fa",
                                    display: "grid",
                                    placeItems: "center",
                                    fontSize: "27px"
                                }}
                            >
                                💬
                            </div>


                            <div>

                                <span className="feature-kicker">
                                    PRIVATE MESSAGE
                                </span>

                                <h2
                                    style={{
                                        margin: "4px 0 0",
                                        color: "#173e5e"
                                    }}
                                >
                                    Contact Your Dentist
                                </h2>

                            </div>

                        </div>


                        <form onSubmit={send}>

                            {/* Dentist */}

                            <label>

                                Choose Dentist

                                <select
                                    required
                                    value={selected}
                                    onChange={e =>
                                        setSelected(e.target.value)
                                    }
                                >

                                    <option value="">
                                        Select a dentist
                                    </option>


                                    {d.map(x => (

                                        <option
                                            value={x.id}
                                            key={x.id}
                                        >
                                            Dr. {x.fullName}
                                            {" · "}
                                            {x.specialization}
                                        </option>

                                    ))}

                                </select>

                            </label>



                            {/* Question */}

                            <label>

                                Your Question

                                <textarea
                                    required
                                    maxLength={1500}
                                    value={message}
                                    onChange={e =>
                                        setMessage(e.target.value)
                                    }
                                    placeholder="Please describe your question or concern about your dental treatment..."
                                />

                            </label>


                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    gap: "15px",
                                    flexWrap: "wrap"
                                }}
                            >

                                <small
                                    style={{
                                        color: "#8799a5"
                                    }}
                                >
                                    {message.length}/1500 characters
                                </small>


                                <button
                                    type="submit"
                                    className="feature-button"
                                    disabled={loading}
                                >

                                    {loading
                                        ? "Sending..."
                                        : "✉ Send Inquiry"
                                    }

                                </button>

                            </div>


                            {status && (

                                <p className="feature-message">
                                    {status}
                                </p>

                            )}

                        </form>

                    </div>

                )}



                {/* =================================================
                   INFORMATION CARDS
                   ================================================= */}

                {patient && (

                    <div className="feature-grid three">

                        <div className="feature-card">

                            <span>
                                PRIVATE
                            </span>

                            <h3>
                                🔐 Secure Communication
                            </h3>

                            <p>
                                Your inquiry is associated with your
                                authenticated patient account and stored
                                securely in the clinic system.
                            </p>

                        </div>


                        <div className="feature-card">

                            <span>
                                DIRECT
                            </span>

                            <h3>
                                🦷 Your Dentist
                            </h3>

                            <p>
                                Send your question directly to the dentist
                                responsible for your dental care.
                            </p>

                        </div>


                        <div className="feature-card">

                            <span>
                                EMAIL
                            </span>

                            <h3>
                                ✉ Response Notification
                            </h3>

                            <p>
                                Dentist responses are stored in the system
                                and email delivery is attempted automatically.
                            </p>

                        </div>

                    </div>

                )}



                {/* =================================================
                   STATUS MESSAGE
                   ================================================= */}

                {status && !patient && (

                    <div className="feature-message">
                        {status}
                    </div>

                )}



                {/* =================================================
                   INQUIRY HISTORY
                   ================================================= */}

                <div
                    className="feature-title"
                    style={{
                        marginTop: "38px",
                        marginBottom: "10px"
                    }}
                >

                    <span>
                        COMMUNICATION HISTORY
                    </span>

                    <h2>
                        {patient
                            ? "My Dentist Conversations"
                            : dentist
                                ? "Patient Questions"
                                : "Inquiry Records"
                        }
                    </h2>

                    <p>

                        {patient
                            ? "Review your previous questions and dentist responses."
                            : dentist
                                
                                
                        }

                    </p>

                </div>



                {/* =================================================
                   INQUIRY LIST
                   ================================================= */}

                <div className="inquiry-list">

                    {items.length > 0 ? (

                        items.map(x => (

                            <article
                                className="feature-card inquiry-item"
                                key={x.id}
                            >

                                {/* TOP */}

                                <div className="inquiry-meta">

                                    <span>
                                        {x.status || "OPEN"}
                                    </span>

                                    <small>
                                        {x.createdAt?.replace(
                                            "T",
                                            " "
                                        )}
                                    </small>

                                </div>



                                {/* PEOPLE */}

                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "13px",
                                        margin: "14px 0"
                                    }}
                                >

                                    <div
                                        style={{
                                            width: "45px",
                                            height: "45px",
                                            borderRadius: "50%",
                                            background: "#eaf4f9",
                                            display: "grid",
                                            placeItems: "center",
                                            fontSize: "21px"
                                        }}
                                    >
                                        {dentist
                                            ? "👤"
                                            : "🦷"
                                        }
                                    </div>


                                    <div>

                                        <h3
                                            style={{
                                                margin: 0
                                            }}
                                        >

                                            {x.patient?.fullName ||
                                                "Patient"}

                                        </h3>


                                        <small
                                            style={{
                                                color: "#81929f"
                                            }}
                                        >

                                            {x.dentist?.displayName
                                                ? ` ${x.dentist.displayName}`
                                                : "Dental Care Team"}

                                        </small>

                                    </div>

                                </div>



                                {/* QUESTION */}

                                <div
                                    style={{
                                        padding: "17px",
                                        background: "#f7fafc",
                                        borderRadius: "12px",
                                        borderLeft:
                                            "4px solid #76acc8"
                                    }}
                                >

                                    <small
                                        style={{
                                            color: "#718594",
                                            fontWeight: "800",
                                            textTransform: "uppercase",
                                            letterSpacing: "0.7px"
                                        }}
                                    >
                                        Patient Question
                                    </small>


                                    <p
                                        className="inquiry-question"
                                        style={{
                                            marginBottom: 0
                                        }}
                                    >
                                        {x.message}
                                    </p>

                                </div>



                                {/* REPLY */}

                                {x.reply ? (

                                    <div className="reply-box">

                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent:
                                                    "space-between",
                                                gap: "10px",
                                                alignItems: "center"
                                            }}
                                        >

                                            <b>
                                                ✓ Dentist Reply
                                            </b>

                                            <small>
                                                {x.repliedAt?.replace(
                                                    "T",
                                                    " "
                                                )}
                                            </small>

                                        </div>


                                        <p>
                                            {x.reply}
                                        </p>


                                        {x.emailSent !== false && (

                                            <span
                                                style={{
                                                    color: "#258051",
                                                    fontSize: "11px",
                                                    fontWeight: "800"
                                                }}
                                            >
                                                ✉ Email delivery attempted
                                            </span>

                                        )}

                                    </div>

                                ) : dentist ? (

                                    /* =================================================
                                       DENTIST REPLY
                                       ================================================= */

                                    <div className="reply-editor">

                                        <label
                                            style={{
                                                display: "block",
                                                marginBottom: "7px",
                                                color: "#405c70",
                                                fontWeight: "700",
                                                fontSize: "13px"
                                            }}
                                        >
                                            Reply to Patient
                                        </label>


                                        <textarea
                                            value={
                                                reply[x.id] || ""
                                            }
                                            onChange={e =>
                                                setReply({
                                                    ...reply,
                                                    [x.id]:
                                                        e.target.value
                                                })
                                            }
                                            placeholder="Write a professional response to the patient's question..."
                                        />


                                        <button
                                            type="button"
                                            className="feature-button"
                                            onClick={() =>
                                                answer(x.id)
                                            }
                                            disabled={loading}
                                        >

                                            {loading
                                                ? "Sending..."
                                                : "✉ Reply & Email Patient"
                                            }

                                        </button>

                                    </div>

                                ) : (

                                    <div
                                        style={{
                                            marginTop: "15px"
                                        }}
                                    >

                                        <span className="waiting">
                                            ⏳ Waiting for dentist response
                                        </span>

                                    </div>

                                )}

                            </article>

                        ))

                    ) : (

                        /* =================================================
                           EMPTY STATE
                           ================================================= */

                        <div className="feature-card">

                            <div
                                style={{
                                    textAlign: "center",
                                    padding: "40px 20px"
                                }}
                            >

                                <div
                                    style={{
                                        width: "75px",
                                        height: "75px",
                                        margin: "0 auto 18px",
                                        borderRadius: "50%",
                                        background: "#eaf4f9",
                                        display: "grid",
                                        placeItems: "center",
                                        fontSize: "34px"
                                    }}
                                >
                                    💬
                                </div>


                                <h2>
                                    No Inquiries Found
                                </h2>


                                <p>

                                    {patient
                                        ? "Your questions to dentists will appear here once you send your first inquiry."
                                        : "There are currently no patient inquiries to display."
                                    }

                                </p>

                            </div>

                        </div>

                    )}

                </div>



                

            </main>



           
        </div>
    );
}