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
  { key: 'slate', label: 'Blush' },
  { key: 'navy', label: 'Petal' },
  { key: 'rose', label: 'Rose' },
] as const;

const ControlsPanel = ({ controls, onChange }: ControlsPanelProps) => {
  return (
    <div className="mt-6 rounded-[32px] border border-rose-200 bg-gradient-to-br from-white via-rose-50 to-pink-50 p-5 shadow-inner shadow-rose-200/50">
      <p className="text-sm uppercase tracking-[0.3em] text-rose-700">Viewer Controls</p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="flex items-center gap-3 rounded-3xl border border-rose-200 bg-rose-50/80 px-4 py-3">
          <input
            type="checkbox"
            checked={controls.wireframe}
            onChange={(event) => onChange((prev) => ({ ...prev, wireframe: event.target.checked }))}
            className="h-4 w-4 accent-rose-400"
          />
          <span className="text-sm text-rose-900">Wireframe</span>
        </label>
        <label className="flex items-center gap-3 rounded-3xl border border-rose-200 bg-rose-50/80 px-4 py-3">
          <input
            type="checkbox"
            checked={controls.crossSection}
            onChange={(event) => onChange((prev) => ({ ...prev, crossSection: event.target.checked }))}
            className="h-4 w-4 accent-rose-400"
          />
          <span className="text-sm text-rose-900">Cross Section</span>
        </label>
        <label className="flex items-center gap-3 rounded-3xl border border-rose-200 bg-rose-50/80 px-4 py-3">
          <input
            type="checkbox"
            checked={controls.autoRotate}
            onChange={(event) => onChange((prev) => ({ ...prev, autoRotate: event.target.checked }))}
            className="h-4 w-4 accent-rose-400"
          />
          <span className="text-sm text-rose-900">Auto Rotate</span>
        </label>
        <label className="flex flex-col gap-3 rounded-3xl border border-rose-200 bg-rose-50/80 p-4">
          <span className="text-sm text-rose-900">Transparency</span>
          <input
            type="range"
            min="0"
            max="0.8"
            step="0.05"
            value={controls.transparency}
            onChange={(event) => onChange((prev) => ({ ...prev, transparency: Number(event.target.value) }))}
            className="h-3 w-full cursor-pointer accent-rose-400"
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
                ? 'border-rose-400/80 bg-gradient-to-r from-rose-100 to-white text-rose-900'
                : 'border-rose-200 bg-rose-50/80 text-rose-900 hover:border-rose-400/40'
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
