import GeneratorPanel from '../../components/forms/GeneratorPanel';
import { api } from '../../services/api';

const fields = [
  { name: 'objective', label: 'Email Objective', required: true },
  { name: 'audience', label: 'Audience', required: true },
  { name: 'tone', label: 'Tone', defaultValue: 'Friendly and direct' },
  { name: 'context', label: 'Context', type: 'textarea', rows: 8, required: true },
];

export default function EmailGeneratorPage() {
  return (
    <GeneratorPanel
      title="Email Draft Generator"
      subtitle="Generate outbound or follow-up emails in BuildByAlistar voice."
      fields={fields}
      actionLabel="Generate Email"
      outputLabel="Email Draft"
      onGenerate={async (values) => (await api.generateEmail(values)).content}
    />
  );
}
