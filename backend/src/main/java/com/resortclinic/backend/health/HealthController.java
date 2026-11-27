package com.resortclinic.backend.health;

import java.util.Map;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Simple check that the server is running and can reach the database. */
@RestController
@RequestMapping("/api")
public class HealthController {

    private final JdbcTemplate jdbc;

    public HealthController(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @GetMapping("/health")
    public Map<String, String> health() {
        Integer result = jdbc.queryForObject("SELECT 1", Integer.class);
        String database = (result != null && result == 1) ? "UP" : "DOWN";
        return Map.of("status", "UP", "database", database);
    }
}
