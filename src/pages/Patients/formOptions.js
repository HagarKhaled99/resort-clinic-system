// Lists used by the patient form: nationalities, phone country codes and autocomplete suggestions.
// [country, nationality, dial code]
const RAW = [
  ["Egypt", "Egyptian", "+20"], ["Germany", "German", "+49"], ["Russia", "Russian", "+7"],
  ["Ukraine", "Ukrainian", "+380"], ["Poland", "Polish", "+48"], ["Czechia", "Czech", "+420"],
  ["Slovakia", "Slovak", "+421"], ["Hungary", "Hungarian", "+36"], ["Romania", "Romanian", "+40"],
  ["Bulgaria", "Bulgarian", "+359"], ["Serbia", "Serbian", "+381"], ["Croatia", "Croatian", "+385"],
  ["Slovenia", "Slovenian", "+386"], ["Bosnia and Herzegovina", "Bosnian", "+387"],
  ["Montenegro", "Montenegrin", "+382"], ["North Macedonia", "Macedonian", "+389"],
  ["Albania", "Albanian", "+355"], ["Italy", "Italian", "+39"], ["France", "French", "+33"],
  ["Spain", "Spanish", "+34"], ["Portugal", "Portuguese", "+351"], ["Netherlands", "Dutch", "+31"],
  ["Belgium", "Belgian", "+32"], ["Luxembourg", "Luxembourgish", "+352"], ["Switzerland", "Swiss", "+41"],
  ["Austria", "Austrian", "+43"], ["United Kingdom", "British", "+44"], ["Ireland", "Irish", "+353"],
  ["Sweden", "Swedish", "+46"], ["Norway", "Norwegian", "+47"], ["Denmark", "Danish", "+45"],
  ["Finland", "Finnish", "+358"], ["Iceland", "Icelandic", "+354"], ["Estonia", "Estonian", "+372"],
  ["Latvia", "Latvian", "+371"], ["Lithuania", "Lithuanian", "+370"], ["Belarus", "Belarusian", "+375"],
  ["Moldova", "Moldovan", "+373"], ["Georgia", "Georgian", "+995"], ["Armenia", "Armenian", "+374"],
  ["Azerbaijan", "Azerbaijani", "+994"], ["Kazakhstan", "Kazakh", "+7"], ["Uzbekistan", "Uzbek", "+998"],
  ["Kyrgyzstan", "Kyrgyz", "+996"], ["Tajikistan", "Tajik", "+992"], ["Turkmenistan", "Turkmen", "+993"],
  ["Turkey", "Turkish", "+90"], ["Greece", "Greek", "+30"], ["Cyprus", "Cypriot", "+357"],
  ["Malta", "Maltese", "+356"], ["Israel", "Israeli", "+972"], ["Palestine", "Palestinian", "+970"],
  ["Jordan", "Jordanian", "+962"], ["Lebanon", "Lebanese", "+961"], ["Syria", "Syrian", "+963"],
  ["Iraq", "Iraqi", "+964"], ["Iran", "Iranian", "+98"], ["Saudi Arabia", "Saudi", "+966"],
  ["United Arab Emirates", "Emirati", "+971"], ["Kuwait", "Kuwaiti", "+965"], ["Qatar", "Qatari", "+974"],
  ["Bahrain", "Bahraini", "+973"], ["Oman", "Omani", "+968"], ["Yemen", "Yemeni", "+967"],
  ["Libya", "Libyan", "+218"], ["Tunisia", "Tunisian", "+216"], ["Algeria", "Algerian", "+213"],
  ["Morocco", "Moroccan", "+212"], ["Mauritania", "Mauritanian", "+222"], ["Sudan", "Sudanese", "+249"],
  ["South Sudan", "South Sudanese", "+211"], ["Ethiopia", "Ethiopian", "+251"], ["Eritrea", "Eritrean", "+291"],
  ["Somalia", "Somali", "+252"], ["Djibouti", "Djiboutian", "+253"], ["Kenya", "Kenyan", "+254"],
  ["Uganda", "Ugandan", "+256"], ["Tanzania", "Tanzanian", "+255"], ["Nigeria", "Nigerian", "+234"],
  ["Ghana", "Ghanaian", "+233"], ["Senegal", "Senegalese", "+221"], ["Cameroon", "Cameroonian", "+237"],
  ["Zambia", "Zambian", "+260"], ["Zimbabwe", "Zimbabwean", "+263"], ["South Africa", "South African", "+27"],
  ["United States", "American", "+1"], ["Canada", "Canadian", "+1"], ["Mexico", "Mexican", "+52"],
  ["Cuba", "Cuban", "+53"], ["Brazil", "Brazilian", "+55"], ["Argentina", "Argentine", "+54"],
  ["Chile", "Chilean", "+56"], ["Colombia", "Colombian", "+57"], ["Peru", "Peruvian", "+51"],
  ["India", "Indian", "+91"], ["Pakistan", "Pakistani", "+92"], ["Bangladesh", "Bangladeshi", "+880"],
  ["Sri Lanka", "Sri Lankan", "+94"], ["Nepal", "Nepalese", "+977"], ["Afghanistan", "Afghan", "+93"],
  ["China", "Chinese", "+86"], ["Japan", "Japanese", "+81"], ["South Korea", "South Korean", "+82"],
  ["Taiwan", "Taiwanese", "+886"], ["Mongolia", "Mongolian", "+976"], ["Thailand", "Thai", "+66"],
  ["Vietnam", "Vietnamese", "+84"], ["Malaysia", "Malaysian", "+60"], ["Singapore", "Singaporean", "+65"],
  ["Indonesia", "Indonesian", "+62"], ["Philippines", "Filipino", "+63"], ["Australia", "Australian", "+61"],
  ["New Zealand", "New Zealander", "+64"],
];

export const COUNTRIES = RAW.map(([country, nationality, dial]) => ({ country, nationality, dial }));

export const NATIONALITIES = [...new Set(COUNTRIES.map((c) => c.nationality))].sort((a, b) =>
  a.localeCompare(b)
);

// One entry per dial code (+1 and +7 are shared by two countries). Egypt first, then A-Z.
const byDial = new Map();
COUNTRIES.forEach(({ country, dial }) => {
  byDial.set(dial, [...(byDial.get(dial) || []), country]);
});
export const DIAL_CODES = [...byDial.entries()]
  .map(([code, names]) => ({ code, first: names[0], label: `${names.join(" / ")} ${code}` }))
  .sort((a, b) => {
    if (a.first === "Egypt") return -1;
    if (b.first === "Egypt") return 1;
    return a.first.localeCompare(b.first);
  });

export const findCountry = (nationality = "") =>
  COUNTRIES.find((c) => c.nationality.toLowerCase() === nationality.trim().toLowerCase());

export const AGES = Array.from({ length: 121 }, (_, i) => i);

// "+20 100 123 4567" -> { code: "+20", number: "1001234567" }
const CODES_LONGEST_FIRST = [...new Set(COUNTRIES.map((c) => c.dial))].sort(
  (a, b) => b.length - a.length
);
export const splitPhone = (phone = "") => {
  const text = String(phone).trim();
  if (!text) return { code: "", number: "" };
  const plus = text.startsWith("+") || text.startsWith("00");
  const digits = text.replace(/\D/g, "");
  if (plus) {
    const withPlus = `+${text.startsWith("00") ? digits.slice(2) : digits}`;
    const code = CODES_LONGEST_FIRST.find((c) => withPlus.startsWith(c));
    if (code) return { code, number: withPlus.slice(code.length) };
  }
  return { code: "", number: digits };
};

export const joinPhone = (code, number) => (code && number ? `${code} ${number}` : number || "");

// Suggestions for text boxes (the nurse can still type anything else)
export const SUGGESTIONS = {
  medicineAllergies: [
    "Penicillin", "Amoxicillin", "Sulfa drugs", "Aspirin", "Ibuprofen", "Diclofenac",
    "Codeine", "Morphine", "Cephalosporins", "Local anaesthetic", "Contrast dye",
  ],
  foodAllergies: [
    "Peanuts", "Tree nuts", "Seafood", "Shellfish", "Fish", "Eggs", "Milk", "Soy", "Wheat / gluten", "Sesame",
  ],
  medicines: [
    "Paracetamol", "Ibuprofen", "Aspirin", "Metformin", "Insulin", "Amlodipine", "Lisinopril",
    "Atorvastatin", "Omeprazole", "Levothyroxine", "Salbutamol inhaler", "Warfarin", "Contraceptive pill",
  ],
  illnesses: [
    "Thyroid disease", "Anaemia", "Cancer", "Hepatitis", "Stroke", "Gout", "Arthritis",
    "Depression / anxiety", "Migraine", "Stomach ulcer", "HIV", "Tuberculosis",
  ],
  surgeries: [
    "Appendectomy", "Caesarean section", "Tonsillectomy", "Hernia repair", "Gallbladder removal",
    "Knee surgery", "Heart surgery", "Cataract surgery",
  ],
};
