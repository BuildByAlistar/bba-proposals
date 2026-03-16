import { NavLink } from 'react-router-dom';
import { UserCircle, Zap } from 'lucide-react';

const linkBaseClass =
  'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200';

const linkClassName = ({ isActive }) =>
  `${linkBaseClass} ${
    isActive
      ? 'bg-slate-800 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]'
      : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100'
  }`;

export default function Sidebar({ navItems }) {
  return (
    <aside className="hidden w-72 flex-shrink-0 border-r border-slate-800/90 bg-slate-950/90 lg:flex lg:flex-col">
      <div className="border-b border-slate-800/90 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-violet-400/30 bg-violet-500/20 p-2.5 text-violet-300">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Build By Alistar</p>
            <h1 className="text-lg font-semibold tracking-tight text-slate-100">Agency OS</h1>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => (
          <NavLink key={item.path} to={item.path} className={linkClassName} end={item.path === '/'}>
            <item.icon className="h-4 w-4" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-slate-800/90 p-4">
        <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900 px-3 py-3">
          <UserCircle className="h-9 w-9 text-slate-500" />
          <div>
            <p className="text-sm font-semibold text-slate-100">Alistar</p>
            <p className="text-xs text-slate-400">Admin Workspace</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
