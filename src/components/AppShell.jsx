import { Menu, Target } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { useMemo, useState } from 'react';
import Sidebar from './Sidebar';

export default function AppShell({ navItems, children }) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const current = useMemo(
    () => navItems.find((item) => (item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path))),
    [location.pathname, navItems],
  );

  return (
    <div className="min-h-screen bg-[#05070D] text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-[1800px]">
        <Sidebar navItems={navItems} />
        <div className="flex min-h-screen flex-1 flex-col">
          <header className="sticky top-0 z-40 border-b border-slate-800/90 bg-[#05070D]/90 px-4 backdrop-blur md:px-8">
            <div className="flex h-16 items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMenuOpen((prev) => !prev)}
                  className="rounded-lg border border-slate-800 bg-slate-900/80 p-2 text-slate-300 lg:hidden"
                  aria-label="Toggle navigation"
                >
                  <Menu className="h-4 w-4" />
                </button>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Workspace</p>
                  <h2 className="text-xl font-semibold tracking-tight text-slate-50">{current?.label ?? 'Agency OS'}</h2>
                </div>
              </div>

              <div className="hidden items-center gap-2 rounded-full border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-300 sm:flex">
                <Target className="h-3.5 w-3.5 text-violet-300" />
                Client Context: <span className="font-medium text-slate-100">Alistar</span>
              </div>
            </div>

            {menuOpen && (
              <nav className="space-y-1 border-t border-slate-800 py-3 lg:hidden">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                        isActive ? 'bg-slate-800 text-slate-100' : 'text-slate-400'
                      }`
                    }
                    end={item.path === '/'}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </NavLink>
                ))}
              </nav>
            )}
          </header>

          <main className="flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
