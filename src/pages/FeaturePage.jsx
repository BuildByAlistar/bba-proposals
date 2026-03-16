import { Panel } from '../components/Cards';

export default function FeaturePage({ title, description, bullets }) {
  return (
    <div className="space-y-6">
      <Panel title={title} subtitle={description}>
        <div className="grid gap-3 md:grid-cols-2">
          {bullets.map((item) => (
            <div key={item} className="rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm text-slate-300">
              {item}
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
