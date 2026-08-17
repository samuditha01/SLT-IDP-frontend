import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import PortalDashboard from './pages/PortalDashboard';
import CreateAppWizard from './pages/CreateAppWizard';
import AppDetails from './pages/AppDetails';
import AppAnalytics from './pages/AppAnalytics';
import './styles/global.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Sidebar />}>
          <Route index element={<PortalDashboard />} />
          <Route path="create" element={<CreateAppWizard />} />
          <Route path="apps/:id" element={<AppDetails />} />
          <Route path="apps/:id/analytics" element={<AppAnalytics />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
