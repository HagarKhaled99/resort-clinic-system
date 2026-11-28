
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import { getCurrentUser, hasRole } from './utils/auth';
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
import PatientIntakeForm from './pages/PatientIntakeForm/PatientIntakeForm';

// ---- Follow-Ups ----
import FollowUps from './pages/FollowUps/FollowUps';

// Any page inside this wrapper needs the user to be logged in.
function ProtectedRoute({ children }) {
  return getCurrentUser() ? children : <Navigate to="/login" replace />;
}

// Only users with one of these roles may open the page; others go to the dashboard.
function RoleRoute({ roles, children }) {
  return hasRole(...roles) ? children : <Navigate to="/dashboard" replace />;
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
          <Route path="/follow-ups" element={<FollowUps />} />
          <Route path="/medications" element={<Medications />} />
          <Route path="/emergency" element={<Emergency />} />
          <Route
            path="/statistics"
            element={<RoleRoute roles={['doctor']}><Statistics /></RoleRoute>}
          />
          <Route path="/patient-form" element={<PatientForm />} />
          <Route path="/patient-intake" element={<PatientIntakeForm />} />
        </Route>

        {/* Anything else → dashboard (or login if not logged in) */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
