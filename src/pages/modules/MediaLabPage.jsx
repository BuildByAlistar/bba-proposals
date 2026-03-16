import { useState } from 'react';
import { Panel } from '../../components/Cards';
import { api } from '../../services/api';

export default function MediaLabPage() {
  const [imagePrompt, setImagePrompt] = useState('');
  const [videoPrompt, setVideoPrompt] = useState('');
  const [imageResult, setImageResult] = useState('');
  const [videoResult, setVideoResult] = useState('');

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Panel title="Social Image Generator" subtitle="Uses Gemini endpoint scaffolding for image ideation.">
        <textarea className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm" rows={5} value={imagePrompt} onChange={(e) => setImagePrompt(e.target.value)} placeholder="Describe desired social image..." />
        <button className="mt-3 rounded-lg bg-violet-500 px-4 py-2 text-sm font-semibold" onClick={async () => {
          const data = await api.generateImage({ prompt: imagePrompt });
          setImageResult(atob(data.data));
        }}>Generate Image Concept</button>
        <pre className="mt-4 whitespace-pre-wrap rounded-lg border border-slate-800 bg-slate-950 p-3 text-xs text-slate-300">{imageResult || 'Generated image concept notes appear here.'}</pre>
      </Panel>

      <Panel title="Video Script Generator" subtitle="Video generation endpoint is scaffolded for future rollout.">
        <textarea className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm" rows={5} value={videoPrompt} onChange={(e) => setVideoPrompt(e.target.value)} placeholder="Describe product + objective for video..." />
        <div className="mt-3 flex gap-3">
          <button className="rounded-lg bg-violet-500 px-4 py-2 text-sm font-semibold" onClick={async () => {
            const data = await api.generateVideoScript({ objective: videoPrompt, audience: 'Prospects', product: 'Agency Offer', lengthSeconds: 45 });
            setVideoResult(data.content);
          }}>Generate Script</button>
          <button className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold" onClick={async () => {
            const data = await api.generateVideo({ prompt: videoPrompt });
            setVideoResult(`${videoResult}\n\n${JSON.stringify(data, null, 2)}`.trim());
          }}>Test /generate-video</button>
        </div>
        <pre className="mt-4 whitespace-pre-wrap rounded-lg border border-slate-800 bg-slate-950 p-3 text-xs text-slate-300">{videoResult || 'Script output appears here.'}</pre>
      </Panel>
    </div>
  );
}
