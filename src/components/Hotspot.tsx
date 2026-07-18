import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';

interface HotspotProps {
  position: [number, number, number];
  label: string;
  active: boolean;
  onSelect: () => void;
  onHover: (hovered: boolean) => void;
}

const Hotspot = ({ position, active, onSelect, onHover }: HotspotProps) => {
  const sphereRef = useRef<Mesh>(null);

  useFrame(() => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y += 0.02;
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={sphereRef}
        scale={active ? 1.2 : 1}
        onClick={onSelect}
        onPointerOver={() => onHover(true)}
        onPointerOut={() => onHover(false)}
        castShadow
      >
        <sphereGeometry args={[0.05, 18, 18]} />
        <meshStandardMaterial
          color={active ? '#7dd3fc' : '#38bdf8'}
          emissive={active ? '#7dd3fc' : '#0ea5e9'}
          emissiveIntensity={active ? 0.8 : 0.25}
          transparent
          opacity={0.95}
        />
      </mesh>
    </group>
  );
};

export default Hotspot;
