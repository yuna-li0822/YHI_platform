import { FaHeartbeat, FaFlask, FaMedal, FaCapsules, FaClinicMedical, FaBandAid, FaHeart, FaRing, FaLayerGroup, FaStar } from 'react-icons/fa';
import type { HeartDevice } from '../types/HeartDevice';

interface DeviceSelectorProps {
  devices: HeartDevice[];
  selectedDevice: HeartDevice;
  onSelect: (device: HeartDevice) => void;
}

const iconMap: Record<string, JSX.Element> = {
  'mechanical-valve': <FaHeartbeat size={18} className="text-rose-500" />,
  'bioprosthetic-valve': <FaFlask size={18} className="text-rose-500" />,
  tavr: <FaMedal size={18} className="text-rose-500" />,
  'melody-valve': <FaCapsules size={18} className="text-rose-500" />,
  'edwards-sapien': <FaClinicMedical size={18} className="text-rose-500" />,
  'medtronic-evolut': <FaBandAid size={18} className="text-rose-500" />,
  'pulmonary-valve': <FaHeart size={18} className="text-rose-500" />,
  'mitral-repair-ring': <FaRing size={18} className="text-rose-500" />,
  'annuloplasty-ring': <FaLayerGroup size={18} className="text-rose-500" />,
  'tissue-engineered-valve': <FaStar size={18} className="text-rose-500" />,
};

const DeviceSelector = ({ devices, selectedDevice, onSelect }: DeviceSelectorProps) => (
  <div className="space-y-3">
    {devices.length === 0 ? (
      <div className="rounded-3xl border border-rose-200 bg-rose-500/5 p-4 text-sm text-rose-900">No devices match your search.</div>
    ) : (
      devices.map((device) => {
        const selected = device.id === selectedDevice.id;
        return (
          <button
            key={device.id}
            onClick={() => onSelect(device)}
            className={`group flex w-full items-center justify-between gap-4 rounded-3xl border px-4 py-4 text-left transition hover:-translate-y-0.5 ${
              selected
                ? 'border-rose-400/70 bg-gradient-to-r from-rose-100 to-white text-rose-900 shadow-glow'
                : 'border-rose-200 bg-rose-50/80 text-rose-900 hover:border-rose-400/40 hover:bg-rose-100'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-inner shadow-rose-100">
                {iconMap[device.id] ?? <FaHeartbeat size={18} className="text-rose-500" />}
              </div>
              <div>
                <p className="font-semibold text-rose-900">{device.name}</p>
                <p className="mt-1 text-xs text-rose-500">{device.replaces}</p>
              </div>
            </div>
            {selected ? (
              <span className="rounded-full border border-rose-200 bg-rose-400/10 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-rose-700">
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
