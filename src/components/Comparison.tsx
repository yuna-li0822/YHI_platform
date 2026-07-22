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
    <div className="rounded-[40px] border border-cyan-500/10 bg-gradient-to-br from-slate-950/85 via-[#071828]/95 to-[#0d0521]/95 p-6 shadow-2xl shadow-cyan-900/20 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-200/80">Comparison Mode</p>
          <h2 className="mt-2 text-2xl font-semibold text-cyan-50">Device Breakdown</h2>
        </div>
      </div>
      <div className="mt-6 overflow-hidden rounded-3xl border border-cyan-500/10 bg-slate-950/85 shadow-inner shadow-cyan-900/10">
        <div className="grid grid-cols-[1.4fr_1fr_1fr] gap-px bg-[#061328] text-xs uppercase tracking-[0.24em] text-cyan-300/80">
          <div className="bg-[#071a35]/90 px-4 py-3">Metric</div>
          <div className="bg-[#071a35]/90 px-4 py-3">{primary.name}</div>
          <div className="bg-[#071a35]/90 px-4 py-3">{secondary.name}</div>
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
