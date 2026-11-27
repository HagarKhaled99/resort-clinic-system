package com.resortclinic.backend.auth;

import com.resortclinic.backend.user.User;

/** The user data we send to the frontend (never the password hash). */
public record UserDto(Long id, String name, String username, String role) {

    public static UserDto from(User user) {
        // role in lower case ("doctor" / "nurse") to match the React app
        return new UserDto(user.getId(), user.getFullName(), user.getUsername(),
                user.getRole().name().toLowerCase());
    }
}
