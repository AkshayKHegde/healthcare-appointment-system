package com.healthcare.controller;

import com.healthcare.entity.Appointment;
import com.healthcare.service.AppointmentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/receptionist")
public class ReceptionistController {

    private final AppointmentService appointmentService;

    public ReceptionistController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    // GET /api/receptionist/appointments
    @GetMapping("/appointments")
    public List<Appointment> getAllAppointments() {
        return appointmentService.getAllAppointments();
    }

    // POST /api/receptionist/appointment?patientId=&doctorId=   body: { "appointmentTime": "2026-08-20 10:00:00" }
    @PostMapping("/appointment")
    public Appointment scheduleAppointment(@RequestParam Long patientId,
                                            @RequestParam Long doctorId,
                                            @RequestBody PatientController.AppointmentTimeRequest body) {
        return appointmentService.bookAppointment(patientId, doctorId, body.getAppointmentTime());
    }

    // PUT /api/receptionist/appointment/reschedule/{id}   body: { "appointmentTime": "2026-08-21 11:00:00" }
    @PutMapping("/appointment/reschedule/{id}")
    public Appointment reschedule(@PathVariable Long id,
                                   @RequestBody PatientController.AppointmentTimeRequest body) {
        return appointmentService.rescheduleAppointment(id, body.getAppointmentTime());
    }

    // PUT /api/receptionist/appointment/cancel/{id}
    @PutMapping("/appointment/cancel/{id}")
    public Appointment cancel(@PathVariable Long id) {
        return appointmentService.cancelAppointment(id);
    }
}
