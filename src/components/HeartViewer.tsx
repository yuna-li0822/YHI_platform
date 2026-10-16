import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Html } from '@react-three/drei';
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
  slate: '#fff7fa',
  navy: '#fde7f0',
  rose: '#fbcfe1',
};

const HeartViewer = ({ device, activeHotspot, onHotspotSelect, controls }: HeartViewerProps) => {
  return (
    <div className="h-[640px] w-full rounded-[32px] border border-rose-200 bg-gradient-to-br from-white via-rose-50 to-pink-50 shadow-inner shadow-rose-200/50">
      <Canvas camera={{ position: [0, 0, 2.7], fov: 40 }} gl={{ localClippingEnabled: true }} dpr={[1, 2]}>
        <color attach="background" args={[backgroundColors[controls.background]]} />
        <ambientLight intensity={0.7} color="#ffccd8" />
        <directionalLight position={[2.5, 2.5, 3]} intensity={1.1} color="#ff9fb8" />
        <spotLight position={[-3, 2, 2]} intensity={0.45} angle={0.28} penumbra={0.6} color="#ff6b95" />
        <ambientLight intensity={0.35} color="#ffd3e0" />
        <Environment preset="studio" />
        <group position={[0, 0, 0]}>
          <HeartModel device={device} controls={controls} activeHotspot={activeHotspot} onHotspotSelect={(id) => { if (id) onHotspotSelect(id); }} />
        </group>
        <OrbitControls enablePan enableZoom enableRotate autoRotate={controls.autoRotate} autoRotateSpeed={0.4} />
        <Html position={[0, -1.1, 0]}>
          <div className="pointer-events-none mt-2 rounded-3xl border border-rose-200 bg-rose-50/80 px-5 py-3 text-sm text-rose-900 shadow-xl shadow-rose-500/20">
            {device.name} • Click hotspots to learn more
          </div>
        </Html>
      </Canvas>
    </div>
  );
};

export default HeartViewer;
