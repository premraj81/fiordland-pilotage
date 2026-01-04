import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import ChecklistForm from './pages/ChecklistForm';
import Info from './pages/Info';
import VHFNotification from './pages/VHFNotification';
import PassagePlan from './pages/PassagePlan';
import MilfordPassage from './pages/MilfordPassage';
import ThompsonDoubtfulPassage from './pages/ThompsonDoubtfulPassage';
import BreakseaDuskyPassage from './pages/BreakseaDuskyPassage';
import MedicalEvacuation from './pages/MedicalEvacuation';
import DistanceCalculator from './pages/DistanceCalculator';
import EmergencyContacts from './pages/EmergencyContacts';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="checklist/:type" element={<ChecklistForm />} />
        <Route path="info" element={<Info />} />
        <Route path="vhf-notification" element={<VHFNotification />} />
        <Route path="passage-plan" element={<PassagePlan />} />
        <Route path="passage-plan/milford" element={<MilfordPassage />} />
        <Route path="passage-plan/thompson-doubtful" element={<ThompsonDoubtfulPassage />} />
        <Route path="passage-plan/breaksea-dusky" element={<BreakseaDuskyPassage />} />
        <Route path="medical-evacuation" element={<MedicalEvacuation />} />
        <Route path="distance-calculator" element={<DistanceCalculator />} />
        <Route path="emergency-contacts" element={<EmergencyContacts />} />
      </Route>
    </Routes>
  );
}

export default App;
