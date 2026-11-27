
import React, { useState } from 'react';
import { intakeTranslations } from '../../data/intakeTranslations';
import './PatientIntakeForm.css';

const sections = [
  { key: 'complaint', start: 0, end: 13 },
  { key: 'allergies', start: 13, end: 18 },
  { key: 'medicines', start: 18, end: 20 },
  { key: 'history', start: 20, end: 28 },
  { key: 'womenOnly', start: 28, end: 30 },
  { key: 'insurance', start: 30, end: 31 }
];

const patientFields = [
  'fullName', 'dateOfBirth', 'nationality', 'hotelName',
  'roomNumber', 'telephone', 'homeAddress',
  'arrivalDate', 'departureDate', 'travelCompany',
  'tourGuideTelephone'
];

const detailQuestions = [12, 13, 16, 18, 26, 27, 30];

export default function PatientIntakeForm() {
  const [language, setLanguage] = useState('en');
  const [patient, setPatient] = useState({});
  const [answers, setAnswers] = useState({});
  const [details, setDetails] = useState({});
  const [sex, setSex] = useState('');
  const [preview, setPreview] = useState(false);

  const t = intakeTranslations[language];
  const isArabic = language === 'ar';

  const updatePatient = (key, value) => {
    setPatient(current => ({ ...current, [key]: value }));
  };

  const updateAnswer = (index, value) => {
    setAnswers(current => ({ ...current, [index]: value }));
  };

  const updateDetail = (index, value) => {
    setDetails(current => ({ ...current, [index]: value }));
  };

  const handleReset = () => {
    setPatient({});
    setAnswers({});
    setDetails({});
    setSex('');
    setPreview(false);
  };

  return (
    <main className="intake-page" dir={isArabic ? 'rtl' : 'ltr'}>
      <header className="intake-header no-print">
        <div>
          <span className="intake-eyebrow">RESORT CLINIC</span>
          <h1>{t.title}</h1>
          <p>{t.instruction}</p>
        </div>

        <select
          className="intake-language"
          value={language}
          onChange={e => setLanguage(e.target.value)}
          aria-label="Select language"
        >
          {Object.entries(intakeTranslations).map(([code, item]) => (
            <option value={code} key={code}>
              {item.languageName}
            </option>
          ))}
        </select>
      </header>

      <section className="intake-card">
        <h2>{t.fields.fullName} &amp; {t.fields.nationality}</h2>

        <div className="intake-patient-grid">
          {patientFields.map(key => (
            <label className="intake-field" key={key}>
              <span>{t.fields[key]}</span>
              <input
                type={
                  key === 'dateOfBirth' ||
                  key === 'arrivalDate' ||
                  key === 'departureDate'
                    ? 'date'
                    : 'text'
                }
                value={patient[key] || ''}
                onChange={e => updatePatient(key, e.target.value)}
              />
            </label>
          ))}

          <label className="intake-field">
            <span>{t.fields.sex}</span>
            <select value={sex} onChange={e => setSex(e.target.value)}>
              <option value="">—</option>
              <option value="male">{t.fields.male}</option>
              <option value="female">{t.fields.female}</option>
            </select>
          </label>
        </div>
      </section>

      {sections.map(section => (
        <section className="intake-card" key={section.key}>
          <h2>{t.sections[section.key]}</h2>

          {t.questions.slice(section.start, section.end).map((question, offset) => {
            const index = section.start + offset;
            const needsDetail = detailQuestions.includes(index);

            return (
              <div className="intake-question" key={index}>
                <div className="intake-question-text">
                  <span className="intake-number">{index + 1}</span>
                  <span>{question}</span>
                </div>

                <div className="intake-options">
                  <label>
                    <input
                      type="radio"
                      name={`question-${index}`}
                      checked={answers[index] === 'yes'}
                      onChange={() => updateAnswer(index, 'yes')}
                    />
                    {t.yes}
                  </label>

                  <label>
                    <input
                      type="radio"
                      name={`question-${index}`}
                      checked={answers[index] === 'no'}
                      onChange={() => updateAnswer(index, 'no')}
                    />
                    {t.no}
                  </label>
                </div>

                {needsDetail && answers[index] === 'yes' && (
                  <input
                    className="intake-detail"
                    type="text"
                    value={details[index] || ''}
                    onChange={e => updateDetail(index, e.target.value)}
                    placeholder={t.fields.specify}
                  />
                )}
              </div>
            );
          })}
        </section>
      ))}

      <section className="intake-card">
        <h2>{t.fields.confirmation}</h2>

        <div className="intake-signature-grid">
          <label className="intake-field">
            <span>{t.fields.patientSignature}</span>
            <input type="text" />
          </label>

          <label className="intake-field">
            <span>{t.fields.date}</span>
            <input type="date" />
          </label>
        </div>
      </section>

      <div className="intake-actions no-print">
        <button type="button" onClick={handleReset} className="intake-secondary">
          Reset
        </button>

        <button
          type="button"
          onClick={() => setPreview(!preview)}
          className="intake-secondary"
        >
          {preview ? 'Edit Form' : 'Preview'}
        </button>

        <button
          type="button"
          onClick={() => window.print()}
          className="intake-primary"
        >
          Print Form
        </button>
      </div>

      {preview && (
        <p className="intake-preview-note no-print">
          Preview mode: review the completed form before printing.
        </p>
      )}

      <footer className="intake-footer">
        Resort Clinic System · Sample for review – not for clinical use yet
      </footer>
    </main>
  );
}
