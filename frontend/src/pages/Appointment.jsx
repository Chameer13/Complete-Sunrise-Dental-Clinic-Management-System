import{useEffect,useState}from'react';import{useNavigate}from'react-router-dom';import api from'../services/api';import{useAuth}from'../context/AuthContext';

export default function Appointment(){
 const{user}=useAuth();const nav=useNavigate();
 const[f,setF]=useState({patientIdNumber:'',dentistId:'',treatmentId:'',appointmentDateTime:'',patientNote:''});
 const[d,setD]=useState([]),[t,setT]=useState([]),[list,setList]=useState([]),[s,setS]=useState(''),[loading,setLoading]=useState(false);
 const minDateTime=()=>{const d=new Date(Date.now()+15*60000);d.setSeconds(0,0);return new Date(d.getTime()-d.getTimezoneOffset()*60000).toISOString().slice(0,16)};
 useEffect(()=>{api.get('/dentists').then(x=>setD(x.data)).catch(()=>setS('Unable to load dentists.'));api.get('/treatments').then(x=>setT(x.data)).catch(()=>setS('Unable to load treatments.'));
   if(user.role==='PATIENT'){api.get('/me/patient').then(x=>setF(z=>({...z,patientIdNumber:x.data?.idNumber||''})));api.get('/me/appointments').then(x=>setList(x.data)).catch(()=>{});}
 },[user]);
 const book=async e=>{e.preventDefault();setS('');setLoading(true);try{const x=await api.post('/appointments',f);setS('Appointment reserved successfully.');setList(z=>[x.data,...z]);nav('/payment/'+x.data.id);}catch(e){setS(e.response?.data?.message||'Booking failed. Please try another time.')}finally{setLoading(false)}};
 return <div className="app"><header><b>✦ APPOINTMENTS</b><a href="/dashboard">Dashboard</a></header><main><div className="panel"><h1>Book an Appointment</h1><p>Choose your preferred dentist, treatment and a 15-minute appointment slot. Your booking will be checked against the dentist's existing schedule.</p>
 <form className="formgrid" onSubmit={book}>
  <label>Patient ID/NIC<input required disabled={user.role==='PATIENT'} value={f.patientIdNumber} onChange={e=>setF({...f,patientIdNumber:e.target.value})}/></label>
  <label>Dentist<select required value={f.dentistId} onChange={e=>setF({...f,dentistId:e.target.value})}><option value="">Select your dentist</option>{d.map(x=><option value={x.id} key={x.id}>{x.fullName} · {x.specialization}</option>)}</select></label>
  <label>Treatment<select required value={f.treatmentId} onChange={e=>setF({...f,treatmentId:e.target.value})}><option value="">Select treatment</option>{t.map(x=><option value={x.id} key={x.id}>{x.name} · Rs. {Number(x.defaultPrice).toLocaleString()}</option>)}</select></label>
  <label>Date & Time<input required type="datetime-local" min={minDateTime()} value={f.appointmentDateTime} onChange={e=>setF({...f,appointmentDateTime:e.target.value})}/></label>
  <label>Additional note<textarea placeholder="Tell the clinic anything important about this visit..." value={f.patientNote} onChange={e=>setF({...f,patientNote:e.target.value})}/></label>
  <button disabled={loading}>{loading?'Checking availability...':'Book Appointment & Continue to Payment'}</button>
 </form><p>{s}</p></div>
 {user.role==='PATIENT'&&<div className="panel appointment-history"><h1>My Appointment History</h1>{list.length?<div className="history-table">{list.map(x=><div className="history-row" key={x.id}><div><b>{x.treatment?.name}</b><small>{x.appointmentNumber}</small></div><div>{x.appointmentDateTime?.replace('T',' ')}</div><div>{x.dentist?.registrationNumber||'Dentist'}</div><span>{x.status}</span></div>)}</div>:<p>Your booked appointments will appear here.</p>}</div>}
 </main></div>
}
