import { useState } from 'react';
import { Panel } from '../Cards';

export default function GeneratorPanel({ title, subtitle, fields, actionLabel, onGenerate, outputLabel = 'Output', extraAction }) {
  const [values, setValues] = useState(() => Object.fromEntries(fields.map((field) => [field.name, field.defaultValue || ''])));
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const updateField = (name, value) => setValues((prev) => ({ ...prev, [name]: value }));

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result = await onGenerate(values);
      setOutput(result);
    } catch (err) {
      setError(err.message || 'Failed to generate output');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr,1fr]">
      <Panel title={title} subtitle={subtitle}>
        <form onSubmit={submit} className="space-y-4">
          {fields.map((field) => (
            <label key={field.name} className="block space-y-1.5">
              <span className="text-sm font-medium text-slate-200">{field.label}</span>
              {field.type === 'textarea' ? (
                <textarea
                  value={values[field.name]}
                  onChange={(e) => updateField(field.name, e.target.value)}
                  rows={field.rows || 5}
                  required={field.required}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-violet-400 focus:outline-none"
                />
              ) : (
                <input
                  value={values[field.name]}
                  onChange={(e) => updateField(field.name, e.target.value)}
                  type={field.type || 'text'}
                  required={field.required}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-violet-400 focus:outline-none"
                />
              )}
            </label>
          ))}

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-violet-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Generating…' : actionLabel}
            </button>
            {extraAction ? extraAction(values, output, loading) : null}
          </div>
          {error ? <p className="text-sm text-rose-300">{error}</p> : null}
        </form>
      </Panel>

      <Panel title={outputLabel} subtitle="Review and refine before sending to clients.">
        <pre className="max-h-[600px] overflow-auto whitespace-pre-wrap rounded-lg border border-slate-800 bg-slate-950 p-4 text-sm text-slate-300">
          {output || 'Your generated content will appear here.'}
        </pre>
      </Panel>
    </div>
  );
}
