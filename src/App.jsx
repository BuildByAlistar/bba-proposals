import {
  Briefcase,
  BookOpen,
  ImageIcon,
  LayoutDashboard,
  Mail,
  Video,
} from 'lucide-react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AppShell from './components/AppShell';
import DashboardPage from './pages/DashboardPage';
import ProposalBuilderPage from './pages/modules/ProposalBuilderPage';
import EmailGeneratorPage from './pages/modules/EmailGeneratorPage';
import IdeasGeneratorPage from './pages/modules/IdeasGeneratorPage';
import MediaLabPage from './pages/modules/MediaLabPage';
import VideoPage from './pages/modules/VideoPage';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/proposal-builder', label: 'Proposal Builder', icon: Briefcase },
  { path: '/email-generator', label: 'Email Drafts', icon: Mail },
  { path: '/ideas-generator', label: 'Ideas Generator', icon: BookOpen },
  { path: '/media-lab', label: 'Media Lab', icon: ImageIcon },
  { path: '/video', label: 'Video', icon: Video },
];

export default function App() {
  return (
    <AppShell navItems={navItems}>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/proposal-builder" element={<ProposalBuilderPage />} />
        <Route path="/email-generator" element={<EmailGeneratorPage />} />
        <Route path="/ideas-generator" element={<IdeasGeneratorPage />} />
        <Route path="/media-lab" element={<MediaLabPage />} />
        <Route path="/video" element={<VideoPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
}
