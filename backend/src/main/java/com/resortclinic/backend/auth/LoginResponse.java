package com.resortclinic.backend.auth;

/** Answer to a successful login: the JWT token and who logged in. */
public record LoginResponse(String token, UserDto user) {
}
