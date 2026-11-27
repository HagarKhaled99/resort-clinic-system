package com.resortclinic.backend.user;

import com.fasterxml.jackson.annotation.JsonCreator;

/** The two kinds of clinic staff. Stored in the database as DOCTOR / NURSE. */
public enum Role {
    DOCTOR,
    NURSE;

    /** Accepts "doctor", "Doctor" or "DOCTOR" from the frontend. */
    @JsonCreator
    public static Role from(String value) {
        return Role.valueOf(value.trim().toUpperCase());
    }
}
