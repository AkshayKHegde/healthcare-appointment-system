package com.healthcare.service;

import com.healthcare.entity.Doctor;
import com.healthcare.repository.DoctorRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;

    public DoctorService(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    public List<Doctor> searchDoctors(String specialty) {
        if (specialty == null || specialty.isBlank()) {
            return doctorRepository.findAll();
        }
        return doctorRepository.findBySpecialtyContainingIgnoreCase(specialty);
    }

    public Doctor setAvailability(Long doctorId, boolean availability) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ApiException("Doctor not found", HttpStatus.NOT_FOUND));
        doctor.setAvailability(availability);
        return doctorRepository.save(doctor);
    }
}
