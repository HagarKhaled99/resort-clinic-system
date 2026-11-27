# Resort Clinic System – Backend

Spring Boot 4 (Java 21, Maven) REST API with PostgreSQL (hosted on Neon).

## Run it locally

1. Install **Java 21 or newer** (no Maven needed – the project includes `mvnw`).
2. Create the file `backend/.env` (it is in `.gitignore`, **never commit it**):
   ```
   DB_URL=jdbc:postgresql://<neon-host>/clinic?sslmode=require
   DB_USERNAME=<neon-user>
   DB_PASSWORD=<neon-password>
   ```
   Ask Hagar for the values in a private message.
3. Start the server from the `backend` folder:
   ```
   ./mvnw spring-boot:run        (Windows PowerShell: .\mvnw spring-boot:run)
   ```
4. Open http://localhost:8080/api/health → `{"status":"UP","database":"UP"}`

## Run the tests

```
./mvnw test
```
Tests use an in-memory H2 database (`src/test/resources/application.properties`), so they need no `.env`.

## Project structure

```
src/main/java/com/resortclinic/backend/
├── BackendApplication.java      start of the app
├── config/WebConfig.java        CORS: lets the React app (localhost:3000) call /api/**
└── health/HealthController.java GET /api/health
src/main/resources/
├── application.properties       settings (secrets come from .env / environment variables)
└── db/migration/                Flyway SQL files – every table change is a new file
    └── V1__create_users.sql     users table (doctor / nurse)
```

## Adding your part (each member)

1. New branch from `main`, e.g. `feature/backend-patients`.
2. New table → new Flyway file with the **next number**, e.g. `V2__create_patients.sql`.
   Never edit a migration that is already merged – add a new one instead.
3. Your code in its own package, e.g. `com.resortclinic.backend.patient`
   (Entity, Repository, Service, Controller).
4. A test next to it in `src/test/java/...`, then a pull request.

## Settings on the server (deployment)

Set `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` as environment variables, and
`APP_CORS_ALLOWED_ORIGINS` to the deployed frontend URL.
