import GeneratorPanel from '../../components/forms/GeneratorPanel';
import { api } from '../../services/api';

const fields = [
  { name: 'niche', label: 'Niche / Offer', required: true },
  { name: 'channels', label: 'Channels', defaultValue: 'LinkedIn, Instagram, Email' },
  { name: 'goal', label: 'Goal', required: true },
];

export default function IdeasGeneratorPage() {
  return (
    <GeneratorPanel
      title="Ideas Generator"
      subtitle="Generate content ideas and campaign angles fast."
      fields={fields}
      actionLabel="Generate Ideas"
      outputLabel="Ideas & Draft Concepts"
      onGenerate={async (values) => (await api.generateIdeas(values)).content}
    />
  );
}
