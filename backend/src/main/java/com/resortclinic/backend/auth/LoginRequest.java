package com.resortclinic.backend.auth;

import com.resortclinic.backend.user.Role;

import jakarta.validation.constraints.NotBlank;

/** What the login page sends. "role" is the Doctor / Nurse tab that was chosen (optional). */
public record LoginRequest(
        @NotBlank String username,
        @NotBlank String password,
        Role role) {
}
