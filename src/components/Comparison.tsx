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
    <div className="rounded-[40px] border border-slate-800/70 bg-slate-950/80 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-sky-300/80">Comparison Mode</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-50">Device Breakdown</h2>
        </div>
      </div>
      <div className="mt-6 overflow-hidden rounded-3xl border border-slate-800/70 bg-slate-900/80 shadow-inner shadow-slate-950/20">
        <div className="grid grid-cols-[1.4fr_1fr_1fr] gap-px bg-slate-800 text-xs uppercase tracking-[0.24em] text-slate-500">
          <div className="bg-slate-950/80 px-4 py-3">Metric</div>
          <div className="bg-slate-950/80 px-4 py-3">{primary.name}</div>
          <div className="bg-slate-950/80 px-4 py-3">{secondary.name}</div>
        </div>
        {fields.map((field, index) => (
          <div
            key={field.key}
            className={`grid grid-cols-[1.4fr_1fr_1fr] gap-px text-sm ${index % 2 === 0 ? 'bg-slate-950/95' : 'bg-slate-900/95'}`}
          >
            <div className="px-4 py-4 text-slate-300">{field.label}</div>
            <div className="px-4 py-4 text-slate-200">{primary.comparison[field.key]}</div>
            <div className="px-4 py-4 text-slate-200">{secondary.comparison[field.key]}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comparison;
