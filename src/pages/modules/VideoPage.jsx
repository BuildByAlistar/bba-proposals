import { Panel } from '../../components/Cards';

export default function VideoPage() {
  return (
    <Panel
      title="Video"
      subtitle="Placeholder module for future AI video generation."
    >
      <div className="rounded-xl border border-dashed border-slate-700 bg-slate-950/60 p-5 text-sm text-slate-300">
        Video generation remains a placeholder for the MVP. No production generation pipeline is connected yet.
      </div>
    </Panel>
  );
}
