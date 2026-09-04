package com.healthcare.dto;

import com.healthcare.entity.Role;

public class AuthResponse {
    private Long id;
    private String username;
    private Role role;

    public AuthResponse(Long id, String username, Role role) {
        this.id = id;
        this.username = username;
        this.role = role;
    }

    public Long getId() { return id; }
    public String getUsername() { return username; }
    public Role getRole() { return role; }
}
