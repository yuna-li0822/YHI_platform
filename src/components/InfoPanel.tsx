import type { HeartDevice } from '../types/HeartDevice';

interface InfoPanelProps {
  device: HeartDevice;
  activeHotspot: string | null;
}

const InfoPanel = ({ device, activeHotspot }: InfoPanelProps) => {
  const hotspot = device.hotspots.find((hotspot) => hotspot.id === activeHotspot);

  return (
    <div className="rounded-[40px] border border-rose-200 bg-gradient-to-br from-white via-rose-50 to-pink-50 p-6 shadow-2xl shadow-rose-200/50 backdrop-blur-xl">
      <p className="text-sm uppercase tracking-[0.35em] text-rose-700">Information</p>
      <h2 className="mt-4 text-3xl font-semibold text-rose-950">{device.name}</h2>
      <p className="mt-3 text-sm leading-7 text-rose-700">{device.description}</p>

      <div className="mt-6 grid gap-4">
        <div className="rounded-3xl bg-rose-50/80 p-5">
          <p className="text-xs uppercase tracking-[0.25em] text-rose-500">Clinical Purpose</p>
          <p className="mt-2 text-sm text-rose-900">{device.clinicalPurpose}</p>
        </div>
        <div className="rounded-3xl bg-rose-50/80 p-5">
          <p className="text-xs uppercase tracking-[0.25em] text-rose-500">Which valve it replaces</p>
          <p className="mt-2 text-sm text-rose-900">{device.replaces}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-3xl bg-rose-50/80 p-5">
          <p className="text-sm text-rose-500">Material</p>
          <p className="mt-2 text-rose-900">{device.materials}</p>
        </div>
        <div className="rounded-3xl bg-rose-50/80 p-5">
          <p className="text-sm text-rose-500">FDA Approval</p>
          <p className="mt-2 text-rose-900">{device.fdaApproval}</p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <div className="rounded-3xl bg-rose-50/80 p-5">
          <p className="text-sm uppercase tracking-[0.2em] text-rose-500">How it works</p>
          <p className="mt-3 text-sm leading-7 text-rose-700">{device.procedure}</p>
        </div>
        <div className="rounded-3xl bg-rose-50/80 p-5">
          <p className="text-sm uppercase tracking-[0.2em] text-rose-500">Advantages</p>
          <ul className="mt-3 space-y-2 text-sm text-rose-700">
            {device.advantages.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl bg-rose-50/80 p-5">
          <p className="text-sm uppercase tracking-[0.2em] text-rose-500">Limitations</p>
          <ul className="mt-3 space-y-2 text-sm text-rose-700">
            {device.limitations.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 rounded-3xl bg-rose-50/80 p-5">
        <p className="text-sm uppercase tracking-[0.2em] text-rose-500">Engineering Facts</p>
        <ul className="mt-3 space-y-2 text-sm text-rose-700">
          {device.engineeringFacts.map((fact) => (
            <li key={fact}>• {fact}</li>
          ))}
        </ul>
      </div>

      <div className="mt-6 rounded-3xl bg-gradient-to-r from-rose-100 via-rose-50 to-white/10 p-5 text-rose-900">
        <p className="text-sm uppercase tracking-[0.2em] text-rose-700">Spotlight</p>
        <p className="mt-3 text-sm leading-7 text-rose-700">
          {hotspot ? hotspot.description : 'Hover or click a hotspot on the model to learn about a component.'}
        </p>
      </div>
    </div>
  );
};

export default InfoPanel;
