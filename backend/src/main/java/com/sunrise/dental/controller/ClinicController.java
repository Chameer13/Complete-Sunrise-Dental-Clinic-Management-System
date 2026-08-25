package com.sunrise.dental.controller;

import com.sunrise.dental.dto.*;
import com.sunrise.dental.entity.*;
import com.sunrise.dental.repository.UserRepository;
import com.sunrise.dental.service.ClinicService;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api")
public class ClinicController {
 final ClinicService s; final UserRepository users;
 public ClinicController(ClinicService s,UserRepository u){this.s=s;users=u;}

 private Long uid(Authentication a){
  return users.findByUsernameIgnoreCase(a.getName()).orElseThrow().getId();
 }

 @GetMapping("/me/patient")
 public Object mePatient(Authentication a){
  var u=users.findByUsernameIgnoreCase(a.getName()).orElseThrow();
  return s.lookupByUserId(u.getId()).orElse(null);
 }

 @GetMapping("/patients/{idNumber}") public Object patient(@PathVariable String idNumber){return s.lookup(idNumber).orElse(null);}

 @PostMapping("/patients")
 public Patient create(@Valid @RequestBody PatientRequest r,Authentication a){
  var u=users.findByUsernameIgnoreCase(a.getName()).orElseThrow();
  return s.createPatient(r,u.getRole()==Role.PATIENT?u.getId():null);
 }

 @PutMapping("/patients/{idNumber}") public Patient update(@PathVariable String idNumber,@Valid @RequestBody PatientRequest r,Authentication a){return s.updatePatient(idNumber,r,uid(a));}

 @GetMapping("/treatments") public List<Treatment> treatments(){return s.treatments();}

 @GetMapping("/dentists") public List<DentistOption> dentists(){return s.dentistOptions();}

 @PostMapping("/appointments")
 public Appointment book(@Valid @RequestBody AppointmentRequest r,Authentication a){
  return s.book(r,uid(a));
 }

 @GetMapping("/appointments") public List<Appointment> appointments(){
  return s.allAppointments();
 }

 @GetMapping("/patients/{idNumber}/appointments")
 public List<Appointment> patientAppointments(@PathVariable String idNumber){
  return s.patientAppointments(idNumber);
 }

 @GetMapping("/me/appointments")
 public List<Appointment> myAppointments(Authentication a){
  return s.patientAppointmentsForUser(uid(a));
 }

 @GetMapping("/dentist/appointments")
 public List<Appointment> dentistAppointments(Authentication a){return s.dentistAppointments(uid(a));}

 @GetMapping("/staff/dentists/{dentistId}/appointments")
 public List<Appointment> staffDentistAppointments(@PathVariable Long dentistId,Authentication a){
  return s.staffAppointmentsByDentist(dentistId,uid(a));
 }


 @PutMapping("/dentist/appointments/{appointmentId}")
 public AppointmentUpdate updateAppointment(@PathVariable Long appointmentId,@Valid @RequestBody AppointmentUpdateRequest r,Authentication a){
  return s.dentistUpdate(uid(a),appointmentId,r);
 }

 @GetMapping("/patients/{idNumber}/updates") public List<AppointmentUpdate> patientUpdates(@PathVariable String idNumber,Authentication a){return s.patientUpdates(idNumber,uid(a));}
 @GetMapping("/me/updates") public List<AppointmentUpdate> myUpdates(Authentication a){return s.myUpdates(uid(a));}
 @GetMapping("/updates") public List<AppointmentUpdate> updates(){return s.allUpdates();}

 @GetMapping("/appointments/{appointmentId}/billing-preview")
 public BillingPreview billingPreview(@PathVariable Long appointmentId,Authentication a){
  return s.billingPreview(appointmentId,uid(a));
 }

 @PostMapping("/payments")
 public PaymentTransaction payment(@Valid @RequestBody PaymentRequest r,Authentication a){
  return s.processPatientPayment(r,uid(a));
 }

 @GetMapping("/payments/{paymentId}/receipt")
 public ResponseEntity<byte[]> receipt(@PathVariable Long paymentId,Authentication a){
  byte[] pdf=s.receipt(paymentId,uid(a));
  return ResponseEntity.ok()
      .contentType(MediaType.APPLICATION_PDF)
      .header(HttpHeaders.CONTENT_DISPOSITION,"attachment; filename=Sunrise-Dental-Receipt.pdf")
      .body(pdf);
 }

 @PostMapping("/bills") public Bill bill(@Valid @RequestBody BillRequest r,Authentication a){return s.createBill(r,uid(a));}
 @GetMapping("/patients/{idNumber}/bills") public List<Bill> bills(@PathVariable String idNumber){return s.patientBills(idNumber);}

 @PostMapping("/staff/payments")
 public PaymentTransaction staffPayment(@Valid @RequestBody PaymentRequest r,Authentication a){
  return s.processStaffPayment(r,uid(a));
 }

 @GetMapping("/staff/patients/{idNumber}/financials")
 public List<StaffFinancialRecord> staffFinancials(@PathVariable String idNumber,Authentication a){
  return s.staffFinancials(idNumber,uid(a));
 }

 @GetMapping("/staff/patients/{idNumber}/appointments")
 public List<Appointment> staffPatientAppointments(@PathVariable String idNumber,Authentication a){
  s.staffFinancials(idNumber,uid(a));
  return s.patientAppointments(idNumber);
 }
}
