import {useEffect,useState} from "react";
import api from "../services/api";
import {useAuth} from "../context/AuthContext";
import "../styles/AdvancedFeatures.css";

export default function Prescriptions(){

    const {user}=useAuth();

    const role=user?.role;

    const patient=role==="PATIENT";
    const dentist=role==="DENTIST";
    const staff=role==="RECEPTIONIST"||role==="ADMIN";

    const [items,setItems]=useState([]);
    const [apps,setApps]=useState([]);
    const [search,setSearch]=useState("");
    const [msg,setMsg]=useState("");

    const [form,setForm]=useState({
        diagnosis:"",
        medicines:"",
        instructions:""
    });

    const [disp,setDisp]=useState({});
    const [dispHistory,setDispHistory]=useState({});


    /* ================= LOAD DATA ================= */

    const load=async()=>{

        try{

            if(patient){

                const r=await api.get("/me/prescriptions");

                setItems(r.data||[]);

            }
            else if(dentist){

                const r=await api.get("/dentist/appointments");

                setApps(r.data||[]);

            }

        }catch(e){

            setMsg(
                e.response?.data?.message ||
                "Unable to load prescriptions."
            );

        }

    };


    useEffect(()=>{

        load();

    },[role]);


    /* ================= CREATE PRESCRIPTION ================= */

    const prescribe=async id=>{

        if(
            !form.diagnosis.trim() ||
            !form.medicines.trim()
        ){

            setMsg(
                "Please enter diagnosis and medicines before saving."
            );

            return;
        }

        try{

            await api.post(
                `/dentist/appointments/${id}/prescription`,
                form
            );

            setMsg(
                "Prescription saved successfully."
            );

            setForm({
                diagnosis:"",
                medicines:"",
                instructions:""
            });

            load();

        }catch(e){

            setMsg(
                e.response?.data?.message ||
                "Unable to save prescription."
            );

        }

    };


    /* ================= STAFF SEARCH ================= */

    const staffSearch=async()=>{

        if(!search.trim()){

            setMsg(
                "Enter the patient NIC / ID number."
            );

            return;
        }

        try{

            const r=await api.get(
                `/staff/patients/${encodeURIComponent(
                    search.trim()
                )}/prescriptions`
            );

            const rows = r.data || [];
            setItems(rows);
            const historyEntries = await Promise.all(rows.map(async p => {
                try {
                    const d = await api.get(`/staff/prescriptions/${p.id}/dispensations`);
                    return [p.id, d.data || []];
                } catch { return [p.id, []]; }
            }));
            setDispHistory(Object.fromEntries(historyEntries));
            setMsg(rows.length ? "Prescriptions loaded successfully." : "No prescriptions found for this patient.");

        }catch(e){

            setItems([]);

            setMsg(
                e.response?.data?.message ||
                "Patient not found."
            );

        }

    };


    /* ================= DISPENSE MEDICINE ================= */

    const dispense=async p=>{

        const x=disp[p.id];

        if(
            !x?.medicineName ||
            !x?.quantity
        ){

            setMsg(
                "Enter medicine name and quantity."
            );

            return;
        }

        try{
            const existing = (dispHistory[p.id] || []).some(m => String(m.medicineName || "").trim().toLowerCase() === String(x.medicineName).trim().toLowerCase());
            if (existing) {
                setMsg("This medicine has already been recorded for this prescription.");
                return;
            }

            await api.post(
                `/staff/prescriptions/${p.id}/dispense`,
                x
            );

            setMsg(
                "Medicine dispensation recorded successfully."
            );

            setDisp({ ...disp, [p.id]:{} });
            const refreshed = await api.get(`/staff/prescriptions/${p.id}/dispensations`);
            setDispHistory(h => ({ ...h, [p.id]: refreshed.data || [] }));

        }catch(e){

            setMsg(
                e.response?.data?.message ||
                "Unable to record dispensation."
            );

        }

    };


    return (

        <div className="app">


            {/* =================================================
                PROFESSIONAL SUNRISE DENTAL HEADER
            ================================================= */}

            <header>

                <div className="header-brand">

                    <span className="header-icon">
                        ✦
                    </span>

                    <b>
                        PRESCRIPTIONS
                    </b>

                </div>


                <a
                    href="/dashboard"
                    className="dashboard-button"
                >
                    Dashboard
                </a>

            </header>


            {/* =================================================
                MAIN CONTENT
            ================================================= */}

            <main>

                <div className="feature-page">


                    {/* ================= PAGE TITLE ================= */}

                    <div className="feature-title">

                        <span>
                            CLINICAL PRESCRIPTIONS
                        </span>

                        <h1>

                            {patient
                                ?"My Prescriptions"
                                :dentist
                                    ?"Prescribe for Your Patients"
                                    :"Prescription & Medicine Desk"
                            }

                        </h1>


                        <p>

                            {patient

                                ?"View prescriptions issued by your dentists, including diagnosis, medicines and treatment instructions."

                                :dentist

                                    ?"Create and securely manage prescriptions for appointments assigned to you."

                                    :"Search patient prescriptions by NIC / ID, review dentist instructions and record medicines physically provided at reception."
                            }

                        </p>

                    </div>


                    {/* =================================================
                        DENTIST PRESCRIPTION EDITOR
                    ================================================= */}

                    {dentist && (

                        <>

                            <div className="section-heading">

                                <div>

                                    <span className="feature-kicker">
                                        DENTIST WORKSPACE
                                    </span>

                                    <h2>
                                        Patient Prescriptions
                                    </h2>

                                    <p>
                                        Select an appointment and enter the clinical prescription details.
                                    </p>

                                </div>

                            </div>


                            <div className="prescription-grid">

                                {apps.length ? (

                                    apps.map(a=>(

                                        <article
                                            className="feature-card prescription-editor"
                                            key={a.id}
                                        >


                                            {/* APPOINTMENT HEADER */}

                                            <div className="prescription-head">

                                                <div>

                                                    <b>
                                                        {a.appointmentNumber}
                                                    </b>

                                                    <h3>
                                                        {a.patient?.fullName ||
                                                            "Patient"}
                                                    </h3>

                                                    <small>

                                                        {a.appointmentDateTime?.replace(
                                                            "T",
                                                            " "
                                                        )}

                                                        {" · "}

                                                        {a.treatment?.name ||
                                                            "Dental Treatment"}

                                                    </small>

                                                </div>


                                                <span className="status-pill booked">

                                                    {a.status}

                                                </span>

                                            </div>


                                            {/* PATIENT INFORMATION */}

                                            <div className="clinical-patient-info">

                                                <div>

                                                    <span>
                                                        Patient ID
                                                    </span>

                                                    <strong>
                                                        {a.patient?.idNumber ||
                                                            "Protected"}
                                                    </strong>

                                                </div>


                                                <div>

                                                    <span>
                                                        Treatment
                                                    </span>

                                                    <strong>
                                                        {a.treatment?.name ||
                                                            "Dental Treatment"}
                                                    </strong>

                                                </div>

                                            </div>


                                            {/* DIAGNOSIS */}

                                            <label className="clinical-field">

                                                Diagnosis

                                                <input

                                                    placeholder="Enter clinical diagnosis"

                                                    value={
                                                        form.appointmentId===a.id
                                                        ?form.diagnosis
                                                        :""
                                                    }

                                                    onChange={e=>

                                                        setForm({

                                                            ...form,

                                                            appointmentId:a.id,

                                                            diagnosis:
                                                                e.target.value

                                                        })

                                                    }

                                                />

                                            </label>


                                            {/* MEDICINES */}

                                            <label className="clinical-field">

                                                Medicines

                                                <textarea

                                                    placeholder="Example: Amoxicillin 500mg — 1 capsule 3 times daily"

                                                    value={
                                                        form.appointmentId===a.id
                                                        ?form.medicines
                                                        :""
                                                    }

                                                    onChange={e=>

                                                        setForm({

                                                            ...form,

                                                            appointmentId:a.id,

                                                            medicines:
                                                                e.target.value

                                                        })

                                                    }

                                                />

                                            </label>


                                            {/* INSTRUCTIONS */}

                                            <label className="clinical-field">

                                                Instructions & Precautions

                                                <textarea

                                                    placeholder="Enter dosage instructions, precautions or follow-up advice"

                                                    value={
                                                        form.appointmentId===a.id
                                                        ?form.instructions
                                                        :""
                                                    }

                                                    onChange={e=>

                                                        setForm({

                                                            ...form,

                                                            appointmentId:a.id,

                                                            instructions:
                                                                e.target.value

                                                        })

                                                    }

                                                />

                                            </label>


                                            <button
                                                className="feature-button"
                                                onClick={()=>
                                                    prescribe(a.id)
                                                }
                                            >

                                                Save Prescription

                                            </button>

                                        </article>

                                    ))

                                ) : (

                                    <div className="feature-card">

                                        <h2>
                                            No Appointments Available
                                        </h2>

                                        <p>
                                            Appointments assigned to you will appear here so that prescriptions can be created.
                                        </p>

                                    </div>

                                )}

                            </div>

                        </>

                    )}


                    {/* =================================================
                        STAFF SEARCH
                    ================================================= */}

                    {staff && (

                        <div className="feature-card lookup-card">

                            <div>

                                <span className="feature-kicker">
                                    RECEPTION & PATIENT MANAGEMENT
                                </span>

                                <h2>
                                    Patient Prescription Search
                                </h2>

                                <p>
                                    Search using the patient's NIC or registered patient ID to securely review prescriptions.
                                </p>

                            </div>


                            <div className="feature-inline">

                                <input

                                    placeholder="Enter patient NIC / ID"

                                    value={search}

                                    onChange={
                                        e=>setSearch(
                                            e.target.value
                                        )
                                    }

                                    onKeyDown={e=>{

                                        if(e.key==="Enter"){
                                            staffSearch();
                                        }

                                    }}

                                />


                                <button
                                    className="feature-button"
                                    onClick={staffSearch}
                                >

                                    Find Prescriptions

                                </button>

                            </div>

                        </div>

                    )}


                    {/* =================================================
                        STATUS MESSAGE
                    ================================================= */}

                    {msg && (

                        <div className="feature-message">

                            {msg}

                        </div>

                    )}


                    {/* =================================================
                        PATIENT / STAFF PRESCRIPTIONS
                    ================================================= */}

                    {(patient||staff) && (

                        <div className="prescription-grid">

                            {items.length ? (

                                items.map(p=>(

                                    <article
                                        className="feature-card prescription-card"
                                        key={p.id}
                                    >


                                        {/* PRESCRIPTION HEADER */}

                                        <div className="prescription-head">

                                            <div>

                                                <span>
                                                    PRESCRIPTION #{p.id}
                                                </span>

                                                <h2>
                                                    {p.patient?.fullName ||
                                                        "Patient"}
                                                </h2>

                                                <small>

                                                    {p.prescribedAt?.replace(
                                                        "T",
                                                        " "
                                                    )}

                                                </small>

                                            </div>


                                            <b>

                                                {" "}
                                                {p.dentist?.displayName ||
                                                    "Dentist"}

                                            </b>

                                        </div>


                                        {/* DIAGNOSIS */}

                                        <div className="rx-row">

                                            <span>
                                                Diagnosis
                                            </span>

                                            <strong>
                                                {p.diagnosis ||
                                                    "Not specified"}
                                            </strong>

                                        </div>


                                        {/* MEDICINES */}

                                        <div className="rx-row">

                                            <span>
                                                Medicines
                                            </span>

                                            <strong>
                                                {p.medicines ||
                                                    "No medicines specified"}
                                            </strong>

                                        </div>


                                        {/* INSTRUCTIONS */}

                                        <div className="rx-row">

                                            <span>
                                                Instructions
                                            </span>

                                            <strong>
                                                {p.instructions ||
                                                    "Follow dentist guidance."}
                                            </strong>

                                        </div>


                                        {/* =================================================
                                            STAFF MEDICINE DISPENSING
                                        ================================================= */}

                                        {staff && (

                                            <div className="dispense-box">

                                                <div className="dispense-heading">

                                                    <span className="feature-kicker">
                                                        RECEPTION DESK
                                                    </span>

                                                    <h3>
                                                        Medicine Provided
                                                    </h3>

                                                    <p>
                                                        Record the medicine physically supplied to the patient according to the dentist's prescription.
                                                    </p>

                                                </div>


                                                {(dispHistory[p.id] || []).length > 0 && (
                                                    <div className="dispense-history" style={{marginBottom:12}}>
                                                        <strong>Previously Provided</strong>
                                                        {(dispHistory[p.id] || []).map(m => <div key={m.id} style={{padding:"7px 0",borderBottom:"1px solid #eee"}}><b>{m.medicineName}</b> · {m.quantity}{m.batchNumber ? ` · Batch ${m.batchNumber}` : ""} <small> · {String(m.dispensedAt || "").replace("T", " ")}</small></div>)}
                                                    </div>
                                                )}

                                                <div className="dispense-grid">

                                                    <input

                                                        placeholder="Medicine name"

                                                        value={
                                                            disp[p.id]?.medicineName ||
                                                            ""
                                                        }

                                                        onChange={e=>

                                                            setDisp({

                                                                ...disp,

                                                                [p.id]:{

                                                                    ...disp[p.id],

                                                                    medicineName:
                                                                        e.target.value

                                                                }

                                                            })

                                                        }

                                                    />


                                                    <input

                                                        placeholder="Quantity"

                                                        value={
                                                            disp[p.id]?.quantity ||
                                                            ""
                                                        }

                                                        onChange={e=>

                                                            setDisp({

                                                                ...disp,

                                                                [p.id]:{

                                                                    ...disp[p.id],

                                                                    quantity:
                                                                        e.target.value

                                                                }

                                                            })

                                                        }

                                                    />


                                                    <input

                                                        placeholder="Batch number (optional)"

                                                        value={
                                                            disp[p.id]?.batchNumber ||
                                                            ""
                                                        }

                                                        onChange={e=>

                                                            setDisp({

                                                                ...disp,

                                                                [p.id]:{

                                                                    ...disp[p.id],

                                                                    batchNumber:
                                                                        e.target.value

                                                                }

                                                            })

                                                        }

                                                    />

                                                </div>


                                                <textarea

                                                    placeholder="Dispensing notes"

                                                    value={
                                                        disp[p.id]?.notes ||
                                                        ""
                                                    }

                                                    onChange={e=>

                                                        setDisp({

                                                            ...disp,

                                                            [p.id]:{

                                                                ...disp[p.id],

                                                                notes:
                                                                    e.target.value

                                                            }

                                                        })

                                                    }

                                                />


                                                <button
                                                    className="feature-button"
                                                    onClick={()=>
                                                        dispense(p)
                                                    }
                                                >

                                                    ✓ Record Medicine Provided

                                                </button>

                                            </div>

                                        )}

                                    </article>

                                ))

                            ) : (

                                <div className="feature-card no-updates-card">

                                    <div className="no-updates-icon">
                                        💊
                                    </div>

                                    <h2>
                                        No Prescriptions Found
                                    </h2>

                                    <p>

                                        {staff

                                            ?"Search using a patient NIC / ID number to view their prescriptions."

                                            :"Prescriptions issued by your dentist will appear here."
                                        }

                                    </p>

                                </div>

                            )}

                        </div>

                    )}


                    
                </div>

            </main>

        </div>

    );

}