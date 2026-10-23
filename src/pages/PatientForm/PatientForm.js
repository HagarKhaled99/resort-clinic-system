import React, { useState } from 'react';
import './PatientForm.css';

const translations = {
  en: {
    eyebrow: 'PATIENT MANAGEMENT', title: 'Patient Registration', subtitle: 'Create a patient profile for the resort clinic.', language: 'العربية',
    personal: 'Personal information', contact: 'Contact information', medical: 'Medical information', first: 'First name', last: 'Last name', dob: 'Date of birth', gender: 'Gender', choose: 'Select an option', female: 'Female', male: 'Male', other: 'Other / Prefer not to say', phone: 'Phone number', email: 'Email address', address: 'Home address', nationality: 'Nationality', room: 'Room / Villa number', blood: 'Blood type', allergies: 'Known allergies', conditions: 'Existing medical conditions', notes: 'Additional notes', emergency: 'Emergency contact', emergencyName: 'Contact full name', relationship: 'Relationship', emergencyPhone: 'Contact phone', required: 'Required field', submit: 'Save patient (demo)', print: 'Print form', reset: 'Clear form', privacy: 'Frontend demo only. Do not enter real patient or sensitive medical information.', success: 'Demo patient profile saved in this page.', name: 'Full name', genderOptions: 'Choose gender', maleLabel: 'Male', femaleLabel: 'Female', none: 'None known', validation: 'Please complete all required fields before saving.'
  },
  ar: {
    eyebrow: 'إدارة المرضى', title: 'تسجيل مريض جديد', subtitle: 'إنشاء ملف مريض لعيادة المنتجع.', language: 'English',
    personal: 'البيانات الشخصية', contact: 'بيانات التواصل', medical: 'البيانات الطبية', first: 'الاسم الأول', last: 'اسم العائلة', dob: 'تاريخ الميلاد', gender: 'النوع', choose: 'اختر', female: 'أنثى', male: 'ذكر', other: 'آخر / أفضل عدم الإفصاح', phone: 'رقم الهاتف', email: 'البريد الإلكتروني', address: 'عنوان السكن', nationality: 'الجنسية', room: 'رقم الغرفة / الفيلا', blood: 'فصيلة الدم', allergies: 'الحساسية المعروفة', conditions: 'الحالات الطبية الحالية', notes: 'ملاحظات إضافية', emergency: 'جهة اتصال للطوارئ', emergencyName: 'اسم جهة الاتصال', relationship: 'صلة القرابة', emergencyPhone: 'رقم هاتف الطوارئ', required: 'حقل مطلوب', submit: 'حفظ بيانات المريض (تجريبي)', print: 'طباعة الاستمارة', reset: 'مسح البيانات', privacy: 'هذه واجهة تجريبية فقط. لا تدخلي بيانات مرضى حقيقية أو معلومات طبية حساسة.', success: 'تم حفظ بيانات المريض التجريبية في الصفحة.', name: 'الاسم بالكامل', genderOptions: 'اختاري النوع', maleLabel: 'ذكر', femaleLabel: 'أنثى', none: 'لا يوجد حسب المعلومات المتاحة', validation: 'من فضلك استكملي الحقول المطلوبة قبل الحفظ.'
  }
};

const initialForm = {
  firstName: '', lastName: '', dob: '', gender: '', phone: '', email: '', address: '', nationality: '', room: '', bloodType: '', allergies: '', conditions: '', notes: '', emergencyName: '', relationship: '', emergencyPhone: ''
};

function Field({ label, name, value, onChange, required, type = 'text', options, placeholder, dir }) {
  return (
    <div className="patient-field">
      <label htmlFor={name}>{label}{required && <span className="required-mark"> *</span>}</label>
      {options ? (
        <select id={name} name={name} value={value} onChange={onChange} required={required}>
          <option value="">{placeholder}</option>
          {options.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}
        </select>
      ) : type === 'textarea' ? (
        <textarea id={name} name={name} value={value} onChange={onChange} placeholder={placeholder} rows={3} dir={dir} />
      ) : (
        <input id={name} name={name} type={type} value={value} onChange={onChange} required={required} placeholder={placeholder || ''} dir={dir} />
      )}
    </div>
  );
}

export default function PatientForm() {
  const [language, setLanguage] = useState('en');
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState('');
  const t = translations[language];
  const isArabic = language === 'ar';
  const direction = isArabic ? 'rtl' : 'ltr';

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setMessage('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setMessage(t.success);
  };

  const handleReset = () => {
    setForm(initialForm);
    setMessage('');
  };

  return (
    <main className="patient-form-page" dir={direction}>
      <header className="patient-form-header no-print">
        <div className="form-heading-icon" aria-hidden="true">✚</div>
        <div className="form-heading-copy"><p className="form-eyebrow">{t.eyebrow}</p><h1>{t.title}</h1><p>{t.subtitle}</p></div>
        <button type="button" className="language-button" onClick={() => { setLanguage(isArabic ? 'en' : 'ar'); setMessage(''); }} aria-label="Change language">文A&nbsp; {t.language}</button>
      </header>

      <form className="patient-form-card" onSubmit={handleSubmit}>
        <div className="form-card-top"><div><span className="form-step">01</span><span className="form-card-title">{t.personal}</span></div><span className="required-hint">* {t.required}</span></div>
        <div className="patient-fields-grid">
          <Field label={t.first} name="firstName" value={form.firstName} onChange={handleChange} required />
          <Field label={t.last} name="lastName" value={form.lastName} onChange={handleChange} required />
          <Field label={t.dob} name="dob" type="date" value={form.dob} onChange={handleChange} required />
          <Field label={t.gender} name="gender" value={form.gender} onChange={handleChange} required placeholder={t.choose} options={[{ value: 'Female', label: t.female }, { value: 'Male', label: t.male }, { value: 'Other', label: t.other }]} />
        </div>

        <div className="form-section-divider"><span className="form-step">02</span><span className="form-card-title">{t.contact}</span></div>
        <div className="patient-fields-grid">
          <Field label={t.phone} name="phone" type="tel" value={form.phone} onChange={handleChange} required placeholder="+20" />
          <Field label={t.email} name="email" type="email" value={form.email} onChange={handleChange} />
          <Field label={t.nationality} name="nationality" value={form.nationality} onChange={handleChange} />
          <Field label={t.room} name="room" value={form.room} onChange={handleChange} />
          <div className="field-span-two"><Field label={t.address} name="address" value={form.address} onChange={handleChange} /></div>
        </div>

        <div className="form-section-divider"><span className="form-step">03</span><span className="form-card-title">{t.medical}</span></div>
        <div className="patient-fields-grid">
          <Field label={t.blood} name="bloodType" value={form.bloodType} onChange={handleChange} placeholder={t.choose} options={['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((value) => ({ value, label: value }))} />
          <Field label={t.allergies} name="allergies" value={form.allergies} onChange={handleChange} placeholder={t.none} />
          <div className="field-span-two"><Field label={t.conditions} name="conditions" value={form.conditions} onChange={handleChange} type="textarea" /></div>
          <div className="field-span-two"><Field label={t.notes} name="notes" value={form.notes} onChange={handleChange} type="textarea" /></div>
        </div>

        <div className="form-section-divider"><span className="form-step">04</span><span className="form-card-title">{t.emergency}</span></div>
        <div className="patient-fields-grid">
          <Field label={t.emergencyName} name="emergencyName" value={form.emergencyName} onChange={handleChange} />
          <Field label={t.relationship} name="relationship" value={form.relationship} onChange={handleChange} />
          <Field label={t.emergencyPhone} name="emergencyPhone" type="tel" value={form.emergencyPhone} onChange={handleChange} />
        </div>

        {message && <div className="form-feedback" role="status">{message}</div>}
        <div className="form-actions no-print">
          <button type="button" className="secondary-form-button" onClick={handleReset}>{t.reset}</button>
          <div className="form-primary-actions"><button type="button" className="print-form-button" onClick={() => window.print()}>▣&nbsp; {t.print}</button><button type="submit" className="save-form-button">{t.submit} <span aria-hidden="true">→</span></button></div>
        </div>
        <p className="form-privacy-note no-print">ⓘ&nbsp; {t.privacy}</p>
        <div className="print-footer"><span>Resort Clinic System</span><span>{isArabic ? 'استمارة تسجيل مريض' : 'Patient registration form'}</span></div>
      </form>
    </main>
  );
}
