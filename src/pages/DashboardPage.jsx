import { Briefcase, BookOpen, ImageIcon, Mail, Video } from 'lucide-react';
import { Panel, StatCard, ToolCard } from '../components/Cards';

const tools = [
  { icon: Briefcase, title: 'Proposal Builder', description: 'Generate polished proposals with your brand voice and pricing blocks.' },
  { icon: Mail, title: 'Sales Emails', description: 'Write outbound sequences, follow-ups, and objection handling emails.' },
  { icon: ImageIcon, title: 'Ad Creatives', description: 'Draft static ad concepts with copy angles and creative direction.' },
  { icon: Video, title: 'Video Scripts', description: 'Map hooks, beats, and CTA moments for short-form and VSL content.' },
  { icon: BookOpen, title: 'Content Ideas', description: 'Build high-leverage content calendars from ICP pain points.' },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Active Proposals" value="24" delta="+8% this week" />
        <StatCard label="Email Win Rate" value="41%" delta="+3.2% from last cycle" />
        <StatCard label="Campaign Drafts" value="17" delta="+5 new today" />
        <StatCard label="Published Ideas" value="68" delta="+11 this month" />
      </section>

      <Panel title="Agency Toolkit" subtitle="Everything your team needs to move from strategy to execution.">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {tools.map((tool) => (
            <ToolCard key={tool.title} {...tool} />
          ))}
        </div>
      </Panel>
    </div>
  );
}
