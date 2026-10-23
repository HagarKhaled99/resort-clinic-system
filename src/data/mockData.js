// =============================================================
//  Dummy data shared by ALL pages (no backend yet).
//  Everyone imports from this file so the pages stay consistent.
//  Dates are generated relative to today so the data always looks "live".
// =============================================================

const addDays = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10); // "YYYY-MM-DD"
};

export const todayISO = () => new Date().toISOString().slice(0, 10);

// ---- Users (login) ----
export const users = [
  { username: 'doctor', password: '1234', name: 'Dr. Mena', role: 'doctor' },
  { username: 'nurse', password: '1234', name: 'Nurse Mona Ali', role: 'nurse' },
];

// ---- Case classifications (used by Clinical Encounter + Statistics) ----
export const caseClassifications = [
  'Gastrointestinal',
  'Respiratory',
  'Injury / Trauma',
  'Skin & Allergy',
  'Heat-related',
  'Cardiac',
  'Other',
];

// ---- Languages for the printable patient form ----
export const formLanguages = [
  { code: 'en', label: 'English' },
  { code: 'ar', label: 'العربية' },
  { code: 'de', label: 'Deutsch' },
  { code: 'ru', label: 'Русский' },
  { code: 'it', label: 'Italiano' },
];

// ---- Patients ----
export const patients = [
  { id: 1, name: 'Anna Müller', age: 34, gender: 'Female', nationality: 'German', language: 'de', room: '214', phone: '+49 151 2233 4455', allergies: 'Penicillin', checkIn: addDays(-4), checkOut: addDays(3) },
  { id: 2, name: 'Ivan Petrov', age: 52, gender: 'Male', nationality: 'Russian', language: 'ru', room: '108', phone: '+7 912 345 6677', allergies: 'None', checkIn: addDays(-2), checkOut: addDays(1) },
  { id: 3, name: 'Sara Hassan', age: 27, gender: 'Female', nationality: 'Egyptian', language: 'ar', room: '305', phone: '+20 100 123 4567', allergies: 'None', checkIn: addDays(-1), checkOut: addDays(5) },
  { id: 4, name: 'James Wilson', age: 61, gender: 'Male', nationality: 'British', language: 'en', room: '412', phone: '+44 7700 900123', allergies: 'Aspirin', checkIn: addDays(-6), checkOut: addDays(2) },
  { id: 5, name: 'Giulia Rossi', age: 9, gender: 'Female', nationality: 'Italian', language: 'it', room: '220', phone: '+39 347 111 2222', allergies: 'Peanuts', checkIn: addDays(-3), checkOut: addDays(4) },
  { id: 6, name: 'Olga Smirnova', age: 45, gender: 'Female', nationality: 'Russian', language: 'ru', room: '119', phone: '+7 903 765 4321', allergies: 'None', checkIn: addDays(-5), checkOut: addDays(0) },
];

// ---- Clinic visits (encounters) ----
export const visits = [
  { id: 1, patientId: 3, date: addDays(0), time: '08:40', complaint: 'Abdominal pain & diarrhea', classification: 'Gastrointestinal', status: 'Completed' },
  { id: 2, patientId: 5, date: addDays(0), time: '09:25', complaint: 'Jellyfish sting on leg', classification: 'Skin & Allergy', status: 'Completed' },
  { id: 3, patientId: 4, date: addDays(0), time: '10:10', complaint: 'Dizziness after sun exposure', classification: 'Heat-related', status: 'In progress' },
  { id: 4, patientId: 1, date: addDays(0), time: '11:05', complaint: 'Sprained ankle at the gym', classification: 'Injury / Trauma', status: 'Waiting' },
  { id: 5, patientId: 2, date: addDays(-1), time: '18:30', complaint: 'Sore throat and fever', classification: 'Respiratory', status: 'Completed' },
  { id: 6, patientId: 6, date: addDays(-2), time: '14:15', complaint: 'Food poisoning', classification: 'Gastrointestinal', status: 'Completed' },
];

// ---- Follow-ups ----
export const followUps = [
  { id: 1, patientId: 2, date: addDays(0), time: '12:00', reason: 'Re-check fever & throat' },
  { id: 2, patientId: 6, date: addDays(0), time: '13:30', reason: 'Hydration check before check-out' },
  { id: 3, patientId: 3, date: addDays(0), time: '17:00', reason: 'Review response to treatment' },
  { id: 4, patientId: 1, date: addDays(1), time: '10:00', reason: 'Ankle swelling review' },
  { id: 5, patientId: 4, date: addDays(1), time: '16:00', reason: 'Blood pressure follow-up' },
];

// ---- Medication inventory ----
export const medications = [
  { id: 1, name: 'Paracetamol 500mg', form: 'Tablets', quantity: 240, minQuantity: 50, expiryDate: addDays(210) },
  { id: 2, name: 'Ibuprofen 400mg', form: 'Tablets', quantity: 18, minQuantity: 40, expiryDate: addDays(150) },
  { id: 3, name: 'Loperamide 2mg', form: 'Capsules', quantity: 60, minQuantity: 20, expiryDate: addDays(12) },
  { id: 4, name: 'Oral Rehydration Salts', form: 'Sachets', quantity: 8, minQuantity: 30, expiryDate: addDays(95) },
  { id: 5, name: 'Hydrocortisone Cream 1%', form: 'Tubes', quantity: 14, minQuantity: 5, expiryDate: addDays(-6) },
  { id: 6, name: 'Cetirizine 10mg', form: 'Tablets', quantity: 90, minQuantity: 30, expiryDate: addDays(25) },
  { id: 7, name: 'Adrenaline 1mg/ml', form: 'Ampoules', quantity: 6, minQuantity: 4, expiryDate: addDays(300) },
];

// ---- Emergency alerts ----
export const emergencyAlerts = [
  { id: 1, type: 'Near drowning', location: 'Main pool', details: 'Child pulled from water, conscious, coughing', sentBy: 'Nurse Mona Ali', date: addDays(0), time: '10:42', status: 'Active' },
  { id: 2, type: 'Fall / injury', location: 'Room 412', details: 'Elderly guest fell in bathroom', sentBy: 'Nurse Mona Ali', date: addDays(0), time: '07:15', status: 'Resolved' },
  { id: 3, type: 'Allergic reaction', location: 'Beach restaurant', details: 'Lip swelling after seafood', sentBy: 'Nurse Mona Ali', date: addDays(-1), time: '21:05', status: 'Resolved' },
];

// Small helper: find a patient by id
export const getPatient = (id) => patients.find((p) => p.id === id);
