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
import FeaturePage from './pages/FeaturePage';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/proposal-builder', label: 'Proposal Builder', icon: Briefcase },
  { path: '/sales-emails', label: 'Sales Emails', icon: Mail },
  { path: '/ad-creatives', label: 'Ad Creatives', icon: ImageIcon },
  { path: '/video-scripts', label: 'Video Scripts', icon: Video },
  { path: '/content-ideas', label: 'Content Ideas', icon: BookOpen },
];

export default function App() {
  return (
    <AppShell navItems={navItems}>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route
          path="/proposal-builder"
          element={
            <FeaturePage
              title="Proposal Builder"
              description="Create high-converting proposals with reusable sections and pricing anchors."
              bullets={[
                'Reusable scope-of-work blocks',
                'Tiered pricing and upsell tables',
                'Auto-generated executive summary',
                'Client-ready PDF export workflow',
              ]}
            />
          }
        />
        <Route
          path="/sales-emails"
          element={
            <FeaturePage
              title="Sales Emails"
              description="Launch outbound and nurture campaigns with a consistent agency voice."
              bullets={[
                'Cold outreach sequence planner',
                'Follow-up templates with objection handling',
                'Personalization prompt fields',
                'CTA and tone QA checklist',
              ]}
            />
          }
        />
        <Route
          path="/ad-creatives"
          element={
            <FeaturePage
              title="Ad Creatives"
              description="Build ad concepts and copy frameworks for paid social and search channels."
              bullets={[
                'Headline and hook variant generator',
                'Creative direction prompts for designers',
                'Platform-safe copy length guidance',
                'Offer angle testing matrix',
              ]}
            />
          }
        />
        <Route
          path="/video-scripts"
          element={
            <FeaturePage
              title="Video Scripts"
              description="Plan compelling video scripts optimized for retention and conversion."
              bullets={[
                'Hook-first script templates',
                'Scene-by-scene talking points',
                'Objection rebuttal segments',
                'Clear CTA and closing structures',
              ]}
            />
          }
        />
        <Route
          path="/content-ideas"
          element={
            <FeaturePage
              title="Content Ideas"
              description="Generate strategic content ideas mapped to funnel stage and intent."
              bullets={[
                'Topic clusters by customer pain points',
                'SEO-informed campaign themes',
                'Cross-channel repurposing suggestions',
                'Editorial calendar starter prompts',
              ]}
            />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
}
