package com.sunrise.dental.service;

import com.sunrise.dental.dto.*;
import com.sunrise.dental.entity.*;
import com.sunrise.dental.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.*;
import java.time.*;
import java.util.*;

@Service
public class ClinicService {
 final PatientRepository patients; final UserRepository users; final DentistRepository dentists;
 final TreatmentRepository treatments; final AppointmentRepository appointments;
 final AppointmentUpdateRepository updates; final BillRepository bills;
 final PaymentTransactionRepository payments; final MailService mail; final ReceiptPdfService receipts;

 // Clinic billing rules. Keep these in one place so the frontend cannot alter the final amount.
 private static final BigDecimal CONSULTATION_FEE = new BigDecimal("1500.00");
 private static final BigDecimal TAX_RATE = new BigDecimal("0.05");
 private static final int APPOINTMENT_MINUTES = 15;

 public ClinicService(PatientRepository p,UserRepository u,DentistRepository d,TreatmentRepository t,
                      AppointmentRepository a,AppointmentUpdateRepository up,BillRepository b,
                      PaymentTransactionRepository pt,MailService m,ReceiptPdfService rp){
  patients=p;users=u;dentists=d;treatments=t;appointments=a;updates=up;bills=b;
  payments=pt;mail=m;receipts=rp;
 }

 private Patient findPatient(String id){
  return patients.findByIdNumberIgnoreCase(id.trim())
          .orElseThrow(()->new IllegalArgumentException("Patient ID number was not found."));
 }

 private Appointment findAppointment(Long id){
  return appointments.findById(id)
          .orElseThrow(()->new IllegalArgumentException("Appointment not found."));
 }

 private Patient patientForUser(Long userId){
  return patients.findByUserId(userId)
          .orElseThrow(()->new IllegalArgumentException("Please complete your patient profile before booking an appointment."));
 }

 private String dentistName(Dentist d){
  return d.getRegistrationNumber()+" - "+d.getSpecialization();
 }

 private String patientEmail(Patient p){
  return p.getUser()!=null && p.getUser().getEmail()!=null ? p.getUser().getEmail() : p.getEmail();
 }

 @Transactional
 public Patient createPatient(PatientRequest r,Long userId){
  if(patients.existsByIdNumberIgnoreCase(r.idNumber().trim()))
   throw new IllegalArgumentException("A patient with this ID number already exists.");
  Patient p=new Patient();
  p.setIdNumber(r.idNumber().trim().toUpperCase());
  p.setFullName(r.fullName().trim()); p.setAddress(r.address().trim());
  p.setContactNumber(r.contactNumber().trim()); p.setEmail(r.email());
  p.setGender(r.gender()); p.setDateOfBirth(r.dateOfBirth());
  p.setEmergencyContact(r.emergencyContact()); p.setAllergies(r.allergies());
  p.setMedicalNotes(r.medicalNotes());
  if(userId!=null)p.setUser(users.findById(userId).orElseThrow());
  return patients.save(p);
 }

 @Transactional
 public Patient updatePatient(String id,PatientRequest r){
  Patient p=findPatient(id);
  p.setFullName(r.fullName().trim()); p.setAddress(r.address().trim());
  p.setContactNumber(r.contactNumber().trim()); p.setEmail(r.email());
  p.setGender(r.gender()); p.setDateOfBirth(r.dateOfBirth());
  p.setEmergencyContact(r.emergencyContact()); p.setAllergies(r.allergies());
  p.setMedicalNotes(r.medicalNotes());
  return patients.save(p);
 }

 public Optional<Patient> lookup(String id){return patients.findByIdNumberIgnoreCase(id.trim());}
 public Optional<Patient> lookupByUserId(Long id){return patients.findByUserId(id);}
 public List<Treatment> treatments(){return treatments.findByActiveTrueOrderByNameAsc();}

 public List<DentistOption> dentistOptions(){
  return dentists.findAll().stream().filter(Dentist::isActive)
    .map(d->new DentistOption(d.getId(),
            d.getUser()!=null?d.getUser().getFullName():d.getRegistrationNumber(),
            d.getRegistrationNumber(),d.getSpecialization(),d.getQualifications()))
    .toList();
 }

 @Transactional
 public Appointment book(AppointmentRequest r, Long userId){
  User current=users.findById(userId).orElseThrow();
  Patient p=findPatient(r.patientIdNumber());

  if(current.getRole()==Role.PATIENT){
   Patient own=patientForUser(userId);
   if(!own.getId().equals(p.getId()))
    throw new IllegalArgumentException("Patients can only book appointments for their own profile.");
  }

  Dentist d=dentists.findById(r.dentistId())
          .filter(Dentist::isActive)
          .orElseThrow(()->new IllegalArgumentException("Selected dentist is not available."));

  Treatment t=treatments.findById(r.treatmentId())
          .filter(Treatment::isActive)
          .orElseThrow(()->new IllegalArgumentException("Selected treatment is not available."));

  LocalDateTime dt=r.appointmentDateTime().withSecond(0).withNano(0);
  if(dt.getMinute()%15!=0)
   throw new IllegalArgumentException("Appointments must start on a 15-minute time slot.");

  LocalDateTime end=dt.plusMinutes(APPOINTMENT_MINUTES);
  if(appointments.existsConflict(d.getId(),dt,end,
          List.of(AppointmentStatus.BOOKED,AppointmentStatus.CONFIRMED)))
   throw new IllegalArgumentException("This dentist is already booked for the selected time. Please choose another 15-minute slot.");

  Appointment a=new Appointment();
  a.setAppointmentNumber("SDC-"+UUID.randomUUID().toString().substring(0,8).toUpperCase());
  a.setPatient(p); a.setDentist(d); a.setTreatment(t);
  a.setAppointmentDateTime(dt); a.setPatientNote(r.patientNote());
  return appointments.save(a);
 }

 public List<Appointment> patientAppointments(String id){
  return appointments.findByPatientIdOrderByAppointmentDateTimeDesc(findPatient(id).getId());
 }

 public List<Appointment> patientAppointmentsForUser(Long userId){
  return appointments.findByPatientIdOrderByAppointmentDateTimeDesc(patientForUser(userId).getId());
 }

 public List<Appointment> dentistAppointments(Long userId){
  Dentist d=dentists.findByUserId(userId).orElseThrow(()->new IllegalArgumentException("Dentist profile not found."));
  return appointments.findByDentistIdOrderByAppointmentDateTimeAsc(d.getId());
 }

 @Transactional
 public AppointmentUpdate dentistUpdate(Long userId,Long appointmentId,AppointmentUpdateRequest r){
  Dentist d=dentists.findByUserId(userId).orElseThrow();
  Appointment a=findAppointment(appointmentId);
  if(!a.getDentist().getId().equals(d.getId()))
   throw new IllegalArgumentException("You can only update your own appointments.");
  a.setStatus(r.status()); a.setStaffNote(r.message()); appointments.save(a);
  var u=new AppointmentUpdate(); u.setAppointment(a); u.setDentist(d); u.setMessage(r.message());
  u.setEmailSent(mail.send(patientEmail(a.getPatient()),"Sunrise Dental - Appointment Update",
          "Sunrise Dental Clinic\n\nAppointment "+a.getAppointmentNumber()+"\n\n"+r.message()));
  return updates.save(u);
 }

 public List<AppointmentUpdate> patientUpdates(String id){
  return updates.findByAppointmentPatientIdOrderByCreatedAtDesc(findPatient(id).getId());
 }
 public List<AppointmentUpdate> allUpdates(){return updates.findAllByOrderByCreatedAtDesc();}
 public List<Appointment> allAppointments(){
  return appointments.findAll(org.springframework.data.domain.Sort.by("appointmentDateTime").descending());
 }

 public BillingPreview billingPreview(Long appointmentId, Long userId){
  Appointment a=findAppointment(appointmentId);
  User current=users.findById(userId).orElseThrow();
  if(current.getRole()==Role.PATIENT &&
     !a.getPatient().getUser().getId().equals(userId))
   throw new IllegalArgumentException("You can only view your own appointment bill.");

  return preview(a);
 }

 private BillingPreview preview(Appointment a){
  BigDecimal treatmentFee=n(a.getTreatment().getDefaultPrice());
  BigDecimal consultationFee=CONSULTATION_FEE;
  BigDecimal subtotal=treatmentFee.add(consultationFee);
  BigDecimal discount=BigDecimal.ZERO;
  BigDecimal taxable=subtotal.subtract(discount);
  BigDecimal tax=taxable.multiply(TAX_RATE).setScale(2,RoundingMode.HALF_UP);
  BigDecimal total=taxable.add(tax).setScale(2,RoundingMode.HALF_UP);
  return new BillingPreview(a.getId(),a.getAppointmentNumber(),a.getPatient().getFullName(),
          dentistName(a.getDentist()),a.getTreatment().getName(),treatmentFee,consultationFee,
          subtotal,discount,tax,total);
 }

 @Transactional
 public PaymentTransaction processPatientPayment(PaymentRequest r,Long userId){
  User current=users.findById(userId).orElseThrow();
  if(current.getRole()!=Role.PATIENT)
   throw new IllegalArgumentException("This payment page is for patients.");

  Appointment a=findAppointment(r.appointmentId());
  if(a.getPatient().getUser()==null || !a.getPatient().getUser().getId().equals(userId))
   throw new IllegalArgumentException("You can only pay for your own appointment.");

  if(bills.findByAppointmentId(a.getId()).isPresent())
   throw new IllegalArgumentException("This appointment has already been paid or billed.");

  if(r.paymentMethod()==PaymentMethod.CARD){
   if(r.cardholderName()==null || r.cardholderName().isBlank() ||
      r.cardLast4()==null || !r.cardLast4().matches("\\d{4}"))
    throw new IllegalArgumentException("Please provide valid card details.");
  }

  BillingPreview p=preview(a);
  Bill b=new Bill();
  b.setBillNumber("BILL-"+UUID.randomUUID().toString().substring(0,8).toUpperCase());
  b.setAppointment(a); b.setPatient(a.getPatient());
  b.setSubtotal(p.subtotal()); b.setConsultationFee(p.consultationFee());
  b.setDiscount(p.discount()); b.setTax(p.tax()); b.setTotal(p.total());
  b.setPaidAmount(p.total()); b.setPaymentMethod(r.paymentMethod());
  b.setStatus(BillStatus.PAID);
  b=bills.save(b);

  PaymentTransaction pt=new PaymentTransaction();
  pt.setBill(b);
  pt.setTransactionReference("PAY-"+UUID.randomUUID().toString().substring(0,10).toUpperCase());
  pt.setPaymentMethod(r.paymentMethod()); pt.setAmount(p.total());
  pt.setCardholderName(r.cardholderName());
  pt.setCardLast4(r.cardLast4());
  pt.setSuccessful(true);
  pt=payments.save(pt);

  byte[] pdf=receipts.createReceipt(pt);
  boolean emailSent=mail.sendWithAttachment(patientEmail(a.getPatient()),
      "Sunrise Dental - Payment Receipt "+b.getBillNumber(),
      "Dear "+a.getPatient().getFullName()+",\n\nYour payment of Rs. "+
      p.total().setScale(2).toPlainString()+" has been recorded successfully.\n"+
      "Appointment: "+a.getAppointmentNumber()+"\nPayment reference: "+pt.getTransactionReference()+
      "\n\nYour PDF receipt is attached.\n\nSunrise Dental Clinic",
      b.getBillNumber()+".pdf",pdf);
  pt.setReceiptEmailSent(emailSent);
  return payments.save(pt);
 }

 public byte[] receipt(Long paymentId,Long userId){
  PaymentTransaction pt=payments.findById(paymentId)
      .orElseThrow(()->new IllegalArgumentException("Payment receipt not found."));
  User current=users.findById(userId).orElseThrow();
  if(current.getRole()==Role.PATIENT &&
     (pt.getBill().getPatient().getUser()==null ||
      !pt.getBill().getPatient().getUser().getId().equals(userId)))
   throw new IllegalArgumentException("You can only download your own receipt.");
  return receipts.createReceipt(pt);
 }

 @Transactional
 public Bill createBill(BillRequest r){
  Appointment a=findAppointment(r.appointmentId());
  if(bills.findByAppointmentId(a.getId()).isPresent())
   throw new IllegalArgumentException("A bill already exists for this appointment.");
  BigDecimal treatmentFee=n(a.getTreatment().getDefaultPrice());
  BigDecimal consultation=CONSULTATION_FEE;
  BigDecimal subtotal=treatmentFee.add(consultation);
  BigDecimal discount=n(r.discount());
  BigDecimal tax=n(r.tax());
  BigDecimal total=subtotal.subtract(discount).add(tax);
  if(total.signum()<0)throw new IllegalArgumentException("Discount cannot exceed subtotal.");
  BigDecimal paid=n(r.paidAmount());
  if(paid.compareTo(total)>0)throw new IllegalArgumentException("Paid amount cannot exceed total.");
  Bill b=new Bill(); b.setBillNumber("BILL-"+UUID.randomUUID().toString().substring(0,8).toUpperCase());
  b.setAppointment(a);b.setPatient(a.getPatient());b.setSubtotal(treatmentFee);
  b.setConsultationFee(consultation);b.setDiscount(discount);b.setTax(tax);b.setTotal(total);
  b.setPaidAmount(paid);b.setPaymentMethod(r.paymentMethod());
  b.setStatus(paid.signum()==0?BillStatus.UNPAID:(paid.compareTo(total)==0?BillStatus.PAID:BillStatus.PARTIALLY_PAID));
  return bills.save(b);
 }

 private BigDecimal n(BigDecimal x){return x==null?BigDecimal.ZERO:x.setScale(2,RoundingMode.HALF_UP);}
 public List<Bill> patientBills(String id){return bills.findByPatientIdOrderByCreatedAtDesc(findPatient(id).getId());}
}
