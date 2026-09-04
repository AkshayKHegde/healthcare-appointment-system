package com.healthcare.controller;

import com.healthcare.entity.Appointment;
import com.healthcare.entity.Doctor;
import com.healthcare.entity.MedicalRecord;
import com.healthcare.service.AppointmentService;
import com.healthcare.service.DoctorService;
import com.healthcare.service.MedicalRecordService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patient")
public class PatientController {

    private final DoctorService doctorService;
    private final AppointmentService appointmentService;
    private final MedicalRecordService medicalRecordService;

    public PatientController(DoctorService doctorService,
                              AppointmentService appointmentService,
                              MedicalRecordService medicalRecordService) {
        this.doctorService = doctorService;
        this.appointmentService = appointmentService;
        this.medicalRecordService = medicalRecordService;
    }

    // GET /api/patient/doctors?specialty=Cardiology (specialty optional)
    @GetMapping("/doctors")
    public List<Doctor> searchDoctors(@RequestParam(required = false) String specialty) {
        return doctorService.searchDoctors(specialty);
    }

    // POST /api/patient/appointment?patientId=&doctorId=   body: { "appointmentTime": "2026-08-20 10:00:00" }
    @PostMapping("/appointment")
    public Appointment bookAppointment(@RequestParam Long patientId,
                                        @RequestParam Long doctorId,
                                        @RequestBody AppointmentTimeRequest body) {
        return appointmentService.bookAppointment(patientId, doctorId, body.getAppointmentTime());
    }

    // GET /api/patient/appointments?patientId=
    @GetMapping("/appointments")
    public List<Appointment> getAppointments(@RequestParam Long patientId) {
        return appointmentService.getAppointmentsForPatient(patientId);
    }

    // GET /api/patient/records?patientId=
    @GetMapping("/records")
    public List<MedicalRecord> getRecords(@RequestParam Long patientId) {
        return medicalRecordService.getRecordsForPatient(patientId);
    }

    public static class AppointmentTimeRequest {
        private String appointmentTime;
        public String getAppointmentTime() { return appointmentTime; }
        public void setAppointmentTime(String appointmentTime) { this.appointmentTime = appointmentTime; }
    }
}
