import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import ChecklistForm from './pages/ChecklistForm';
import Info from './pages/Info';
import VHFNotification from './pages/VHFNotification';
import PassagePlan from './pages/PassagePlan';
import MilfordPassage from './pages/MilfordPassage';
import ThompsonDoubtfulPassage from './pages/ThompsonDoubtfulPassage';
import BreakseaDuskyPassage from './pages/BreakseaDuskyPassage';
import StewartIslandPassage from './pages/StewartIslandPassage';
import MedicalEvacuation from './pages/MedicalEvacuation';
import DistanceCalculator from './pages/DistanceCalculator';
import EmergencyContacts from './pages/EmergencyContacts';
import Weather from './pages/Weather';
import ImportantDocuments from './pages/ImportantDocuments';
import LogBook from './pages/LogBook';
import { Loader } from 'lucide-react';

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-fiordland-900">
        <Loader className="w-8 h-8 text-brand-teal animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<RequireAuth><Layout /></RequireAuth>}>
        <Route index element={<Home />} />
        <Route path="checklist/:type" element={<ChecklistForm />} />
        <Route path="info" element={<Info />} />
        <Route path="vhf-notification" element={<VHFNotification />} />
        <Route path="passage-plan" element={<PassagePlan />} />
        <Route path="passage-plan/milford" element={<MilfordPassage />} />
        <Route path="passage-plan/thompson-doubtful" element={<ThompsonDoubtfulPassage />} />
        <Route path="passage-plan/breaksea-dusky" element={<BreakseaDuskyPassage />} />
        <Route path="passage-plan/stewart-island" element={<StewartIslandPassage />} />
        <Route path="medical-evacuation" element={<MedicalEvacuation />} />
        <Route path="distance-calculator" element={<DistanceCalculator />} />
        <Route path="emergency-contacts" element={<EmergencyContacts />} />
        <Route path="weather" element={<Weather />} />
        <Route path="documents" element={<ImportantDocuments />} />
        <Route path="logbook" element={<LogBook />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
