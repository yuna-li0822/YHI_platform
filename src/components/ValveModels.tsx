import { useFrame } from '@react-three/fiber';
import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import {
  BufferGeometry,
  CanvasTexture,
  CatmullRomCurve3,
  CylinderGeometry,
  DoubleSide,
  ExtrudeGeometry,
  Float32BufferAttribute,
  LatheGeometry,
  Object3D,
  Quaternion,
  RepeatWrapping,
  Shape,
  SphereGeometry,
  SRGBColorSpace,
  TubeGeometry,
  Vector2,
  Vector3,
} from 'three';
import type { Group, InstancedMesh, MeshStandardMaterial, Plane } from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

export type MaterialOptions = {
  opacity: number;
  wireframe: boolean;
  clippingPlanes: Plane[];
};

type ModelProps = { o: MaterialOptions };

const COLORS = {
  carbon: '#24262c',
  pericardium: '#e6bf9f',
  cobaltChrome: '#c8cdd5',
  nitinol: '#aeb3bb',
  platinum: '#dcdfe4',
  gold: '#d6a84a',
  vein: '#e2a48e',
  marker: '#16a34a',
  livingTissue: '#f59fb1',
  cells: '#e11d48',
};

// Shared material settings so the viewer's transparency, wireframe, and cross-section controls apply everywhere.
const surface = (o: MaterialOptions, alpha = 1) => ({
  transparent: true,
  opacity: o.opacity * alpha,
  depthWrite: o.opacity * alpha > 0.9,
  wireframe: o.wireframe,
  clippingPlanes: o.clippingPlanes,
  side: DoubleSide,
});

// Smooth 0 (closed) -> 1 (open) heartbeat cycle used to animate leaflets.
const valveCycle = (time: number) => {
  const s = 0.5 - 0.5 * Math.cos(time * 2.4);
  return s * s * (3 - 2 * s);
};

const useDisposable = <T extends { dispose: () => void }>(factory: () => T, deps: unknown[]) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const value = useMemo(factory, deps);
  useEffect(() => () => value.dispose(), [value]);
  return value;
};

// Woven polyester look for sewing cuffs, skirts, and ring coverings.
let fabricTexture: CanvasTexture | null = null;
const getFabricTexture = () => {
  if (fabricTexture) return fabricTexture;
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#ddd5ca';
    ctx.fillRect(0, 0, size, size);
    for (let y = 0; y < size; y += 8) {
      for (let x = 0; x < size; x += 8) {
        const horizontal = ((x + y) / 8) % 2 === 0;
        ctx.fillStyle = horizontal ? '#fbf8f3' : '#efe8de';
        if (horizontal) ctx.fillRect(x, y + 1, 8, 6);
        else ctx.fillRect(x + 1, y, 6, 8);
      }
    }
  }
  fabricTexture = new CanvasTexture(canvas);
  fabricTexture.wrapS = RepeatWrapping;
  fabricTexture.wrapT = RepeatWrapping;
  fabricTexture.colorSpace = SRGBColorSpace;
  return fabricTexture;
};

const FabricMaterial = ({ o, repeat, alpha = 1 }: ModelProps & { repeat: [number, number]; alpha?: number }) => {
  const map = useDisposable(() => {
    const texture = getFabricTexture().clone();
    texture.repeat.set(repeat[0], repeat[1]);
    texture.needsUpdate = true;
    return texture;
  }, [repeat[0], repeat[1]]);
  return <meshStandardMaterial map={map} roughness={0.95} metalness={0} {...surface(o, alpha)} />;
};

const UP = new Vector3(0, 1, 0);

const strut = (a: Vector3, b: Vector3, radius: number) => {
  const direction = b.clone().sub(a);
  const geometry = new CylinderGeometry(radius, radius, direction.length(), 6, 1, true);
  geometry.applyQuaternion(new Quaternion().setFromUnitVectors(UP, direction.normalize()));
  const mid = a.clone().add(b).multiplyScalar(0.5);
  geometry.translate(mid.x, mid.y, mid.z);
  return geometry;
};

const joint = (p: Vector3, radius: number) => {
  const geometry = new SphereGeometry(radius, 8, 6);
  geometry.translate(p.x, p.y, p.z);
  return geometry;
};

const merge = (parts: BufferGeometry[]) => {
  const merged = mergeGeometries(parts) ?? new BufferGeometry();
  parts.forEach((part) => part.dispose());
  return merged;
};

type LatticeSpec = {
  rows: number;
  cols: number;
  yMin: number;
  yMax: number;
  radiusAt: (t: number) => number;
  strutRadius: number;
};

// Diamond-cell stent frame, like the laser-cut frames of transcatheter valves.
const buildLattice = ({ rows, cols, yMin, yMax, radiusAt, strutRadius }: LatticeSpec) => {
  const node = (k: number, j: number) => {
    const column = ((j % cols) + cols) % cols;
    const angle = ((column + (k % 2) * 0.5) / cols) * Math.PI * 2;
    const t = k / rows;
    const r = radiusAt(t);
    return new Vector3(r * Math.cos(angle), yMin + (yMax - yMin) * t, r * Math.sin(angle));
  };
  const parts: BufferGeometry[] = [];
  const nodes: Vector3[] = [];
  for (let k = 0; k <= rows; k++) {
    for (let j = 0; j < cols; j++) {
      const p = node(k, j);
      nodes.push(p);
      parts.push(joint(p, strutRadius * 1.35));
      if (k < rows) {
        const neighbors = k % 2 === 0 ? [j, j - 1] : [j, j + 1];
        neighbors.forEach((n) => parts.push(strut(p, node(k + 1, n), strutRadius)));
      }
    }
  }
  return { geometry: merge(parts), nodes };
};

const latheProfile = (radiusAt: (t: number) => number, yMin: number, yMax: number, tStart: number, tEnd: number, inset: number) => {
  const points: Vector2[] = [];
  for (let i = 0; i <= 16; i++) {
    const t = tStart + ((tEnd - tStart) * i) / 16;
    points.push(new Vector2(radiusAt(t) - inset, yMin + (yMax - yMin) * t));
  }
  return points;
};

// Three tissue leaflets that meet in the middle and animate open/closed.
type LeafletProps = ModelProps & {
  radius: number;
  top: number;
  depth: number;
  coaptation: number;
  sag: number;
  color: string;
  alpha?: number;
};

const SEG_U = 28;
const SEG_V = 14;

const createLeafletGrid = () => {
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(new Float32Array((SEG_U + 1) * (SEG_V + 1) * 3), 3));
  const index: number[] = [];
  for (let v = 0; v < SEG_V; v++) {
    for (let u = 0; u < SEG_U; u++) {
      const a = v * (SEG_U + 1) + u;
      const c = a + SEG_U + 1;
      index.push(a, c, a + 1, a + 1, c, c + 1);
    }
  }
  geometry.setIndex(index);
  return geometry;
};

const TricuspidLeaflets = (props: LeafletProps) => {
  const geometries = useMemo(() => [0, 1, 2].map(createLeafletGrid), []);
  useEffect(() => () => geometries.forEach((g) => g.dispose()), [geometries]);
  const shape = useRef(props);
  shape.current = props;

  useFrame(({ clock }) => {
    const { radius, top, depth, coaptation, sag } = shape.current;
    const open = valveCycle(clock.elapsedTime);
    const span = (Math.PI * 2) / 3;
    geometries.forEach((geometry, i) => {
      const positions = geometry.attributes.position.array as Float32Array;
      const a0 = i * span;
      for (let iu = 0; iu <= SEG_U; iu++) {
        const u = iu / SEG_U;
        const angle = a0 + u * span;
        const bump = Math.sin(Math.PI * u);
        // Scalloped attachment line along the frame wall.
        const ax = radius * Math.cos(angle);
        const ay = top - depth * bump;
        const az = radius * Math.sin(angle);
        // Closed: free edge runs from each commissure post to the center.
        const s = u < 0.5 ? 1 - 2 * u : 2 * u - 1;
        const edgeAngle = u < 0.5 ? a0 : a0 + span;
        const cx = radius * s * Math.cos(edgeAngle);
        const cy = coaptation + (top - coaptation) * s;
        const cz = radius * s * Math.sin(edgeAngle);
        // Open: free edge swings back toward the wall.
        const openRadius = radius * (1 - 0.3 * bump);
        const ox = openRadius * Math.cos(angle);
        const oy = top - 0.08 * bump;
        const oz = openRadius * Math.sin(angle);
        const fx = cx + (ox - cx) * open;
        const fy = cy + (oy - cy) * open;
        const fz = cz + (oz - cz) * open;
        for (let iv = 0; iv <= SEG_V; iv++) {
          const v = iv / SEG_V;
          const belly = sag * Math.sin(Math.PI * v) * bump * (1 - 0.6 * open);
          const p = (iv * (SEG_U + 1) + iu) * 3;
          positions[p] = ax + (fx - ax) * v;
          positions[p + 1] = ay + (fy - ay) * v - belly;
          positions[p + 2] = az + (fz - az) * v;
        }
      }
      geometry.attributes.position.needsUpdate = true;
      geometry.computeVertexNormals();
      geometry.computeBoundingSphere();
    });
  });

  return (
    <>
      {geometries.map((geometry, i) => (
        <mesh key={i} geometry={geometry}>
          <meshPhysicalMaterial
            color={props.color}
            roughness={0.6}
            metalness={0}
            sheen={0.6}
            sheenColor="#ffffff"
            {...surface(props.o, props.alpha ?? 1)}
          />
        </mesh>
      ))}
    </>
  );
};

// Bileaflet mechanical valve: pyrolytic carbon housing, two pivoting half-disc leaflets, fabric sewing cuff.
export const MechanicalValve = ({ o }: ModelProps) => {
  const housing = useDisposable(
    () =>
      new LatheGeometry(
        [
          [0.3, -0.12],
          [0.335, -0.12],
          [0.345, -0.09],
          [0.345, 0.03],
          [0.335, 0.06],
          [0.3, 0.06],
          [0.3, -0.12],
        ].map(([x, y]) => new Vector2(x, y)),
        96,
      ),
    [],
  );
  const leaflet = useDisposable(() => {
    const half = new Shape();
    half.absarc(0, 0, 0.285, 0, Math.PI, false);
    half.lineTo(0.285, 0);
    const geometry = new ExtrudeGeometry(half, {
      depth: 0.014,
      bevelEnabled: true,
      bevelThickness: 0.004,
      bevelSize: 0.004,
      bevelSegments: 2,
      curveSegments: 48,
    });
    geometry.rotateX(Math.PI / 2);
    return geometry;
  }, []);
  const left = useRef<Group>(null);
  const right = useRef<Group>(null);

  useFrame(({ clock }) => {
    const angle = -0.5 - 0.95 * valveCycle(clock.elapsedTime);
    if (left.current) left.current.rotation.x = angle;
    if (right.current) right.current.rotation.x = angle;
  });

  const carbon = (
    <meshPhysicalMaterial color={COLORS.carbon} metalness={0.5} roughness={0.18} clearcoat={1} clearcoatRoughness={0.08} {...surface(o)} />
  );

  const leafletCarbon = (
    <meshPhysicalMaterial color="#5a5f6a" metalness={0.45} roughness={0.15} clearcoat={1} clearcoatRoughness={0.05} {...surface(o)} />
  );

  return (
    <group position={[0, 0.05, 0]}>
      <mesh geometry={housing}>{carbon}</mesh>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 0.33, 0.09, 0]}>
          <boxGeometry args={[0.025, 0.07, 0.12]} />
          {carbon}
        </mesh>
      ))}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} scale={[1, 1, 0.75]}>
        <torusGeometry args={[0.375, 0.06, 20, 120]} />
        <FabricMaterial o={o} repeat={[48, 3]} />
      </mesh>
      <group position={[0, -0.03, 0.02]}>
        <group ref={left}>
          <mesh geometry={leaflet}>{leafletCarbon}</mesh>
        </group>
      </group>
      <group rotation={[0, Math.PI, 0]}>
        <group position={[0, -0.03, 0.02]}>
          <group ref={right}>
            <mesh geometry={leaflet}>{leafletCarbon}</mesh>
          </group>
        </group>
      </group>
    </group>
  );
};

// Surgical bioprosthetic valve: cloth-covered wireform with three posts, sewing cuff, bovine pericardial leaflets.
export const SurgicalTissueValve = ({ o }: ModelProps) => {
  const radius = 0.33;
  const top = 0.36;
  const depth = 0.48;
  const wireform = useDisposable(() => {
    const points: Vector3[] = [];
    for (let i = 0; i < 120; i++) {
      const u = (i % 40) / 40;
      const angle = (i / 120) * Math.PI * 2;
      const r = radius + 0.02;
      points.push(new Vector3(r * Math.cos(angle), top - depth * Math.sin(Math.PI * u), r * Math.sin(angle)));
    }
    return new TubeGeometry(new CatmullRomCurve3(points, true, 'centripetal'), 360, 0.03, 12, true);
  }, []);

  return (
    <group>
      <mesh geometry={wireform}>
        <FabricMaterial o={o} repeat={[90, 2]} />
      </mesh>
      {[0, 1, 2].map((i) => {
        const angle = (i * Math.PI * 2) / 3;
        const r = radius + 0.02;
        return (
          <group key={i} position={[r * Math.cos(angle), 0, r * Math.sin(angle)]}>
            <mesh position={[0, top - 0.12, 0]}>
              <cylinderGeometry args={[0.022, 0.04, 0.26, 12]} />
              <FabricMaterial o={o} repeat={[4, 6]} />
            </mesh>
            <mesh position={[0, top + 0.01, 0]}>
              <sphereGeometry args={[0.026, 12, 10]} />
              <FabricMaterial o={o} repeat={[3, 3]} />
            </mesh>
          </group>
        );
      })}
      <mesh position={[0, -0.15, 0]}>
        <cylinderGeometry args={[radius + 0.03, radius + 0.03, 0.12, 64, 1, true]} />
        <FabricMaterial o={o} repeat={[40, 2]} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.22, 0]} scale={[1, 1, 0.7]}>
        <torusGeometry args={[0.39, 0.065, 20, 120]} />
        <FabricMaterial o={o} repeat={[48, 3]} />
      </mesh>
      <TricuspidLeaflets o={o} radius={radius} top={top} depth={depth} coaptation={0.2} sag={0.12} color={COLORS.pericardium} />
    </group>
  );
};

// Transcatheter valves: balloon-expandable SAPIEN (short cobalt-chromium frame) or self-expanding Evolut (tall flared nitinol frame).
export const TranscatheterValve = ({ o, variant }: ModelProps & { variant: 'sapien' | 'evolut' }) => {
  const spec = useMemo<LatticeSpec>(
    () =>
      variant === 'evolut'
        ? {
            rows: 6,
            cols: 9,
            yMin: -0.42,
            yMax: 0.5,
            strutRadius: 0.009,
            radiusAt: (t) => (t < 0.35 ? 0.26 + 0.08 * (1 - t / 0.35) ** 2 : 0.26 + 0.17 * ((t - 0.35) / 0.65) ** 2),
          }
        : { rows: 4, cols: 12, yMin: -0.28, yMax: 0.28, strutRadius: 0.011, radiusAt: () => 0.32 },
    [variant],
  );
  const lattice = useMemo(() => buildLattice(spec), [spec]);
  useEffect(() => () => lattice.geometry.dispose(), [lattice]);

  const postRange = variant === 'evolut' ? [0.4, 0.75] : [0.45, 1];
  const posts = useDisposable(() => {
    const parts: BufferGeometry[] = [];
    for (let i = 0; i < 3; i++) {
      const angle = (i * Math.PI * 2) / 3;
      const at = (t: number) => {
        const r = spec.radiusAt(t);
        return new Vector3(r * Math.cos(angle), spec.yMin + (spec.yMax - spec.yMin) * t, r * Math.sin(angle));
      };
      parts.push(strut(at(postRange[0]), at(postRange[1]), spec.strutRadius * 1.6));
    }
    return merge(parts);
  }, [spec]);
  const skirt = useDisposable(
    () => new LatheGeometry(latheProfile(spec.radiusAt, spec.yMin, spec.yMax, 0, variant === 'evolut' ? 0.38 : 0.5, 0.006), 64),
    [spec],
  );

  const leaflets =
    variant === 'evolut'
      ? { radius: 0.27, top: 0.27, depth: 0.32, coaptation: 0.14, sag: 0.08 }
      : { radius: 0.31, top: 0.25, depth: 0.36, coaptation: 0.1, sag: 0.08 };

  return (
    <group position={[0, variant === 'evolut' ? -0.04 : 0, 0]}>
      <mesh geometry={lattice.geometry}>
        <meshStandardMaterial color={variant === 'evolut' ? COLORS.nitinol : COLORS.cobaltChrome} metalness={0.95} roughness={0.22} {...surface(o)} />
      </mesh>
      <mesh geometry={posts}>
        <meshStandardMaterial color={variant === 'evolut' ? COLORS.nitinol : COLORS.cobaltChrome} metalness={0.95} roughness={0.22} {...surface(o)} />
      </mesh>
      <mesh geometry={skirt}>
        <FabricMaterial o={o} repeat={[36, 3]} alpha={0.9} />
      </mesh>
      <TricuspidLeaflets o={o} color={COLORS.pericardium} {...leaflets} />
    </group>
  );
};

// Melody valve: bovine jugular vein with its native valve, sewn inside a platinum-iridium stent with gold-brazed welds.
export const StentedVeinValve = ({ o }: ModelProps) => {
  const spec = useMemo<LatticeSpec>(
    () => ({ rows: 5, cols: 8, yMin: -0.4, yMax: 0.4, strutRadius: 0.012, radiusAt: () => 0.3 }),
    [],
  );
  const lattice = useMemo(() => buildLattice(spec), [spec]);
  useEffect(() => () => lattice.geometry.dispose(), [lattice]);
  const welds = useDisposable(() => merge(lattice.nodes.map((p) => joint(p, 0.02))), [lattice]);

  return (
    <group>
      <mesh geometry={lattice.geometry}>
        <meshStandardMaterial color={COLORS.platinum} metalness={0.95} roughness={0.2} {...surface(o)} />
      </mesh>
      <mesh geometry={welds}>
        <meshStandardMaterial color={COLORS.gold} metalness={1} roughness={0.28} {...surface(o)} />
      </mesh>
      <mesh>
        <cylinderGeometry args={[0.288, 0.288, 0.92, 64, 1, true]} />
        <meshPhysicalMaterial color={COLORS.vein} roughness={0.55} sheen={0.5} sheenColor="#ffffff" {...surface(o, 0.6)} />
      </mesh>
      <TricuspidLeaflets o={o} radius={0.28} top={0.36} depth={0.32} coaptation={0.24} sag={0.07} color={COLORS.vein} />
    </group>
  );
};

// Annuloplasty rings: complete saddle-shaped D ring (mitral repair) or open C-shaped posterior band.
export const AnnuloplastyRing = ({ o, band }: ModelProps & { band: boolean }) => {
  const curve = useMemo(() => {
    const points: Vector3[] = [];
    const segments = 96;
    const start = band ? -0.12 * Math.PI : 0;
    const end = band ? 1.12 * Math.PI : Math.PI * 2;
    const count = band ? segments + 1 : segments;
    for (let i = 0; i < count; i++) {
      const t = start + ((end - start) * i) / segments;
      points.push(new Vector3(0.42 * Math.cos(t), 0.06 * Math.cos(2 * t), 0.27 * Math.sin(t) + 0.1 * Math.sin(t) ** 2 - 0.05));
    }
    return new CatmullRomCurve3(points, !band);
  }, [band]);
  const tubeRadius = band ? 0.03 : 0.038;
  const ring = useDisposable(() => new TubeGeometry(curve, 260, tubeRadius, 16, !band), [curve, tubeRadius]);
  const markers = useDisposable(() => {
    const stops = band ? [0.1, 0.5, 0.9] : [0, 0.5, 0.25];
    return merge(
      stops.map((f) => {
        const a = curve.getPointAt((f + 0.994) % 1);
        const b = curve.getPointAt((f + 0.006) % 1);
        return strut(a, b, tubeRadius * 1.12);
      }),
    );
  }, [curve, tubeRadius]);
  const caps = useDisposable(
    () => (band ? merge([joint(curve.getPointAt(0), tubeRadius), joint(curve.getPointAt(1), tubeRadius)]) : new BufferGeometry()),
    [curve, band, tubeRadius],
  );

  return (
    <group scale={1.3}>
      <mesh geometry={ring}>
        <FabricMaterial o={o} repeat={[70, 2]} />
      </mesh>
      <mesh geometry={markers}>
        <meshStandardMaterial color={COLORS.marker} roughness={0.7} {...surface(o)} />
      </mesh>
      {band ? (
        <mesh geometry={caps}>
          <FabricMaterial o={o} repeat={[2, 2]} />
        </mesh>
      ) : null}
    </group>
  );
};

// Tissue-engineered valve: biodegradable fiber scaffold being populated by the patient's own cells.
const CELL_COUNT = 180;

export const TissueEngineeredValve = ({ o }: ModelProps) => {
  const fibers = useDisposable(() => {
    let seed = 7;
    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    const parts: BufferGeometry[] = [];
    for (let f = 0; f < 40; f++) {
      const points: Vector3[] = [];
      const a0 = random() * Math.PI * 2;
      const twist = (random() - 0.5) * 1.6;
      const r = 0.335 + random() * 0.02;
      for (let i = 0; i <= 24; i++) {
        const t = i / 24;
        const a = a0 + twist * t * Math.PI;
        points.push(new Vector3(r * Math.cos(a), -0.38 + 0.76 * t, r * Math.sin(a)));
      }
      parts.push(new TubeGeometry(new CatmullRomCurve3(points), 48, 0.004, 5, false));
    }
    return merge(parts);
  }, []);
  const cellsRef = useRef<InstancedMesh>(null);
  const cellMaterial = useRef<MeshStandardMaterial>(null);

  useLayoutEffect(() => {
    const cells = cellsRef.current;
    if (!cells) return;
    let seed = 42;
    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    const dummy = new Object3D();
    for (let i = 0; i < CELL_COUNT; i++) {
      const a = random() * Math.PI * 2;
      const r = 0.33 + random() * 0.03;
      dummy.position.set(r * Math.cos(a), -0.36 + random() * 0.72, r * Math.sin(a));
      dummy.scale.setScalar(0.7 + random() * 0.6);
      dummy.updateMatrix();
      cells.setMatrixAt(i, dummy.matrix);
    }
    cells.instanceMatrix.needsUpdate = true;
  }, []);

  useFrame(({ clock }) => {
    if (cellMaterial.current) cellMaterial.current.emissiveIntensity = 0.35 + 0.25 * Math.sin(clock.elapsedTime * 3);
  });

  return (
    <group>
      <mesh geometry={fibers}>
        <meshStandardMaterial color="#fff1f2" roughness={0.8} {...surface(o, 0.85)} />
      </mesh>
      <mesh>
        <cylinderGeometry args={[0.33, 0.33, 0.76, 64, 1, true]} />
        <meshPhysicalMaterial color={COLORS.livingTissue} roughness={0.5} sheen={0.6} sheenColor="#ffffff" {...surface(o, 0.35)} />
      </mesh>
      <instancedMesh ref={cellsRef} args={[undefined, undefined, CELL_COUNT]}>
        <sphereGeometry args={[0.012, 8, 6]} />
        <meshStandardMaterial ref={cellMaterial} color={COLORS.cells} emissive={COLORS.cells} roughness={0.4} {...surface(o)} />
      </instancedMesh>
      <TricuspidLeaflets o={o} radius={0.32} top={0.36} depth={0.42} coaptation={0.22} sag={0.1} color={COLORS.livingTissue} alpha={0.9} />
    </group>
  );
};
