import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const RouterContext = createContext(null);

function normalize(path) {
  if (!path) return '/';
  return path.startsWith('/') ? path : `/${path}`;
}

export function BrowserRouter({ children }) {
  const [pathname, setPathname] = useState(() => window.location.pathname || '/');

  useEffect(() => {
    const handlePop = () => setPathname(window.location.pathname || '/');
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, []);

  const navigate = (to, { replace = false } = {}) => {
    const next = normalize(to);
    if (next === window.location.pathname) return;
    window.history[replace ? 'replaceState' : 'pushState']({}, '', next);
    setPathname(next);
  };

  const value = useMemo(() => ({ pathname, navigate }), [pathname]);

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function useLocation() {
  const context = useContext(RouterContext);
  if (!context) throw new Error('useLocation must be used within BrowserRouter');
  return { pathname: context.pathname };
}

export function NavLink({ to, className, children, end = false, onClick }) {
  const { pathname, navigate } = useContext(RouterContext);
  const target = normalize(to);
  const isActive = end ? pathname === target : pathname === target || pathname.startsWith(`${target}/`);

  const resolvedClassName = typeof className === 'function' ? className({ isActive }) : className;

  return (
    <a
      href={target}
      className={resolvedClassName}
      onClick={(event) => {
        event.preventDefault();
        navigate(target);
        onClick?.(event);
      }}
    >
      {typeof children === 'function' ? children({ isActive }) : children}
    </a>
  );
}

export function Route({ path, element }) {
  return { path, element };
}

export function Routes({ children }) {
  const { pathname } = useContext(RouterContext);
  const routes = Array.isArray(children) ? children : [children];

  for (const route of routes.filter(Boolean)) {
    const routePath = route.props.path;
    if (routePath === '*') return route.props.element;
    if (pathname === routePath) return route.props.element;
  }

  return null;
}

export function Navigate({ to, replace = false }) {
  const { navigate } = useContext(RouterContext);
  useEffect(() => {
    navigate(to, { replace });
  }, [navigate, replace, to]);
  return null;
}
