import { FaHeartbeat, FaFlask, FaMedal, FaCapsules, FaClinicMedical, FaBandAid, FaHeart, FaRing, FaLayerGroup, FaStar } from 'react-icons/fa';
import type { HeartDevice } from '../types/HeartDevice';

interface DeviceSelectorProps {
  devices: HeartDevice[];
  selectedDevice: HeartDevice;
  onSelect: (device: HeartDevice) => void;
}

const iconMap: Record<string, JSX.Element> = {
  'mechanical-valve': <FaHeartbeat size={18} className="text-cyan-300" />,
  'bioprosthetic-valve': <FaFlask size={18} className="text-fuchsia-300" />,
  tavr: <FaMedal size={18} className="text-orange-300" />,
  'melody-valve': <FaCapsules size={18} className="text-sky-300" />,
  'edwards-sapien': <FaClinicMedical size={18} className="text-rose-300" />,
  'medtronic-evolut': <FaBandAid size={18} className="text-violet-300" />,
  'pulmonary-valve': <FaHeart size={18} className="text-cyan-200" />,
  'mitral-repair-ring': <FaRing size={18} className="text-emerald-300" />,
  'annuloplasty-ring': <FaLayerGroup size={18} className="text-slate-300" />,
  'tissue-engineered-valve': <FaStar size={18} className="text-fuchsia-300" />,
};

const DeviceSelector = ({ devices, selectedDevice, onSelect }: DeviceSelectorProps) => (
  <div className="space-y-3">
    {devices.length === 0 ? (
      <div className="rounded-3xl border border-rose-500/30 bg-rose-500/5 p-4 text-sm text-rose-100">No devices match your search.</div>
    ) : (
      devices.map((device) => {
        const selected = device.id === selectedDevice.id;
        return (
          <button
            key={device.id}
            onClick={() => onSelect(device)}
            className={`group flex w-full items-center justify-between gap-4 rounded-3xl border px-4 py-4 text-left transition hover:-translate-y-0.5 ${
              selected
                ? 'border-fuchsia-400/70 bg-gradient-to-r from-fuchsia-500/10 to-cyan-500/10 text-cyan-100 shadow-glow'
                : 'border-cyan-500/15 bg-slate-900/75 text-cyan-100 hover:border-cyan-400/40 hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950/70 shadow-inner shadow-slate-950/30">
                {iconMap[device.id] ?? <FaHeartbeat size={18} className="text-cyan-300" />}
              </div>
              <div>
                <p className="font-semibold">{device.name}</p>
                <p className="mt-1 text-xs text-slate-400">{device.replaces}</p>
              </div>
            </div>
            {selected ? (
              <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-cyan-200">
                Selected
              </span>
            ) : null}
          </button>
        );
      })
    )}
  </div>
);

export default DeviceSelector;
