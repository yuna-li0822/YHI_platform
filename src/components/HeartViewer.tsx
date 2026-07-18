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
  slate: '#020617',
  navy: '#071f45',
  rose: '#291025',
};

const HeartViewer = ({ device, activeHotspot, onHotspotSelect, controls }: HeartViewerProps) => {
  return (
    <div className="h-[640px] w-full rounded-[32px] border border-slate-800/70 bg-slate-950/70 shadow-inner shadow-slate-950/30">
      <Canvas camera={{ position: [0, 0, 2.7], fov: 40 }} onCreated={({ scene }) => { scene.background = new Color(backgroundColors[controls.background]); }} dpr={[1, 2]}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[2, 2, 2]} intensity={1.4} />
        <spotLight position={[-3, 2, 2]} intensity={0.4} angle={0.3} penumbra={0.6} />
        <Environment preset="city" />
        <group position={[0, 0, 0]}>
          <HeartModel device={device} controls={controls} activeHotspot={activeHotspot} onHotspotSelect={(id) => { if (id) onHotspotSelect(id); }} />
        </group>
        <OrbitControls enablePan enableZoom enableRotate autoRotate={controls.autoRotate} autoRotateSpeed={0.4} />
        <Html position={[0, -1.1, 0]}>
          <div className="pointer-events-none mt-2 rounded-3xl border border-slate-800/80 bg-slate-950/95 px-5 py-3 text-sm text-slate-200 shadow-xl shadow-slate-950/20">
            {device.name} • Click hotspots to learn more
          </div>
        </Html>
      </Canvas>
    </div>
  );
};

export default HeartViewer;
