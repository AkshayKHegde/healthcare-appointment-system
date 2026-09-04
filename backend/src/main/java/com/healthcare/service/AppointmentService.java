package com.healthcare.service;

import com.healthcare.entity.*;
import com.healthcare.repository.AppointmentRepository;
import com.healthcare.repository.DoctorRepository;
import com.healthcare.repository.PatientRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

@Service
public class AppointmentService {

    private static final String DATE_PATTERN = "yyyy-MM-dd HH:mm:ss";

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;

    public AppointmentService(AppointmentRepository appointmentRepository,
                               PatientRepository patientRepository,
                               DoctorRepository doctorRepository) {
        this.appointmentRepository = appointmentRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
    }

    public Appointment bookAppointment(Long patientId, Long doctorId, String appointmentTimeStr) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new ApiException("Patient not found", HttpStatus.NOT_FOUND));
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ApiException("Doctor not found", HttpStatus.NOT_FOUND));

        if (!doctor.isAvailability()) {
            throw new ApiException("Doctor is not currently available", HttpStatus.BAD_REQUEST);
        }

        Date appointmentTime = parseDate(appointmentTimeStr);
        Appointment appointment = new Appointment(patient, doctor, appointmentTime);
        return appointmentRepository.save(appointment);
    }

    public List<Appointment> getAppointmentsForPatient(Long patientId) {
        return appointmentRepository.findByPatientId(patientId);
    }

    public List<Appointment> getAppointmentsForDoctor(Long doctorId) {
        return appointmentRepository.findByDoctorId(doctorId);
    }

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    public Appointment rescheduleAppointment(Long appointmentId, String newTimeStr) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ApiException("Appointment not found", HttpStatus.NOT_FOUND));

        appointment.setAppointmentTime(parseDate(newTimeStr));
        appointment.setStatus(AppointmentStatus.RESCHEDULED);
        return appointmentRepository.save(appointment);
    }

    public Appointment cancelAppointment(Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ApiException("Appointment not found", HttpStatus.NOT_FOUND));
        appointment.setStatus(AppointmentStatus.CANCELLED);
        return appointmentRepository.save(appointment);
    }

    private Date parseDate(String value) {
        try {
            SimpleDateFormat sdf = new SimpleDateFormat(DATE_PATTERN);
            sdf.setLenient(false);
            return sdf.parse(value);
        } catch (ParseException e) {
            throw new ApiException("appointmentTime must match format " + DATE_PATTERN, HttpStatus.BAD_REQUEST);
        }
    }
}
