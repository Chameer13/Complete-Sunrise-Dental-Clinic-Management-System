package com.sunrise.dental.service;

import com.sunrise.dental.dto.*;
import com.sunrise.dental.entity.*;
import com.sunrise.dental.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.*;
import java.time.*;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ClinicService {
 final PatientRepository patients; final UserRepository users; final DentistRepository dentists;
 final TreatmentRepository treatments; final AppointmentRepository appointments;
 final AppointmentUpdateRepository updates; final BillRepository bills;
 final PaymentTransactionRepository payments; final MailService mail; final ReceiptPdfService receipts;
 final FeedbackRepository feedbacks; final InquiryRepository inquiries; final PrescriptionRepository prescriptions; final MedicineDispensationRepository dispensations;

 // Clinic billing rules. Keep these in one place so the frontend cannot alter the final amount.
 private static final BigDecimal CONSULTATION_FEE = new BigDecimal("1500.00");
 private static final BigDecimal TAX_RATE = new BigDecimal("0.05");
 private static final int APPOINTMENT_MINUTES = 15;

 public ClinicService(PatientRepository p,UserRepository u,DentistRepository d,TreatmentRepository t,
                      AppointmentRepository a,AppointmentUpdateRepository up,BillRepository b,
                      PaymentTransactionRepository pt,MailService m,ReceiptPdfService rp, FeedbackRepository f, InquiryRepository iq, PrescriptionRepository pr, MedicineDispensationRepository md){
  patients=p;users=u;dentists=d;treatments=t;appointments=a;updates=up;bills=b;
  payments=pt;mail=m;receipts=rp; feedbacks=f; inquiries=iq; prescriptions=pr; dispensations=md;
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

 private void requireStaff(User u){
  if(u.getRole()!=Role.RECEPTIONIST && u.getRole()!=Role.ADMIN)
   throw new IllegalArgumentException("This clinic operation is available only to reception staff.");
 }

 private User currentUser(Long userId){
  return users.findById(userId).orElseThrow();
 }

 @Transactional
 public Patient createPatient(PatientRequest r,Long userId){
  if(userId!=null){
   User u=currentUser(userId);
   if(u.getRole()==Role.PATIENT){
    if(patients.findByUserId(userId).isPresent()) throw new IllegalArgumentException("Your patient profile already exists.");
   } else requireStaff(u);
  }
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
 public Patient updatePatient(String id,PatientRequest r,Long userId){
  User u=currentUser(userId);
  Patient p=findPatient(id);
  if(u.getRole()==Role.PATIENT){
   Patient own=patientForUser(userId);
   if(!own.getId().equals(p.getId())) throw new IllegalArgumentException("Patients can only update their own profile.");
  } else requireStaff(u);
  p.setFullName(r.fullName().trim()); p.setAddress(r.address().trim());
  p.setContactNumber(r.contactNumber().trim()); p.setEmail(r.email());
  p.setGender(r.gender()); p.setDateOfBirth(r.dateOfBirth());
  p.setEmergencyContact(r.emergencyContact()); p.setAllergies(r.allergies());
  p.setMedicalNotes(r.medicalNotes());
  return patients.save(p);
 }

 public Optional<Patient> lookup(String id){return patients.findByIdNumberIgnoreCase(id.trim());}
 public Patient securePatientLookup(String id,Long userId){
  User u=currentUser(userId); Patient p=patients.findByIdNumberIgnoreCase(id.trim()).orElse(null);
  if(p==null) return null;
  if(u.getRole()==Role.PATIENT){
   Patient own=patientForUser(userId);
   if(!own.getId().equals(p.getId())) throw new IllegalArgumentException("Patients can only view their own profile.");
  } else requireStaff(u);
  return p;
 }
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
  if(current.getRole()!=Role.PATIENT && current.getRole()!=Role.RECEPTIONIST && current.getRole()!=Role.ADMIN)
   throw new IllegalArgumentException("Only patients and reception staff can create appointments.");
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

 public Patient staffPatientByAppointmentNumber(String appointmentNumber, Long userId){
  requireStaff(currentUser(userId));
  if(appointmentNumber==null || appointmentNumber.isBlank())
   throw new IllegalArgumentException("Please select an appointment number.");
  Appointment a=appointments.findByAppointmentNumber(appointmentNumber.trim())
      .orElseThrow(()->new IllegalArgumentException("Appointment number was not found."));
  return a.getPatient();
 }

 public List<Appointment> patientAppointmentsForUser(Long userId){
  return appointments.findByPatientIdOrderByAppointmentDateTimeDesc(patientForUser(userId).getId());
 }

 public List<Appointment> staffAppointmentsByDentist(Long dentistId, Long userId){
  requireStaff(currentUser(userId));
  Dentist d=dentists.findById(dentistId)
      .orElseThrow(()->new IllegalArgumentException("Selected dentist was not found."));
  return appointments.findByDentistIdOrderByAppointmentDateTimeAsc(d.getId());
 }

 public List<Appointment> dentistAppointments(Long userId) {

  User user = users.findById(userId)
          .orElseThrow(() ->
                  new IllegalArgumentException("Logged-in user was not found.")
          );

  if (user.getRole() != Role.DENTIST) {
   throw new IllegalArgumentException(
           "Only dentist accounts can access the dentist appointment schedule."
   );
  }

  Dentist dentist = dentists.findByUserId(userId)
          .orElseThrow(() ->
                  new IllegalArgumentException(
                          "No dentist profile is linked to the logged-in dentist account."
                  )
          );

  if (!dentist.isActive()) {
   throw new IllegalArgumentException(
           "This dentist account is currently inactive."
   );
  }

  return appointments.findByDentistIdOrderByAppointmentDateTimeAsc(
          dentist.getId()
  );
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

 public List<AppointmentUpdate> patientUpdates(String id,Long userId){
  User u=currentUser(userId);
  Patient p=findPatient(id);
  if(u.getRole()==Role.PATIENT){
   Patient own=patientForUser(userId);
   if(!own.getId().equals(p.getId())) throw new IllegalArgumentException("Patients can only view their own updates.");
  } else requireStaff(u);
  return updates.findByAppointmentPatientIdOrderByCreatedAtDesc(p.getId());
 }

 public List<AppointmentUpdate> myUpdates(Long userId){
  Patient p=patientForUser(userId);
  return updates.findByAppointmentPatientIdOrderByCreatedAtDesc(p.getId());
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

 @Transactional
 public PaymentTransaction processStaffPayment(PaymentRequest r,Long userId){
  User current=currentUser(userId);
  requireStaff(current);
  Appointment a=findAppointment(r.appointmentId());
  if(bills.findByAppointmentId(a.getId()).isPresent())
   throw new IllegalArgumentException("This appointment already has a bill or payment recorded.");
  if(r.paymentMethod()==PaymentMethod.CARD){
   if(r.cardholderName()==null || r.cardholderName().isBlank() || r.cardLast4()==null || !r.cardLast4().matches("\\d{4}"))
    throw new IllegalArgumentException("Please provide valid card details.");
  }
  BillingPreview p=preview(a);
  Bill b=new Bill();
  b.setBillNumber("BILL-"+UUID.randomUUID().toString().substring(0,8).toUpperCase());
  b.setAppointment(a); b.setPatient(a.getPatient()); b.setSubtotal(p.subtotal());
  b.setConsultationFee(p.consultationFee()); b.setDiscount(p.discount()); b.setTax(p.tax()); b.setTotal(p.total());
  b.setPaidAmount(p.total()); b.setPaymentMethod(r.paymentMethod()); b.setStatus(BillStatus.PAID);
  b=bills.save(b);
  PaymentTransaction pt=new PaymentTransaction(); pt.setBill(b);
  pt.setTransactionReference("PAY-"+UUID.randomUUID().toString().substring(0,10).toUpperCase());
  pt.setPaymentMethod(r.paymentMethod()); pt.setAmount(p.total()); pt.setCardholderName(r.cardholderName()); pt.setCardLast4(r.cardLast4());
  pt.setSuccessful(true);
  pt=payments.save(pt);
  byte[] pdf=receipts.createReceipt(pt);
  boolean sent=mail.sendWithAttachment(patientEmail(a.getPatient()),
    "Sunrise Dental - Payment Receipt "+b.getBillNumber(),
    "Dear "+a.getPatient().getFullName()+",\n\nYour payment of Rs. "+p.total().setScale(2).toPlainString()+" has been recorded by Sunrise Dental Clinic reception.\n"+
    "Appointment: "+a.getAppointmentNumber()+"\nPayment reference: "+pt.getTransactionReference()+"\n\nYour PDF receipt is attached.",
    b.getBillNumber()+".pdf",pdf);
  pt.setReceiptEmailSent(sent);
  return payments.save(pt);
 }

 public List<StaffFinancialRecord> staffFinancials(String idNumber,Long userId){
  requireStaff(currentUser(userId));
  Patient p=findPatient(idNumber);
  return appointments.findByPatientIdOrderByAppointmentDateTimeDesc(p.getId()).stream().map(a->{
   var billOpt=bills.findByAppointmentId(a.getId());
   if(billOpt.isPresent()){
    Bill b=billOpt.get();
    Long paymentId=payments.findByBillId(b.getId()).map(PaymentTransaction::getId).orElse(null);
    return new StaffFinancialRecord(a.getId(),a.getAppointmentNumber(),a.getAppointmentDateTime(),
      dentistName(a.getDentist()),a.getTreatment().getName(),b.getTotal(),b.getPaidAmount(),b.getStatus(),b.getPaymentMethod(),paymentId);
   }
   BillingPreview preview=preview(a);
   return new StaffFinancialRecord(a.getId(),a.getAppointmentNumber(),a.getAppointmentDateTime(),
      dentistName(a.getDentist()),a.getTreatment().getName(),preview.total(),BigDecimal.ZERO,BillStatus.UNPAID,null,null);
  }).toList();
 }

 public List<StaffFinancialRecord> patientFinancials(Long userId){
  Patient p=patientForUser(userId);
  return appointments.findByPatientIdOrderByAppointmentDateTimeDesc(p.getId()).stream().map(a->{
   var billOpt=bills.findByAppointmentId(a.getId());
   if(billOpt.isPresent()){
    Bill b=billOpt.get();
    Long paymentId=payments.findByBillId(b.getId()).map(PaymentTransaction::getId).orElse(null);
    return new StaffFinancialRecord(a.getId(),a.getAppointmentNumber(),a.getAppointmentDateTime(),dentistName(a.getDentist()),a.getTreatment().getName(),b.getTotal(),b.getPaidAmount(),b.getStatus(),b.getPaymentMethod(),paymentId);
   }
   BillingPreview preview=preview(a);
   return new StaffFinancialRecord(a.getId(),a.getAppointmentNumber(),a.getAppointmentDateTime(),dentistName(a.getDentist()),a.getTreatment().getName(),preview.total(),BigDecimal.ZERO,BillStatus.UNPAID,null,null);
  }).toList();
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
 public Bill createBill(BillRequest r,Long userId){
  requireStaff(currentUser(userId));
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


 public List<Appointment> staffAppointmentsFiltered(Long dentistId,String date,Long userId){
  requireStaff(currentUser(userId));
  List<Appointment> list;
  if(dentistId!=null) list=appointments.findByDentistIdOrderByAppointmentDateTimeAsc(dentistId);
  else list=appointments.findAll(org.springframework.data.domain.Sort.by("appointmentDateTime").ascending());
  if(date!=null && !date.isBlank()){
   LocalDate d=LocalDate.parse(date); list=list.stream().filter(a->a.getAppointmentDateTime().toLocalDate().equals(d)).toList();
  }
  return list;
 }

 @Transactional public Feedback saveFeedback(FeedbackRequest r,Long userId){
  User u=currentUser(userId); if(u.getRole()!=Role.PATIENT) throw new IllegalArgumentException("Only patients can submit feedback.");
  Patient p=patientForUser(userId); Feedback f=feedbacks.findByPatientId(p.getId()).orElseGet(Feedback::new);
  f.setUser(u); f.setPatient(p); f.setRating(r.rating()); f.setComment(r.comment().trim()); return feedbacks.save(f);
 }
 public List<Feedback> allFeedback(Long userId){requireStaff(currentUser(userId)); return feedbacks.findAllByOrderByCreatedAtDesc();}
 public Optional<Feedback> myFeedback(Long userId){return feedbacks.findByPatientId(patientForUser(userId).getId());}

 @Transactional public Inquiry createInquiry(InquiryRequest r,Long userId){
  User u=currentUser(userId); if(u.getRole()!=Role.PATIENT) throw new IllegalArgumentException("Only patients can create inquiries.");
  Patient p=patientForUser(userId); Dentist d=dentists.findById(r.dentistId()).filter(Dentist::isActive).orElseThrow(()->new IllegalArgumentException("Selected dentist is not available."));
  Inquiry i=new Inquiry(); i.setPatient(p); i.setDentist(d); i.setMessage(r.message().trim()); i.setStatus("OPEN"); return inquiries.save(i);
 }
 public List<Inquiry> myInquiries(Long userId){return inquiries.findByPatientIdOrderByCreatedAtDesc(patientForUser(userId).getId());}
 public List<Inquiry> dentistInquiries(Long userId){
  Dentist d=dentists.findByUserId(userId).orElseThrow(()->new IllegalArgumentException("Dentist profile not found.")); return inquiries.findByDentistIdOrderByCreatedAtDesc(d.getId());
 }
 public List<Inquiry> staffInquiries(Long userId){requireStaff(currentUser(userId)); return inquiries.findAll();}
 @Transactional public Inquiry replyInquiry(Long inquiryId,InquiryReplyRequest r,Long userId){
  Dentist d=dentists.findByUserId(userId).orElseThrow(()->new IllegalArgumentException("Dentist profile not found.")); Inquiry i=inquiries.findById(inquiryId).orElseThrow(()->new IllegalArgumentException("Inquiry not found."));
  if(!i.getDentist().getId().equals(d.getId())) throw new IllegalArgumentException("You can only reply to inquiries assigned to you.");
  i.setReply(r.reply().trim()); i.setStatus("ANSWERED"); i.setRepliedAt(LocalDateTime.now());
  boolean sent=mail.send(patientEmail(i.getPatient()),"Sunrise Dental - Dentist Inquiry Reply","Dear "+i.getPatient().getFullName()+",\n\nYour inquiry:\n"+i.getMessage()+"\n\nDentist reply:\n"+i.getReply()+"\n\nSunrise Dental Clinic");
  return inquiries.save(i);
 }

 @Transactional public Prescription savePrescription(Long appointmentId,PrescriptionRequest r,Long userId){
  Dentist d=dentists.findByUserId(userId).orElseThrow(()->new IllegalArgumentException("Dentist profile not found.")); Appointment a=findAppointment(appointmentId);
  if(!a.getDentist().getId().equals(d.getId())) throw new IllegalArgumentException("You can only prescribe for your own appointments.");
  Prescription p=prescriptions.findByAppointmentId(appointmentId).orElseGet(Prescription::new); p.setAppointment(a); p.setPatient(a.getPatient()); p.setDentist(d); p.setDiagnosis(r.diagnosis().trim()); p.setMedicines(r.medicines().trim()); p.setInstructions(r.instructions()==null?null:r.instructions().trim()); return prescriptions.save(p);
 }
 public List<Prescription> patientPrescriptions(Long userId){return prescriptions.findByPatientIdOrderByPrescribedAtDesc(patientForUser(userId).getId());}
 public List<Prescription> staffPrescriptions(String id,Long userId){requireStaff(currentUser(userId)); return prescriptions.findByPatientIdOrderByPrescribedAtDesc(findPatient(id).getId());}
 public List<Prescription> dentistPatientPrescriptions(String id,Long userId){
  User u=currentUser(userId);
  if(u.getRole()!=Role.DENTIST) throw new IllegalArgumentException("Only dentist accounts can access clinical prescription history.");
  Dentist d=dentists.findByUserId(userId).orElseThrow(()->new IllegalArgumentException("Dentist profile not found."));
  Patient p=findPatient(id);
  boolean assigned=appointments.findByDentistIdOrderByAppointmentDateTimeAsc(d.getId()).stream().anyMatch(a->a.getPatient().getId().equals(p.getId()));
  if(!assigned) throw new IllegalArgumentException("You can only view prescription history for patients assigned to you.");
  return prescriptions.findByPatientIdOrderByPrescribedAtDesc(p.getId());
 }
 public Optional<Prescription> appointmentPrescription(Long appointmentId,Long userId){
  User u=currentUser(userId); Prescription p=prescriptions.findByAppointmentId(appointmentId).orElseThrow(()->new IllegalArgumentException("No prescription has been added for this appointment."));
  if(u.getRole()==Role.PATIENT && (p.getPatient().getUser()==null || !p.getPatient().getUser().getId().equals(userId))) throw new IllegalArgumentException("You can only view your own prescription.");
  if(u.getRole()==Role.DENTIST && !p.getDentist().getUser().getId().equals(userId)) throw new IllegalArgumentException("You can only view your own patients' prescriptions.");
  if(u.getRole()!=Role.PATIENT && u.getRole()!=Role.DENTIST) requireStaff(u); return Optional.of(p);
 }
 @Transactional public MedicineDispensation dispense(Long prescriptionId,MedicineDispensationRequest r,Long userId){
  User u=currentUser(userId); requireStaff(u); Prescription p=prescriptions.findById(prescriptionId).orElseThrow(()->new IllegalArgumentException("Prescription not found."));
  String medicine=r.medicineName().trim();
  if(dispensations.existsByPrescriptionIdAndMedicineNameIgnoreCase(prescriptionId,medicine))
   throw new IllegalArgumentException("This medicine has already been recorded for this prescription. Please choose another medicine or review the existing dispensation.");
  MedicineDispensation m=new MedicineDispensation(); m.setPrescription(p); m.setStaffUser(u); m.setMedicineName(medicine); m.setQuantity(r.quantity().trim()); m.setBatchNumber(r.batchNumber()==null?null:r.batchNumber().trim()); m.setNotes(r.notes()==null?null:r.notes().trim()); return dispensations.save(m);
 }
 public List<MedicineDispensation> dispensations(Long prescriptionId,Long userId){requireStaff(currentUser(userId)); return dispensations.findByPrescriptionIdOrderByDispensedAtDesc(prescriptionId);}
 public List<MedicineDispensation> staffPatientDispensations(String id,Long userId){requireStaff(currentUser(userId)); return dispensations.findByPatientIdOrderByDispensedAtDesc(findPatient(id).getId());}

 private BigDecimal n(BigDecimal x){return x==null?BigDecimal.ZERO:x.setScale(2,RoundingMode.HALF_UP);}
 public List<Bill> patientBills(String id){return bills.findByPatientIdOrderByCreatedAtDesc(findPatient(id).getId());}
}
