import{Link,useNavigate}from'react-router-dom';import{useAuth}from'../context/AuthContext';
import{useEffect,useState}from'react';import api from'../services/api';

export default function Dashboard(){
 const{user,logout}=useAuth();const nav=useNavigate();const[appointments,setAppointments]=useState([]);
 const out=()=>{logout();nav('/login')};
 const isPatient=user.role==='PATIENT';
 useEffect(()=>{if(isPatient)api.get('/me/appointments').then(x=>setAppointments(x.data)).catch(()=>{});},[isPatient]);

 const links=user.role==='DENTIST'?['/dentist','/updates']:isPatient?['/patients','/appointments','/updates']:['/patients','/appointments','/billing','/updates'];
 const labels=isPatient?['My Profile','Book Appointment','Appointment Updates']:user.role==='DENTIST'?['My Appointments','Patient Updates']:['Patients','Appointments','Billing','Updates'];

 return <div className="app"><header><b>✦ SUNRISE DENTAL</b><span>{user.fullName} · {user.role}<button onClick={out}>Logout</button></span></header><main>
   <h1>{isPatient?'Welcome to Sunrise Dental Clinic':user.role==='DENTIST'?'Dentist Portal':'Clinic Management Dashboard'}</h1>
   <p>{isPatient?'Manage your dental profile, book appointments, view your appointment history and stay informed about clinic updates.':'Manage clinic patients, appointments, treatment services, billing and appointment communication from one place.'}</p>
   <div className="tiles">{links.map((x,i)=><Link key={x} to={x}>{labels[i]||x}</Link>)}</div>
   {isPatient&&<section className="panel"><h2>My Appointment Overview</h2>
    {appointments.length?<div className="patient-dashboard-list">{appointments.slice(0,3).map(x=><div className="patient-dashboard-item" key={x.id}><div><b>{x.treatment?.name}</b><small>{x.appointmentNumber}</small></div><div><b>{x.appointmentDateTime?.replace('T',' ')}</b><small>{x.dentist?.registrationNumber||'Assigned dentist'}</small></div><span>{x.status}</span></div>)}</div>:<p>You do not have any appointments yet. Select <b>Book Appointment</b> to schedule your first visit.</p>}
    {appointments.length>3&&<Link className="history-link" to="/appointments">View complete appointment history</Link>}
   </section>}
   {!isPatient&&<section className="panel"><h2>Clinic Operations</h2><ul><li>Manage patient profiles and clinical information.</li><li>Schedule appointments using dentist availability and 15-minute time slots.</li><li>Track appointment status and dentist updates.</li><li>Create appointment-linked bills and record payments.</li><li>Send appointment updates and payment receipts by email.</li></ul></section>}
 </main></div>
}
