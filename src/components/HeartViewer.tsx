import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Html } from '@react-three/drei';
import { Color } from 'three';
import type { HeartDevice } from '../types/HeartDevice';
import type { ControlState } from './ControlsPanel';
import HeartModel from './HeartModel';

interface HeartViewerProps {
  device: HeartDevice;
  activeHotspot: string | null;
  onHotspotSelect: (hotspotId: string | null) => void;
  controls: ControlState;
}

const backgroundColors: Record<ControlState['background'], string> = {
  slate: '#071323',
  navy: '#081b3a',
  rose: '#1c0f2d',
};

const HeartViewer = ({ device, activeHotspot, onHotspotSelect, controls }: HeartViewerProps) => {
  return (
    <div className="h-[640px] w-full rounded-[32px] border border-cyan-500/10 bg-gradient-to-br from-slate-950/80 via-[#07172f]/90 to-[#0c0c20]/90 shadow-inner shadow-cyan-800/30">
      <Canvas camera={{ position: [0, 0, 2.7], fov: 40 }} onCreated={({ scene }) => { scene.background = new Color(backgroundColors[controls.background]); }} dpr={[1, 2]}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[2.5, 2.5, 3]} intensity={1.2} color="hsl(190, 80%, 90%)" />
        <spotLight position={[-3, 2, 2]} intensity={0.45} angle={0.28} penumbra={0.6} color="hsl(270, 80%, 76%)" />
        <ambientLight intensity={0.35} color="hsl(220, 90%, 80%)" />
        <Environment preset="studio" />
        <group position={[0, 0, 0]}>
          <HeartModel device={device} controls={controls} activeHotspot={activeHotspot} onHotspotSelect={(id) => { if (id) onHotspotSelect(id); }} />
        </group>
        <OrbitControls enablePan enableZoom enableRotate autoRotate={controls.autoRotate} autoRotateSpeed={0.4} />
        <Html position={[0, -1.1, 0]}>
          <div className="pointer-events-none mt-2 rounded-3xl border border-cyan-400/20 bg-slate-950/95 px-5 py-3 text-sm text-cyan-100 shadow-xl shadow-cyan-500/20">
            {device.name} • Click hotspots to learn more
          </div>
        </Html>
      </Canvas>
    </div>
  );
};

export default HeartViewer;
