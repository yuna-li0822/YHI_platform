import type { HeartDevice } from '../types/HeartDevice';

interface ComparisonProps {
  devices: [HeartDevice, HeartDevice];
}

const Comparison = ({ devices }: ComparisonProps) => {
  const [primary, secondary] = devices;
  const fields = [
    { label: 'Weight', key: 'weight' },
    { label: 'Material', key: 'material' },
    { label: 'Lifespan', key: 'lifespan' },
    { label: 'Requires anticoagulants', key: 'anticoagulants' },
    { label: 'Typical patient age', key: 'patientAge' },
    { label: 'Delivery method', key: 'delivery' },
    { label: 'Surgery type', key: 'surgery' },
    { label: 'Durability', key: 'durability' },
    { label: 'Cost category', key: 'cost' },
  ] as const;

  return (
    <div className="rounded-[40px] border border-rose-200 bg-gradient-to-br from-white via-rose-50 to-pink-50 p-6 shadow-2xl shadow-rose-200/50 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-rose-700">Comparison Mode</p>
          <h2 className="mt-2 text-2xl font-semibold text-rose-950">Device Breakdown</h2>
        </div>
      </div>
      <div className="mt-6 overflow-hidden rounded-3xl border border-rose-200 bg-rose-50/80 shadow-inner shadow-rose-200/50">
        <div className="grid grid-cols-[1.4fr_1fr_1fr] gap-px bg-rose-50/80 text-xs uppercase tracking-[0.24em] text-rose-700">
          <div className="bg-rose-100 px-4 py-3">Metric</div>
          <div className="bg-rose-100 px-4 py-3">{primary.name}</div>
          <div className="bg-rose-100 px-4 py-3">{secondary.name}</div>
        </div>
        {fields.map((field, index) => (
          <div
            key={field.key}
            className={`grid grid-cols-[1.4fr_1fr_1fr] gap-px text-sm ${index % 2 === 0 ? 'bg-white' : 'bg-rose-50'}`}
          >
            <div className="px-4 py-4 text-rose-900">{field.label}</div>
            <div className="px-4 py-4 text-rose-900">{primary.comparison[field.key]}</div>
            <div className="px-4 py-4 text-rose-900">{secondary.comparison[field.key]}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comparison;
