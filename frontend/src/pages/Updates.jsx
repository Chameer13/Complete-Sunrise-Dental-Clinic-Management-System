import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import '../styles/AdvancedFeatures.css';

export default function Updates() {

    const { user } = useAuth();

    const staff =
        user?.role === 'RECEPTIONIST' ||
        user?.role === 'ADMIN';

    const dentist =
        user?.role === 'DENTIST';

    const [id, setId] = useState('');
    const [u, setU] = useState([]);
    const [s, setS] = useState('');
    const [reply, setReply] = useState({});


    /* =====================================================
       LOAD UPDATES / DENTIST INQUIRIES
       ===================================================== */

    const load = async () => {

        try {

            if (dentist) {

                const x = await api.get('/dentist/inquiries');

                setU(x.data || []);

                setS(
                    x.data?.length
                        ? 'Patient messages loaded.'
                        : 'No patient messages have been received.'
                );

            } else if (!staff) {

                const x = await api.get('/me/updates');

                setU(x.data || []);

                setS(
                    x.data?.length
                        ? 'Your latest dentist updates are shown below.'
                        : 'No dentist updates have been recorded for your appointments.'
                );
            }

        } catch (e) {

            setS(
                e.response?.data?.message ||
                'Could not load updates.'
            );
        }
    };


    useEffect(() => {

        if (!staff) {
            load();
        }

    }, [staff, dentist]);


    /* =====================================================
       STAFF - FIND PATIENT UPDATES
       ===================================================== */

    const find = async () => {

        if (!id.trim()) {

            setS('Enter the patient NIC/ID number.');
            return;
        }

        try {

            const x = await api.get(
                '/patients/' +
                encodeURIComponent(id.trim()) +
                '/updates'
            );

            setU(x.data || []);

            setS(
                x.data?.length
                    ? 'Updates loaded.'
                    : 'No updates found.'
            );

        } catch (e) {

            setS(
                e.response?.data?.message ||
                'Could not load updates.'
            );
        }
    };


    /* =====================================================
       DENTIST - REPLY TO PATIENT
       ===================================================== */

    const answer = async (x) => {

        if (!reply[x.id]?.trim()) {

            setS('Please enter a reply before sending.');
            return;
        }

        try {

            await api.put(
                '/dentist/inquiries/' +
                x.id +
                '/reply',
                {
                    reply: reply[x.id]
                }
            );

            setReply({
                ...reply,
                [x.id]: ''
            });

            setS(
                'Reply saved and email delivery was attempted automatically.'
            );

            load();

        } catch (e) {

            setS(
                e.response?.data?.message ||
                'Could not send reply.'
            );
        }
    };


    /* =====================================================
       PAGE TITLE
       ===================================================== */

    const pageTitle = dentist
        ? 'PATIENT COMMUNICATION'
        : 'DENTIST UPDATES';


    return (

        <div className="app">

            {/* =================================================
               COMMON SUNRISE DENTAL HEADER
               ================================================= */}

            <header className="page-header">

                <div className="page-header-title">

                    <span className="header-icon">
                        ✦
                    </span>

                    <span>
                        <b>
                        {pageTitle}
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


            {/* =================================================
               MAIN CONTENT
               ================================================= */}

            <main className="feature-page">


                {/* =================================================
                   PAGE INTRODUCTION
                   ================================================= */}

                <div className="feature-title">

                    <span>
                        {dentist
                            ? 'DENTIST COMMUNICATION'
                            : staff
                                ? 'RECEPTION & PATIENT MANAGEMENT'
                                : 'PATIENT COMMUNICATION'
                        }
                    </span>


                    <h1>

                        {dentist
                            ? 'Patient Updates & Inquiries'
                            : staff
                                ? 'Dentist Appointment Updates'
                                : 'My Appointment Updates'
                        }

                    </h1>


                    <p>

                        {dentist

                            ? 'Review patient messages related to their appointments and provide secure responses. Your replies are securely stored in the clinic system and email delivery is attempted automatically.'

                            : staff

                                ? 'Search a patient using their NIC or registered patient ID to view dentist-created appointment updates. Reception staff can view these messages but cannot create or edit them.'

                                : 'View important messages and appointment updates sent to you by your dentists through the Sunrise Dental Clinic.'
                        }

                    </p>

                </div>



                {/* =================================================
                   STAFF PATIENT SEARCH
                   ================================================= */}

                {staff && (

                    <div className="feature-card lookup-card">

                        <span className="feature-kicker">
                            PATIENT SEARCH
                        </span>

                        <h2>
                            Find Patient Updates
                        </h2>

                        <p>
                            Enter the patient's NIC or registered patient ID
                            to securely retrieve their dentist updates.
                        </p>


                        <div className="feature-inline">

                            <input
                                type="text"
                                placeholder="Patient NIC / ID"
                                value={id}
                                onChange={(e) =>
                                    setId(e.target.value)
                                }
                            />


                            <button
                                className="feature-button"
                                onClick={find}
                            >
                                🔎 View Updates
                            </button>

                        </div>

                    </div>

                )}



                {/* =================================================
                   SYSTEM MESSAGE
                   ================================================= */}

                {s && (

                    <div className="feature-message">

                        {s}

                    </div>

                )}



                {/* =================================================
                   DENTIST / PATIENT UPDATE LIST
                   ================================================= */}

                <div className="inquiry-list">


                    {u.length === 0 && (

                        <div className="feature-card">

                            <div
                                style={{
                                    textAlign: 'center',
                                    padding: '35px 20px'
                                }}
                            >

                                <div
                                    style={{
                                        fontSize: '48px',
                                        marginBottom: '12px'
                                    }}
                                >
                                    💬
                                </div>

                                <h2>
                                    No Updates Available
                                </h2>

                                <p>
                                    There are currently no appointment
                                    updates or patient messages to display.
                                </p>

                            </div>

                        </div>

                    )}



                    {u.map(x => dentist ? (

                        /* =================================================
                           DENTIST INQUIRY CARD
                           ================================================= */

                        <article
                            className="feature-card inquiry-item"
                            key={x.id}
                        >

                            <div className="inquiry-meta">

                                <span>
                                    {x.status || 'OPEN'}
                                </span>

                                <small>
                                    {x.createdAt?.replace('T', ' ')}
                                </small>

                            </div>


                            <h3>

                                {x.patient?.fullName || 'Patient'}

                                <small>
                                    {' · '}
                                    {x.patient?.idNumber ||
                                        'NIC protected'}
                                </small>

                            </h3>


                            <p className="inquiry-question">

                                {x.message}

                            </p>



                            {/* EXISTING REPLY */}

                            {x.reply ? (

                                <div className="reply-box">

                                    <b>
                                        ✓ Your Previous Reply
                                    </b>

                                    <p>
                                        {x.reply}
                                    </p>

                                </div>

                            ) : (

                                /* =================================================
                                   DENTIST REPLY AREA
                                   ================================================= */

                                <div className="reply-editor">

                                    <textarea
                                        value={
                                            reply[x.id] || ''
                                        }
                                        onChange={(e) =>
                                            setReply({
                                                ...reply,
                                                [x.id]: e.target.value
                                            })
                                        }
                                        placeholder="Write a professional reply to the patient..."
                                    />


                                    <button
                                        className="feature-button"
                                        onClick={() =>
                                            answer(x)
                                        }
                                    >
                                        ✉ Reply & Email Patient
                                    </button>

                                </div>

                            )}

                        </article>

                    ) : (

                        /* =================================================
                           PATIENT / STAFF UPDATE CARD
                           ================================================= */

                        <article
                            className="feature-card inquiry-item"
                            key={x.id}
                        >

                            <div className="inquiry-meta">

                                <span>

                                    {x.appointment?.appointmentNumber ||
                                        'APPOINTMENT UPDATE'}

                                </span>


                                <small>

                                    {x.createdAt?.replace(
                                        'T',
                                        ' '
                                    )}

                                </small>

                            </div>


                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    marginBottom: '10px'
                                }}
                            >

                                <div
                                    style={{
                                        width: '42px',
                                        height: '42px',
                                        borderRadius: '50%',
                                        background: '#eaf4f9',
                                        display: 'grid',
                                        placeItems: 'center',
                                        fontSize: '20px'
                                    }}
                                >
                                    🦷
                                </div>


                                <div>

                                    <strong
                                        style={{
                                            color: '#173e5e'
                                        }}
                                    >
                                        Dentist Appointment Update
                                    </strong>

                                    <small
                                        style={{
                                            display: 'block',
                                            color: '#8799a5',
                                            marginTop: '3px'
                                        }}
                                    >
                                        Sunrise Dental Clinic
                                    </small>

                                </div>

                            </div>


                            <p>
                                {x.message}
                            </p>


                            <span className="waiting">

                                {x.emailSent
                                    ? '✓ Email sent to patient'
                                    : 'System update only'}

                            </span>

                        </article>

                    ))}

                </div>


                

                    
              


            </main>


           

        </div>
    );
}