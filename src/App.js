import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import { getCurrentUser } from './utils/auth';
import Layout from './components/Layout/Layout';

// ---- Hagar ----
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
// ---- Menna ----
import Patients from './pages/Patients/Patients';
import Encounter from './pages/Encounter/Encounter';
// ---- Salma ----
import Medications from './pages/Medications/Medications';
import Emergency from './pages/Emergency/Emergency';
// ---- Marvey ----
import Statistics from './pages/Statistics/Statistics';
import PatientForm from './pages/PatientForm/PatientForm';

// Any page inside this wrapper needs the user to be logged in.
function ProtectedRoute({ children }) {
  return getCurrentUser() ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* All pages below share the Sidebar + Top bar (Layout) */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/encounter" element={<Encounter />} />
          <Route path="/medications" element={<Medications />} />
          <Route path="/emergency" element={<Emergency />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/patient-form" element={<PatientForm />} />
        </Route>

        {/* Anything else → dashboard (or login if not logged in) */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
