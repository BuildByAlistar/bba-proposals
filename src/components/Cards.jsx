export function StatCard({ label, value, delta }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 p-5">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-50">{value}</p>
      <p className="mt-2 text-sm text-emerald-300">{delta}</p>
    </div>
  );
}

export function ToolCard({ icon: Icon, title, description }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 transition hover:border-violet-400/50 hover:bg-slate-900">
      <div className="mb-4 inline-flex rounded-lg border border-slate-700 bg-slate-950 p-2.5">
        <Icon className="h-5 w-5 text-violet-300" />
      </div>
      <h3 className="text-base font-semibold text-slate-100">{title}</h3>
      <p className="mt-1 text-sm text-slate-400">{description}</p>
    </div>
  );
}

export function Panel({ title, subtitle, children }) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
      <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
      {subtitle ? <p className="mt-1 text-sm text-slate-400">{subtitle}</p> : null}
      <div className="mt-5">{children}</div>
    </section>
  );
}
