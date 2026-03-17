import GeneratorPanel from '../../components/forms/GeneratorPanel';
import { api } from '../../services/api';

const proposalSectionHeadings = [
  'Client Summary',
  'Problem',
  'Solution',
  'Scope',
  'Timeline',
  'Pricing',
  'Next Steps',
];

const sectionKeyMap = {
  'Client Summary': 'clientSummary',
  Problem: 'problem',
  Solution: 'solution',
  Scope: 'scope',
  Timeline: 'timeline',
  Pricing: 'pricing',
  'Next Steps': 'nextSteps',
};

function parseProposalSections(markdown) {
  const lines = markdown.split('\n');
  const sections = {};
  let current = null;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    const heading = proposalSectionHeadings.find((name) => line === `## ${name}`);

    if (heading) {
      current = heading;
      sections[sectionKeyMap[heading]] = '';
      continue;
    }

    if (!current) {
      continue;
    }

    const key = sectionKeyMap[current];
    sections[key] = `${sections[key]}${sections[key] ? '\n' : ''}${rawLine}`.trimEnd();
  }

  return sections;
}

const fields = [
  { name: 'clientName', label: 'Client Name', required: true },
  { name: 'offer', label: 'Offer / Service', required: true },
  { name: 'tone', label: 'Tone', defaultValue: 'Confident, consultative' },
  { name: 'notes', label: 'Client Notes', type: 'textarea', required: true, rows: 8 },
];

export default function ProposalBuilderPage() {
  const handleGenerate = async (values) => {
    const result = await api.generateProposal(values);
    return result.content;
  };

  const exportPdf = (values, output, loading) => (
    <button
      type="button"
      disabled={loading || !output}
      onClick={async () => {
        const blob = await api.exportPdf({
          brandName: 'BuildByAlistar Agency OS',
          title: `${values.clientName} Proposal`,
          clientName: values.clientName,
          ...parseProposalSections(output),
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${values.clientName || 'proposal'}.pdf`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      }}
      className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-slate-500 disabled:cursor-not-allowed disabled:opacity-60"
    >
      Export PDF
    </button>
  );

  return (
    <GeneratorPanel
      title="Proposal Builder"
      subtitle="Turn client discovery notes into a polished proposal draft."
      fields={fields}
      actionLabel="Generate Proposal"
      onGenerate={handleGenerate}
      outputLabel="Proposal Draft"
      extraAction={exportPdf}
    />
  );
}
