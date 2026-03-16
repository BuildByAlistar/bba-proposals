import React, { useState } from 'react';
import {
  Briefcase, Mail, ImageIcon, Video, BookOpen, LayoutDashboard,
  UserCircle, Zap, Target
} from 'lucide-react';

// ==============================================
// 1. STYLED REUSABLE COMPONENTS
// ==============================================

const StyledInput = (props) => (
  <input 
    {...props}
    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
  />
);

const NavItem = ({ icon, label, isActive, onClick }) => (
  <button 
    onClick={onClick} 
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
  >
    {icon}
    <span className="truncate">{label}</span>
  </button>
);

const ToolCard = ({ icon, title, description, onClick }) => (
  <button 
    onClick={onClick} 
    className="text-left p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500 hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-blue-900/20"
  >
    <div className="bg-slate-950 border border-slate-700 rounded-full w-14 h-14 flex items-center justify-center mb-4">
      {icon}
    </div>
    <h3 className="font-bold text-white text-lg mb-1">{title}</h3>
    <p className="text-slate-400 text-sm">{description}</p>
  </button>
);

// ==============================================
// 2. VIEW COMPONENTS (TABS)
// ==============================================

const DashboardView = ({ clientContext, handleInputChange, onNavigate }) => {
    const toolCards = [
        { id: 'proposal', title: 'Proposal Builder', description: 'Generate client proposals', icon: <Briefcase className="w-8 h-8 text-blue-400" />, tab: 'proposal' },
        { id: 'email', title: 'Sales Emails', description: 'Draft outreach emails', icon: <Mail className="w-8 h-8 text-purple-400" />, tab: 'email' },
        { id: 'ads', title: 'Ad Creatives', description: 'Design campaign assets', icon: <ImageIcon className="w-8 h-8 text-amber-400" />, tab: 'dashboard' }, // These can stay on dashboard for now
        { id: 'video', title: 'Video Scripts', description: 'Write marketing videos', icon: <Video className="w-8 h-8 text-rose-400" />, tab: 'dashboard' },
        { id: 'content', title: 'Content Ideas', description: 'Brainstorm blog posts', icon: <BookOpen className="w-8 h-8 text-emerald-400" />, tab: 'dashboard' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            {/* Command Center */}
            <div className="p-6 bg-slate-900/80 rounded-2xl border border-slate-800">
                <h2 className="text-xl font-bold text-white mb-2">Agency Command Center</h2>
                <p className="text-slate-400 mb-6">Set a global client context. This data will pre-fill other tools.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StyledInput name="name" placeholder="Client Name" value={clientContext.name} onChange={handleInputChange} />
                    <StyledInput name="company" placeholder="Company Name" value={clientContext.company} onChange={handleInputChange} />
                    <StyledInput name="industry" placeholder="Industry" value={clientContext.industry} onChange={handleInputChange} />
                    <StyledInput name="painPoint" placeholder="Core Pain Point" value={clientContext.painPoint} onChange={handleInputChange} />
                </div>
            </div>

            {/* Toolkit */}
            <div>
                <h3 className="text-lg font-bold text-white mb-5">Agency Toolkit</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {toolCards.map((card) => (
                        <ToolCard 
                            key={card.id}
                            icon={card.icon}
                            title={card.title}
                            description={card.description}
                            onClick={() => onNavigate(card.tab)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

const PlaceholderView = ({ title, icon }) => (
    <div className="flex flex-col items-center justify-center h-full text-slate-600 text-center animate-in fade-in duration-300">
        <div className="mb-4">{icon}</div>
        <h2 className="text-2xl font-bold text-slate-400">{title}</h2>
        <p>This tool is under construction.</p>
    </div>
);


// ==============================================
// 3. MAIN APP COMPONENT
// ==============================================

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [clientContext, setClientContext] = useState({
    name: '',
    company: 'Alistar',
    industry: '',
    painPoint: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClientContext(prev => ({ ...prev, [name]: value }));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView clientContext={clientContext} handleInputChange={handleInputChange} onNavigate={setActiveTab} />;
      case 'proposal':
        return <PlaceholderView title="Proposal Builder" icon={<Briefcase size={48} />} />;
      case 'email':
        return <PlaceholderView title="Sales Emails" icon={<Mail size={48} />} />;
      default:
        return <DashboardView clientContext={clientContext} handleInputChange={handleInputChange} onNavigate={setActiveTab} />;
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'proposal', label: 'Proposal Builder', icon: <Briefcase size={18} /> },
    { id: 'email', label: 'Sales Emails', icon: <Mail size={18} /> },
  ];

  return (
    <div className="flex min-h-screen w-full bg-slate-950 text-slate-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col">
        <div className="p-5 h-[81px] border-b border-slate-800 flex items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg"><Zap className="w-5 h-5 text-white" /></div>
            <span className="font-bold text-white text-xl tracking-tight">Agency OS</span>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map(item => (
            <NavItem 
              key={item.id}
              icon={item.icon} 
              label={item.label} 
              isActive={activeTab === item.id} 
              onClick={() => setActiveTab(item.id)} 
            />
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
            <UserCircle className="w-9 h-9 text-slate-500" />
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-white truncate">Alistar</p>
              <p className="text-xs text-slate-400 truncate">Admin Workspace</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
         <header className="flex-shrink-0 h-[81px] flex justify-between items-center px-8 border-b border-slate-800">
            <h1 className="text-2xl font-bold text-white">
                {navItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
            </h1>
             <div className="flex items-center gap-3">
                 <Target className="text-slate-500" size={18}/>
                 <span className="text-sm font-medium text-slate-400">Client Context: <strong className="text-white">{clientContext.company || 'Not Set'}</strong></span>
            </div>
        </header>
        <div className="flex-1 p-8 overflow-y-auto">
            {renderContent()}
        </div>
      </main>
    </div>
  );
}