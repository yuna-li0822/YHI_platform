import { useFrame } from '@react-three/fiber';
import { useMemo, useRef, useState } from 'react';
import type { Group } from 'three';
import type { HeartDevice } from '../types/HeartDevice';
import Hotspot from './Hotspot';
import type { ControlState } from './ControlsPanel';

interface HeartModelProps {
  device: HeartDevice;
  activeHotspot: string | null;
  onHotspotSelect: (hotspotId: string) => void;
  controls: ControlState;
}

const HeartModel = ({ device, activeHotspot, onHotspotSelect, controls }: HeartModelProps) => {
  const groupRef = useRef<Group | null>(null);
  const [hovered, setHovered] = useState(false);
  const pulse = useRef(0);

  useFrame((state, delta) => {
    pulse.current += delta * 3;
    const scale = 1 + Math.sin(pulse.current) * 0.03;
    if (groupRef.current) {
      groupRef.current.rotation.y += controls.autoRotate ? delta * 0.15 : 0;
      groupRef.current.scale.setScalar(scale);
    }
  });

  const opacity = 1 - controls.transparency;
  const materialProps = {
    metalness: 0.35,
    roughness: 0.4,
    transparent: true,
    opacity: opacity,
    wireframe: controls.wireframe,
  };

  const model = useMemo(() => {
    switch (device.modelType) {
      case 'mechanical':
        return (
          <mesh>
            <cylinderGeometry args={[0.35, 0.35, 0.1, 48]} />
            <meshStandardMaterial color="#70d5ff" {...materialProps} />
          </mesh>
        );
      case 'bioprosthetic':
        return (
          <mesh>
            <sphereGeometry args={[0.38, 48, 32]} />
            <meshStandardMaterial color="#d9a8ff" {...materialProps} />
          </mesh>
        );
      case 'tavr':
        return (
          <mesh>
            <cylinderGeometry args={[0.28, 0.28, 0.9, 32]} />
            <meshStandardMaterial color="#7c3aed" {...materialProps} />
          </mesh>
        );
      case 'stent':
        return (
          <mesh>
            <torusGeometry args={[0.35, 0.08, 32, 64]} />
            <meshStandardMaterial color="#38bdf8" {...materialProps} />
          </mesh>
        );
      case 'ring':
        return (
          <mesh>
            <torusGeometry args={[0.45, 0.08, 24, 96]} />
            <meshStandardMaterial color="#4ade80" {...materialProps} />
          </mesh>
        );
      case 'future':
        return (
          <mesh>
            <sphereGeometry args={[0.3, 32, 30]} />
            <meshStandardMaterial color="#f472b6" {...materialProps} />
          </mesh>
        );
      default:
        return (
          <mesh>
            <sphereGeometry args={[0.35, 32, 28]} />
            <meshStandardMaterial color="#38bdf8" {...materialProps} />
          </mesh>
        );
    }
  }, [device.modelType, materialProps]);

  return (
    <group ref={groupRef} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
      {model}
      {controls.crossSection && (
        <mesh rotation={[0, Math.PI / 2, 0]} position={[0, 0, 0]}>
          <planeGeometry args={[1.2, 1.2]} />
          <meshStandardMaterial color="#0f172a" transparent opacity={0.25} side={2} />
        </mesh>
      )}
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
  );
};

export default HeartModel;
