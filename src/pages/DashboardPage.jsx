import { NavLink } from 'react-router-dom';
import { Briefcase, BookOpen, Mail, Sparkles } from 'lucide-react';
import { Panel, StatCard } from '../components/Cards';

const mvpTools = [
  {
    icon: Briefcase,
    title: 'Proposal Builder',
    description: 'Generate polished proposals from client notes and export branded PDFs.',
    to: '/proposal-builder',
  },
  {
    icon: Mail,
    title: 'Email Draft Generator',
    description: 'Draft outreach and follow-up emails in your agency voice.',
    to: '/email-generator',
  },
  {
    icon: BookOpen,
    title: 'Ideas Generator',
    description: 'Produce campaign ideas and content drafts for growth channels.',
    to: '/ideas-generator',
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Internal Mode" value="Private" delta="Only accessible to BuildByAlistar" />
        <StatCard label="MVP Modules" value="6" delta="Dashboard + Proposal + Email + Ideas + Media + Video" />
        <StatCard label="AI Provider" value="Gemini" delta="Text generation for core internal workflows" />
        <StatCard label="PDF Engine" value="Puppeteer" delta="Branded proposal export" />
      </section>

      <Panel title="Agency OS MVP" subtitle="One dashboard to control your internal proposal workflow.">
        <div className="grid gap-4 md:grid-cols-3">
          {mvpTools.map((tool) => (
            <NavLink
              key={tool.title}
              to={tool.to}
              className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 transition hover:border-violet-400/50"
            >
              <div className="mb-4 inline-flex rounded-lg border border-slate-700 bg-slate-950 p-2.5">
                <tool.icon className="h-5 w-5 text-violet-300" />
              </div>
              <h3 className="text-base font-semibold text-slate-100">{tool.title}</h3>
              <p className="mt-1 text-sm text-slate-400">{tool.description}</p>
            </NavLink>
          ))}
        </div>
      </Panel>

      <Panel title="What ships now" subtitle="Stable MVP first. Media and video are placeholders for now.">
        <ul className="space-y-2 text-sm text-slate-300">
          {[
            'Proposal generation endpoint + builder UI',
            'Email draft generation endpoint + UI',
            'Ideas generation endpoint + UI',
            'PDF export endpoint with Puppeteer',
            'Media Lab and Video pages reserved as placeholders',
          ].map((item) => (
            <li key={item} className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-violet-300" /> {item}
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
