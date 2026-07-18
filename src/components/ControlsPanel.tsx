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
  { key: 'slate', label: 'Slate' },
  { key: 'navy', label: 'Navy' },
  { key: 'rose', label: 'Rose' },
] as const;

const ControlsPanel = ({ controls, onChange }: ControlsPanelProps) => {
  return (
    <div className="mt-6 rounded-[32px] border border-slate-800/70 bg-slate-950/80 p-5 shadow-inner shadow-slate-950/10">
      <p className="text-sm uppercase tracking-[0.3em] text-sky-300/80">Viewer Controls</p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="flex items-center gap-3 rounded-3xl border border-slate-800/80 bg-slate-900/80 px-4 py-3">
          <input
            type="checkbox"
            checked={controls.wireframe}
            onChange={(event) => onChange((prev) => ({ ...prev, wireframe: event.target.checked }))}
            className="h-4 w-4 accent-cyan-400"
          />
          <span className="text-sm text-slate-300">Wireframe</span>
        </label>
        <label className="flex items-center gap-3 rounded-3xl border border-slate-800/80 bg-slate-900/80 px-4 py-3">
          <input
            type="checkbox"
            checked={controls.crossSection}
            onChange={(event) => onChange((prev) => ({ ...prev, crossSection: event.target.checked }))}
            className="h-4 w-4 accent-cyan-400"
          />
          <span className="text-sm text-slate-300">Cross Section</span>
        </label>
        <label className="flex items-center gap-3 rounded-3xl border border-slate-800/80 bg-slate-900/80 px-4 py-3">
          <input
            type="checkbox"
            checked={controls.autoRotate}
            onChange={(event) => onChange((prev) => ({ ...prev, autoRotate: event.target.checked }))}
            className="h-4 w-4 accent-cyan-400"
          />
          <span className="text-sm text-slate-300">Auto Rotate</span>
        </label>
        <label className="flex flex-col gap-3 rounded-3xl border border-slate-800/80 bg-slate-900/80 p-4">
          <span className="text-sm text-slate-300">Transparency</span>
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
                ? 'border-cyan-400/80 bg-cyan-400/15 text-cyan-100'
                : 'border-slate-800/70 bg-slate-900/80 text-slate-300 hover:border-slate-600/80'
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
