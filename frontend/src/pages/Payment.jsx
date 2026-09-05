import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";


export default function Payment() {
    const { appointmentId } = useParams();
    const nav = useNavigate();
    const { user } = useAuth();
    const staff = user?.role === "RECEPTIONIST" || user?.role === "ADMIN";
    const [records, setRecords] = useState([]);
    const [p, setP] = useState(null);
    const [method, setMethod] = useState("CASH");
    const [card, setCard] = useState({ name: "", number: "", expiry: "", cvv: "" });
    const [s, setS] = useState("");
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(null);

    const loadRecords = async () => {
        if (staff || !user) return;
        try {
            const r = await api.get("/me/payment-status");
            setRecords(r.data || []);
        } catch (e) {
            setS(e.response?.data?.message || "Unable to load your appointment payments.");
        }
    };

    useEffect(() => {
        loadRecords();
        if (appointmentId) {
            api.get(`/appointments/${appointmentId}/billing-preview`)
                .then(x => setP(x.data))
                .catch(e => setS(e.response?.data?.message || "Unable to load appointment billing details."));
        }
    }, [appointmentId, user?.role]);

    const pay = async e => {
        e.preventDefault();
        setS("");
        if (method === "CARD") {
            if (card.name.trim().length < 2 || !/^[0-9]{16}$/.test(card.number.replace(/\s/g, "")) || !/^[0-9]{2}\/([0-9]{2})$/.test(card.expiry) || !/^[0-9]{3,4}$/.test(card.cvv)) {
                setS("Please enter valid card details. Full card number and CVV are not stored.");
                return;
            }
        }
        setLoading(true);
        try {
            const endpoint = staff ? "/staff/payments" : "/payments";
            const x = await api.post(endpoint, {
                appointmentId: Number(appointmentId), paymentMethod: method,
                cardholderName: method === "CARD" ? card.name : null,
                cardLast4: method === "CARD" ? card.number.replace(/\s/g, "").slice(-4) : null
            });
            setDone(x.data);
            await loadRecords();
        } catch (e) {
            setS(e.response?.data?.message || "Payment could not be completed.");
        } finally { setLoading(false); }
    };

    const download = async paymentId => {
        try {
            const r = await api.get(`/payments/${paymentId}/receipt`, { responseType: "blob" });
            const url = URL.createObjectURL(r.data);
            const a = document.createElement("a"); a.href = url; a.download = "Sunrise-Dental-Receipt.pdf"; a.click(); URL.revokeObjectURL(url);
        } catch { setS("Unable to download receipt."); }
    };

    if (!appointmentId && !staff) return <div className="app"><header><b>✦ MY PAYMENTS</b><a href="/dashboard">Dashboard</a></header><main><div className="panel">
        <h1>Appointment Payments</h1>
        <p>View all your appointments and their payment status. If you left the payment page, select <b>Continue Payment</b> to finish it later.</p>
        {s && <p>{s}</p>}
        {!records.length ? <div className="feature-card"><h2>No appointments found</h2><p>Book an appointment first.</p><Link to="/appointments">Book Appointment</Link></div> : records.map(x => {
            const unpaid = x.paymentStatus !== "PAID";
            return <div key={x.appointmentId} className="feature-card" style={{marginTop:14}}>
                <div style={{display:"flex",justifyContent:"space-between",gap:16,alignItems:"center",flexWrap:"wrap"}}>
                    <div><span>APPOINTMENT</span><h2>{x.appointmentNumber}</h2><p>{String(x.appointmentDateTime).replace("T", " ")} · {x.treatmentName}</p></div>
                    <div><strong>Rs. {Number(x.totalAmount).toLocaleString(undefined,{minimumFractionDigits:2})}</strong><p>{unpaid ? "Payment Pending" : `Paid Rs. ${Number(x.paidAmount).toLocaleString(undefined,{minimumFractionDigits:2})}`}</p></div>
                    {unpaid ? <Link to={`/payment/${x.appointmentId}`}>Continue Payment</Link> : x.paymentId ? <button onClick={() => download(x.paymentId)}>Receipt</button> : null}
                </div>
            </div>;
        })}
    </div></main></div>;

    if (done) return <div className="app"><header><b>✦ PAYMENT CONFIRMED</b><a href="/dashboard">Dashboard</a></header><main><div className="panel payment-success"><div className="success-icon">✓</div><h1>Payment Successful</h1><p>{staff ? "The patient appointment payment has been recorded successfully." : "Your appointment payment has been recorded successfully."}</p><div className="receipt-summary"><div><span>Payment reference</span><b>{done.transactionReference}</b></div><div><span>Amount paid</span><b>Rs. {Number(done.amount).toLocaleString(undefined,{minimumFractionDigits:2})}</b></div><div><span>Payment method</span><b>{done.paymentMethod}</b></div></div><div className="payment-actions"><button onClick={() => download(done.id)}>Download PDF Receipt</button><button className="secondary" onClick={() => nav(staff ? "/staff/records" : "/payment")}>{staff ? "Return to Patient Records" : "View My Payments"}</button></div></div></main></div>;

    if (!p) return <div className="app"><header><b>✦ BILLING & PAYMENT</b><a href={staff ? "/staff/records" : "/payment"}>{staff ? "Patient Records" : "My Payments"}</a></header><main><div className="panel"><h1>Preparing your bill...</h1><p>{s}</p></div></main></div>;

    return <div className="app"><header><b>✦ {staff ? "RECEPTION PAYMENT" : "BILLING & PAYMENT"}</b><a href={staff ? "/staff/records" : "/payment"}>{staff ? "Patient Records" : "My Payments"}</a></header><main><div className="payment-layout"><section className="panel"><h1>{staff ? "Collect Appointment Payment" : "Appointment Payment"}</h1><p>Review the appointment charges before confirming the payment.</p><div className="bill-lines"><div><span>Appointment</span><b>{p.appointmentNumber}</b></div><div><span>Treatment</span><b>{p.treatmentName}</b></div><div><span>Treatment fee</span><b>Rs. {Number(p.treatmentFee).toLocaleString(undefined,{minimumFractionDigits:2})}</b></div><div><span>Consultation fee</span><b>Rs. {Number(p.consultationFee).toLocaleString(undefined,{minimumFractionDigits:2})}</b></div><div><span>Discount</span><b>- Rs. {Number(p.discount).toLocaleString(undefined,{minimumFractionDigits:2})}</b></div><div><span>Tax</span><b>Rs. {Number(p.tax).toLocaleString(undefined,{minimumFractionDigits:2})}</b></div><div className="bill-total"><span>Total</span><b>Rs. {Number(p.total).toLocaleString(undefined,{minimumFractionDigits:2})}</b></div></div></section><section className="panel"><h2>Payment Method</h2><div className="payment-methods"><button type="button" className={method==='CASH'?'selected':''} onClick={()=>setMethod('CASH')}>Cash</button><button type="button" className={method==='CARD'?'selected':''} onClick={()=>setMethod('CARD')}>Credit / Debit Card</button></div><form className="payment-form" onSubmit={pay}>{method==='CARD'&&<div className="card-form"><label>Cardholder name<input required value={card.name} onChange={e=>setCard({...card,name:e.target.value})} placeholder="Name on card"/></label><label>Card number<input required maxLength="19" inputMode="numeric" value={card.number} onChange={e=>setCard({...card,number:e.target.value.replace(/\D/g,'').slice(0,16).replace(/(.{4})/g,'$1 ').trim()})} placeholder="1234 5678 9012 3456"/></label><div className="card-row"><label>Expiry<input required maxLength="5" value={card.expiry} onChange={e=>{let v=e.target.value.replace(/\D/g,'').slice(0,4);if(v.length>2)v=v.slice(0,2)+'/'+v.slice(2);setCard({...card,expiry:v})}} placeholder="MM/YY"/></label><label>CVV<input required type="password" maxLength="4" inputMode="numeric" value={card.cvv} onChange={e=>setCard({...card,cvv:e.target.value.replace(/\D/g,'').slice(0,4)})} placeholder="•••"/></label></div><p className="security-note">Card details are used only for this payment interface. The clinic database stores only the last four digits.</p></div>}<button className="pay-button" disabled={loading}>{loading?'Processing payment...':method==='CARD'?'Pay Securely':'Confirm Cash Payment'}</button><p>{s}</p></form></section></div></main></div>;
}
