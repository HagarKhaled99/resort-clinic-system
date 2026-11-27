# Resort Clinic System

A clinical information and analytics system for the small medical clinic inside a hotel/resort
(1 doctor, 2 nurses). It replaces paper-only workflows with electronic patient records, while the
signed paper intake form stays part of the process.

## What it does

| Module | Description |
|---|---|
| Login & roles | Doctor and nurse accounts with different permissions |
| Dashboard | Today's visits and follow-ups, medication alerts, active emergencies |
| Patient records | Register patients, search, view visit history |
| Clinical encounter | Complaint, history, examination, case classification, diagnosis, treatment |
| Medications | Stock, batch numbers, expiry dates, *Expiring Soon* (6 months) and *Low Stock* alerts, medicine name search (RxNav API) |
| Emergency alerts | Nurse sends an alert with type and location; the doctor receives it |
| Monthly statistics | Cases by classification, nationality and room, with percentages (doctor only) |
| Patient form | Printable patient intake form in the guest's language |

## Team

| Member | Area |
|---|---|
| Hagar | Login, Dashboard, roles, backend setup & authentication, project board |
| Menna | Patients, Clinical Encounter |
| Salma | Medications, Emergency alerts |
| Marvey | Statistics, Patient Form |
| Ahmed | Follow-ups, GitHub Actions (CI), tests |

Tasks, priorities and deadlines are tracked on our GitHub Project board; every change goes through
an issue → branch → pull request → review → merge.

## Tech stack

- **Frontend:** React 19, React Router, CSS (in the repository root)
- **Backend:** Java 21, Spring Boot 4, Spring Security + JWT, Spring Data JPA, Flyway (in [`backend/`](backend/README.md))
- **Database:** PostgreSQL (Neon); H2 in-memory for backend tests
- **Tests:** Jest + React Testing Library (frontend), JUnit 5 + MockMvc (backend)

## Run the frontend

Requires Node.js 18+.

```bash
npm install
npm start          # http://localhost:3000
npm test           # run the tests
```

Demo accounts: `doctor` / `1234` and `nurse` / `1234`.
The frontend currently uses demo data from `src/data/mockData.js`; it will be connected to the backend API step by step.

## Run the backend

See [`backend/README.md`](backend/README.md) (Java 21+, a `backend/.env` file with the database settings, then `.\mvnw spring-boot:run`).

## Project structure

```
├── public/                 static files (index.html, icons, manifest)
├── src/
│   ├── components/         shared parts (Layout = sidebar + top bar, Icons)
│   ├── data/mockData.js    demo data used by the pages
│   ├── pages/              one folder per page (Login, Dashboard, Patients, …)
│   └── utils/              helpers (auth, medication status) + their tests
└── backend/                Spring Boot REST API
```

## Privacy

Only made-up demo data is used. Never commit real patient data or secrets (`backend/.env` is ignored by git).
