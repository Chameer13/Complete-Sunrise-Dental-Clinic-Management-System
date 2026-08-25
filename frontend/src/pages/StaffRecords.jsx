import{useState}from'react';
import{useNavigate}from'react-router-dom';
import api from'../services/api';

export default function StaffRecords(){
 const nav=useNavigate();
 const[id,setId]=useState('');const[data,setData]=useState([]);const[updates,setUpdates]=useState([]);const[patient,setPatient]=useState(null);const[s,setS]=useState('');const[loading,setLoading]=useState(false);
 const downloadReceipt=async paymentId=>{try{const r=await api.get('/payments/'+paymentId+'/receipt',{responseType:'blob'});const url=URL.createObjectURL(r.data);const a=document.createElement('a');a.href=url;a.download='Sunrise-Dental-Receipt.pdf';a.click();URL.revokeObjectURL(url)}catch(e){setS('Unable to download the receipt.')}};
 const find=async e=>{e?.preventDefault();if(!id.trim()){setS('Enter the patient NIC/ID number.');return}setLoading(true);setS('');try{const[p,f,u]=await Promise.all([api.get('/patients/'+encodeURIComponent(id.trim())),api.get('/staff/patients/'+encodeURIComponent(id.trim())+'/financials'),api.get('/patients/'+encodeURIComponent(id.trim())+'/updates')]);setPatient(p.data);setData(f.data);setUpdates(u.data);if(!f.data.length)setS('No appointment records found for this patient.');}catch(e){setPatient(null);setData([]);setUpdates([]);setS(e.response?.data?.message||'Patient record could not be loaded.')}finally{setLoading(false)}};
 return <div className="app"><header><b>✦ PATIENT RECORDS</b><a href="/dashboard">Dashboard</a></header><main>
  <div className="panel"><h1>Patient Search & Records</h1><p>Search by NIC/ID to review the patient's profile, appointment history, payment status and dentist updates.</p>
   <form className="lookup" onSubmit={find}><input required placeholder="Enter patient NIC / ID number" value={id} onChange={e=>setId(e.target.value)}/><button disabled={loading}>{loading?'Searching...':'Find Patient'}</button></form><p>{s}</p>
  </div>
  {patient&&<><div className="panel staff-patient-card"><div><span>Patient</span><b>{patient.fullName}</b></div><div><span>NIC / ID</span><b>{patient.idNumber}</b></div><div><span>Contact</span><b>{patient.contactNumber}</b></div><div><span>Email</span><b>{patient.email||'Not provided'}</b></div></div>
  <div className="panel"><div className="panel-heading-row"><div><h2>Appointment & Payment Status</h2><p>Reception staff can collect payment for any appointment that is still unpaid.</p></div></div>
   {data.length?<div className="staff-records">{data.map(x=><div className="staff-record" key={x.appointmentId}><div><b>{x.appointmentNumber}</b><small>{String(x.appointmentDateTime||'').replace('T',' ')}</small></div><div><b>{x.treatmentName}</b><small>{x.dentistName}</small></div><div><b>Rs. {Number(x.totalAmount).toLocaleString(undefined,{minimumFractionDigits:2})}</b><small>Paid: Rs. {Number(x.paidAmount).toLocaleString(undefined,{minimumFractionDigits:2})}</small></div><span className={'payment-status '+String(x.paymentStatus).toLowerCase()}>{x.paymentStatus==='PAID'?'Paid':'Payment Pending'}</span>{x.paymentStatus!=='PAID'?<button onClick={()=>nav('/staff/payment/'+x.appointmentId)}>Collect Payment</button>:<div className="paid-actions"><span className="paid-method">{x.paymentMethod||'Paid'}</span>{x.paymentId&&<button className="receipt-mini" onClick={()=>downloadReceipt(x.paymentId)}>Receipt</button>}</div>}</div>)}</div>:<p>No appointments are associated with this patient yet.</p>}
  </div>
  <div className="panel"><h2>Dentist Updates</h2><p>Updates are created by dentists. Reception staff can view them but cannot edit them.</p>{updates.length?<div className="staff-updates">{updates.map(x=><article key={x.id}><div><b>{x.appointment?.appointmentNumber}</b><small>{x.createdAt}</small></div><p>{x.message}</p><span>{x.emailSent?'Email sent to patient':'System update only'}</span></article>)}</div>:<p>No dentist updates have been recorded for this patient.</p>}</div></>}
 </main></div>
}
