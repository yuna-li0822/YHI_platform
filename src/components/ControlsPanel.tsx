import type { Dispatch, SetStateAction } from 'react';

type ControlState = {
  wireframe: boolean;
  crossSection: boolean;
  autoRotate: boolean;
  transparency: number;
  background: 'slate' | 'navy' | 'rose';
};

interface ControlsPanelProps {
  controls: ControlState;
  onChange: Dispatch<SetStateAction<ControlState>>;
}

const backgrounds = [
  { key: 'slate', label: 'Deep Sea' },
  { key: 'navy', label: 'Cosmic' },
  { key: 'rose', label: 'Pulse' },
] as const;

const ControlsPanel = ({ controls, onChange }: ControlsPanelProps) => {
  return (
    <div className="mt-6 rounded-[32px] border border-cyan-500/10 bg-gradient-to-br from-slate-950/90 via-[#07172f]/95 to-[#120c2d]/85 p-5 shadow-inner shadow-cyan-900/20">
      <p className="text-sm uppercase tracking-[0.3em] text-cyan-200/80">Viewer Controls</p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="flex items-center gap-3 rounded-3xl border border-cyan-500/20 bg-[#081b30]/80 px-4 py-3">
          <input
            type="checkbox"
            checked={controls.wireframe}
            onChange={(event) => onChange((prev) => ({ ...prev, wireframe: event.target.checked }))}
            className="h-4 w-4 accent-cyan-400"
          />
          <span className="text-sm text-cyan-100/85">Wireframe</span>
        </label>
        <label className="flex items-center gap-3 rounded-3xl border border-cyan-500/20 bg-[#081b30]/80 px-4 py-3">
          <input
            type="checkbox"
            checked={controls.crossSection}
            onChange={(event) => onChange((prev) => ({ ...prev, crossSection: event.target.checked }))}
            className="h-4 w-4 accent-cyan-400"
          />
          <span className="text-sm text-cyan-100/85">Cross Section</span>
        </label>
        <label className="flex items-center gap-3 rounded-3xl border border-cyan-500/20 bg-[#081b30]/80 px-4 py-3">
          <input
            type="checkbox"
            checked={controls.autoRotate}
            onChange={(event) => onChange((prev) => ({ ...prev, autoRotate: event.target.checked }))}
            className="h-4 w-4 accent-cyan-400"
          />
          <span className="text-sm text-cyan-100/85">Auto Rotate</span>
        </label>
        <label className="flex flex-col gap-3 rounded-3xl border border-cyan-500/20 bg-[#081b30]/80 p-4">
          <span className="text-sm text-cyan-100/85">Transparency</span>
          <input
            type="range"
            min="0"
            max="0.8"
            step="0.05"
            value={controls.transparency}
            onChange={(event) => onChange((prev) => ({ ...prev, transparency: Number(event.target.value) }))}
            className="h-3 w-full cursor-pointer accent-cyan-400"
          />
        </label>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {backgrounds.map((bg) => (
          <button
            type="button"
            key={bg.key}
            onClick={() => onChange((prev) => ({ ...prev, background: bg.key }))}
            className={`rounded-3xl border px-4 py-3 text-sm transition ${
              controls.background === bg.key
                ? 'border-fuchsia-400/80 bg-gradient-to-r from-fuchsia-500/10 to-cyan-500/10 text-fuchsia-100'
                : 'border-cyan-500/20 bg-[#081b30]/80 text-cyan-100/80 hover:border-cyan-400/40'
            }`}
          >
            {bg.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export type { ControlState };
export default ControlsPanel;
