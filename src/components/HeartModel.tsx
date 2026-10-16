import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { Plane, Vector3 } from 'three';
import type { Group } from 'three';
import type { HeartDevice } from '../types/HeartDevice';
import Hotspot from './Hotspot';
import type { ControlState } from './ControlsPanel';
import {
  AnnuloplastyRing,
  MechanicalValve,
  StentedVeinValve,
  SurgicalTissueValve,
  TissueEngineeredValve,
  TranscatheterValve,
  type MaterialOptions,
} from './ValveModels';

interface HeartModelProps {
  device: HeartDevice;
  activeHotspot: string | null;
  onHotspotSelect: (hotspotId: string) => void;
  controls: ControlState;
}

// Cuts away the half of the device facing the camera.
const crossSectionPlanes = [new Plane(new Vector3(0, 0, -1), 0)];
const noPlanes: Plane[] = [];

const viewTilt: Record<HeartDevice['modelType'], number> = {
  mechanical: 0.85,
  bioprosthetic: 0.45,
  tavr: 0.4,
  stent: 0.35,
  ring: 0.95,
  future: 0.45,
};

const HeartModel = ({ device, activeHotspot, onHotspotSelect, controls }: HeartModelProps) => {
  const groupRef = useRef<Group | null>(null);
  const pulse = useRef(0);

  useFrame((_, delta) => {
    pulse.current += delta * 3;
    const scale = 1 + Math.sin(pulse.current) * 0.015;
    if (groupRef.current) {
      groupRef.current.rotation.y += controls.autoRotate ? delta * 0.15 : 0;
      groupRef.current.scale.setScalar(scale);
    }
  });

  const materialOptions = useMemo<MaterialOptions>(
    () => ({
      opacity: 1 - controls.transparency,
      wireframe: controls.wireframe,
      clippingPlanes: controls.crossSection ? crossSectionPlanes : noPlanes,
    }),
    [controls.transparency, controls.wireframe, controls.crossSection],
  );

  const renderModel = () => {
    switch (device.modelType) {
      case 'mechanical':
        return <MechanicalValve o={materialOptions} />;
      case 'tavr':
        return <TranscatheterValve o={materialOptions} variant={device.id === 'medtronic-evolut' ? 'evolut' : 'sapien'} />;
      case 'stent':
        return <StentedVeinValve o={materialOptions} />;
      case 'ring':
        return <AnnuloplastyRing o={materialOptions} band={device.id === 'annuloplasty-ring'} />;
      case 'future':
        return <TissueEngineeredValve o={materialOptions} />;
      case 'bioprosthetic':
      default:
        return <SurgicalTissueValve o={materialOptions} />;
    }
  };

  return (
    // Tilt toward the camera so you can see into the device; flatter devices tilt further.
    <group rotation={[viewTilt[device.modelType], 0, 0]}>
      {/* Spin around the device's own axis, like a turntable. */}
      <group ref={groupRef}>
        {renderModel()}
        {device.hotspots.map((hotspot) => (
          <Hotspot
            key={hotspot.id}
            position={hotspot.position}
            label={hotspot.label}
            active={hotspot.id === activeHotspot}
            onSelect={() => onHotspotSelect(hotspot.id)}
            onHover={() => null}
          />
        ))}
      </group>
    </group>
  );
};

export default HeartModel;
