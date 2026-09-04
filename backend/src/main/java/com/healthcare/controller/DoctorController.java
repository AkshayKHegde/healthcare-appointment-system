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
@RequestMapping("/api/doctor")
public class DoctorController {

    private final AppointmentService appointmentService;
    private final DoctorService doctorService;
    private final MedicalRecordService medicalRecordService;

    public DoctorController(AppointmentService appointmentService,
                             DoctorService doctorService,
                             MedicalRecordService medicalRecordService) {
        this.appointmentService = appointmentService;
        this.doctorService = doctorService;
        this.medicalRecordService = medicalRecordService;
    }

    // GET /api/doctor/appointments?doctorId=
    @GetMapping("/appointments")
    public List<Appointment> getAppointments(@RequestParam Long doctorId) {
        return appointmentService.getAppointmentsForDoctor(doctorId);
    }

    // POST /api/doctor/availability?doctorId=&availability=true
    @PostMapping("/availability")
    public Doctor setAvailability(@RequestParam Long doctorId, @RequestParam boolean availability) {
        return doctorService.setAvailability(doctorId, availability);
    }

    // POST /api/doctor/record?patientId=&doctorId=   body: { "notes": "..." }
    @PostMapping("/record")
    public MedicalRecord addRecord(@RequestParam Long patientId,
                                    @RequestParam Long doctorId,
                                    @RequestBody RecordRequest body) {
        return medicalRecordService.addRecord(patientId, doctorId, body.getNotes());
    }

    public static class RecordRequest {
        private String notes;
        public String getNotes() { return notes; }
        public void setNotes(String notes) { this.notes = notes; }
    }
}
