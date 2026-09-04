package com.healthcare.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;

@Entity
@Table(name = "receptionist")
@PrimaryKeyJoinColumn(name = "id")
public class Receptionist extends User {

    public Receptionist() {
        super();
    }

    public Receptionist(String username, String password, String email) {
        super(username, password, email, Role.RECEPTIONIST);
    }
}
