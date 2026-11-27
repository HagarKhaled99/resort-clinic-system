// =============================================================
//  Dropdown options for the Clinical Encounter page.
//  Sections follow the doctor's paper form:
//    Examination: BP / Pulse / Temp, Chest, Heart, Abdomen, Neurology, Local
//    then Investigations, Diagnosis, Management.
//
//  Every dropdown keeps an "Other (specify)" option, so the doctor is never
//  forced into a wrong choice. Choosing it shows a free-text box.
//  The doctor should review these lists – they are a starting point.
// =============================================================

export const OTHER = 'Other (specify)';

// Classification names must match caseClassifications in mockData.js.
export const commonComplaints = [
  { label: 'Abdominal pain', classification: 'Gastrointestinal' },
  { label: 'Diarrhoea / vomiting', classification: 'Gastrointestinal' },
  { label: 'Sore throat / cough', classification: 'Respiratory' },
  { label: 'Fever', classification: 'Respiratory' },
  { label: 'Shortness of breath', classification: 'Respiratory' },
  { label: 'Chest pain', classification: 'Cardiac' },
  { label: 'High blood pressure', classification: 'Cardiac' },
  { label: 'Sunburn', classification: 'Heat-related' },
  { label: 'Dizziness after heat / sun', classification: 'Heat-related' },
  { label: 'Rash / itching', classification: 'Skin & Allergy' },
  { label: 'Insect bite / jellyfish sting', classification: 'Skin & Allergy' },
  { label: 'Fall / sprain', classification: 'Injury / Trauma' },
  { label: 'Cut / wound', classification: 'Injury / Trauma' },
  { label: 'Ear pain', classification: 'Other' },
  { label: 'Eye redness / pain', classification: 'Other' },
  { label: OTHER, classification: 'Other' },
];

export const examinationOptions = {
  chest: ['Clear, equal air entry', 'Wheeze', 'Crackles', 'Reduced air entry', OTHER],
  heart: ['S1 + S2 normal, no murmur', 'Tachycardia', 'Irregular rhythm', 'Murmur', OTHER],
  abdomen: ['Soft, non-tender', 'Epigastric tenderness', 'Right iliac fossa tenderness', 'Generalised tenderness', 'Distended', OTHER],
  neurology: ['Conscious, oriented, no focal deficit', 'Drowsy / confused', 'Focal deficit', OTHER],
  // "Local" stays free text (wound site, sting site, etc.)
};

export const investigationOptions = [
  'None',
  'Blood glucose (finger prick)',
  'ECG',
  'Urine dipstick',
  'Pregnancy test',
  'Referred for X-ray',
  'Referred for blood tests',
  OTHER,
];

// Shown after the classification is chosen: diagnoses for that group.
export const diagnosesByClassification = {
  Gastrointestinal: ['Acute gastroenteritis', 'Food poisoning', 'Gastritis / dyspepsia', 'Constipation', OTHER],
  Respiratory: ['Upper respiratory tract infection', 'Pharyngitis / tonsillitis', 'Acute bronchitis', 'Asthma exacerbation', OTHER],
  'Injury / Trauma': ['Sprain / strain', 'Laceration / wound', 'Contusion (bruise)', 'Suspected fracture', OTHER],
  'Skin & Allergy': ['Sunburn', 'Allergic reaction / urticaria', 'Insect bite', 'Jellyfish sting', 'Contact dermatitis', OTHER],
  'Heat-related': ['Heat exhaustion', 'Dehydration', 'Heat stroke', OTHER],
  Cardiac: ['Hypertension', 'Chest pain – for evaluation', 'Palpitations', OTHER],
  Other: ['Otitis externa', 'Conjunctivitis', 'Toothache', OTHER],
};

// "Management" on the paper form.
export const dispositionOptions = [
  'Treated and discharged',
  'Treated – follow-up scheduled',
  'Observation in clinic',
  'Referred to hospital',
];

// Number inputs (not dropdowns) with sensible limits for validation.
export const vitalSignLimits = {
  systolic: { label: 'BP systolic (mmHg)', min: 50, max: 260 },
  diastolic: { label: 'BP diastolic (mmHg)', min: 30, max: 160 },
  pulse: { label: 'Pulse (bpm)', min: 20, max: 250 },
  temperature: { label: 'Temp (°C)', min: 30, max: 44, step: 0.1 },
  respiratoryRate: { label: 'Resp. rate (/min)', min: 5, max: 60 },
  oxygenSaturation: { label: 'SpO₂ (%)', min: 50, max: 100 },
};
