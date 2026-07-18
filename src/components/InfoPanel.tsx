import type { HeartDevice } from '../types/HeartDevice';

interface InfoPanelProps {
  device: HeartDevice;
  activeHotspot: string | null;
}

const InfoPanel = ({ device, activeHotspot }: InfoPanelProps) => {
  const hotspot = device.hotspots.find((hotspot) => hotspot.id === activeHotspot);

  return (
    <div className="rounded-[40px] border border-slate-800/70 bg-slate-950/80 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
      <p className="text-sm uppercase tracking-[0.35em] text-sky-300/80">Information</p>
      <h2 className="mt-4 text-3xl font-semibold text-slate-50">{device.name}</h2>
      <p className="mt-3 text-sm leading-7 text-slate-300">{device.description}</p>

      <div className="mt-6 grid gap-4">
        <div className="rounded-3xl bg-slate-900/80 p-5">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400/80">Clinical Purpose</p>
          <p className="mt-2 text-sm text-slate-200">{device.clinicalPurpose}</p>
        </div>
        <div className="rounded-3xl bg-slate-900/80 p-5">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400/80">Which valve it replaces</p>
          <p className="mt-2 text-sm text-slate-200">{device.replaces}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-3xl bg-slate-900/80 p-5">
          <p className="text-sm text-slate-400">Material</p>
          <p className="mt-2 text-slate-200">{device.materials}</p>
        </div>
        <div className="rounded-3xl bg-slate-900/80 p-5">
          <p className="text-sm text-slate-400">FDA Approval</p>
          <p className="mt-2 text-slate-200">{device.fdaApproval}</p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <div className="rounded-3xl bg-slate-900/80 p-5">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400/80">How it works</p>
          <p className="mt-3 text-sm leading-7 text-slate-300">{device.procedure}</p>
        </div>
        <div className="rounded-3xl bg-slate-900/80 p-5">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400/80">Advantages</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            {device.advantages.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl bg-slate-900/80 p-5">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400/80">Limitations</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            {device.limitations.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 rounded-3xl bg-slate-900/80 p-5">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-400/80">Engineering Facts</p>
        <ul className="mt-3 space-y-2 text-sm text-slate-300">
          {device.engineeringFacts.map((fact) => (
            <li key={fact}>• {fact}</li>
          ))}
        </ul>
      </div>

      <div className="mt-6 rounded-3xl bg-cyan-950/10 p-5 text-slate-200">
        <p className="text-sm uppercase tracking-[0.2em] text-cyan-200/80">Spotlight</p>
        <p className="mt-3 text-sm leading-7 text-slate-300">
          {hotspot ? hotspot.description : 'Hover or click a hotspot on the model to learn about a component.'}
        </p>
      </div>
    </div>
  );
};

export default InfoPanel;
