package com.healthcare.service;

import com.healthcare.dto.AuthResponse;
import com.healthcare.dto.LoginRequest;
import com.healthcare.dto.RegisterRequest;
import com.healthcare.entity.Doctor;
import com.healthcare.entity.Patient;
import com.healthcare.entity.Receptionist;
import com.healthcare.entity.User;
import com.healthcare.repository.DoctorRepository;
import com.healthcare.repository.PatientRepository;
import com.healthcare.repository.ReceptionistRepository;
import com.healthcare.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final ReceptionistRepository receptionistRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UserService(UserRepository userRepository,
                        PatientRepository patientRepository,
                        DoctorRepository doctorRepository,
                        ReceptionistRepository receptionistRepository) {
        this.userRepository = userRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
        this.receptionistRepository = receptionistRepository;
    }

    public Patient registerPatient(RegisterRequest req) {
        checkUsernameFree(req.getUsername());
        Patient patient = new Patient(req.getUsername(), passwordEncoder.encode(req.getPassword()), req.getEmail());
        return patientRepository.save(patient);
    }

    public Doctor registerDoctor(RegisterRequest req) {
        checkUsernameFree(req.getUsername());
        Doctor doctor = new Doctor(req.getUsername(), passwordEncoder.encode(req.getPassword()),
                req.getEmail(), req.getSpecialty());
        return doctorRepository.save(doctor);
    }

    public Receptionist registerReceptionist(RegisterRequest req) {
        checkUsernameFree(req.getUsername());
        Receptionist receptionist = new Receptionist(req.getUsername(),
                passwordEncoder.encode(req.getPassword()), req.getEmail());
        return receptionistRepository.save(receptionist);
    }

    public AuthResponse login(LoginRequest req) {
        User user = userRepository.findByUsername(req.getUsername())
                .orElseThrow(() -> new ApiException("Invalid username or password", HttpStatus.UNAUTHORIZED));

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new ApiException("Invalid username or password", HttpStatus.UNAUTHORIZED);
        }
        return new AuthResponse(user.getId(), user.getUsername(), user.getRole());
    }

    private void checkUsernameFree(String username) {
        if (userRepository.existsByUsername(username)) {
            throw new ApiException("Username already taken", HttpStatus.CONFLICT);
        }
    }
}
