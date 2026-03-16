import { Panel } from '../../components/Cards';

export default function MediaLabPage() {
  return (
    <Panel
      title="Media Lab"
      subtitle="Placeholder module for future image/video workflows."
    >
      <div className="rounded-xl border border-dashed border-slate-700 bg-slate-950/60 p-5 text-sm text-slate-300">
        Media Lab and Video features are intentionally placeholders in this MVP release. Core backend support is currently focused on proposal, email, ideas, and branded PDF export.
      </div>
    </Panel>
  );
}
