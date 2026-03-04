import { useMemo } from 'react';
import * as THREE from 'three';

/**
 * HeatmapOverlay - Renders hotspot indicators as glowing boundaries around nucleotides
 */
function HeatmapOverlay({ dnaSequence, onHotspotClick }) {
  // Find files with hotspots and create boundary rings
  const hotspotBoundaries = useMemo(() => {
    return dnaSequence
      .filter(file => file.hotspotScore > 0)
      .map((file, index) => {
        const angle = index * 0.3;
        const radius = 8;
        const height = index * 0.4 - dnaSequence.length * 0.2;

        // Calculate positions for both strands
        const x1 = Math.cos(angle) * radius;
        const z1 = Math.sin(angle) * radius;
        const x2 = Math.cos(angle + Math.PI) * radius;
        const z2 = Math.sin(angle + Math.PI) * radius;

        // Get hotspot severity color
        const color = getHotspotColor(file.hotspotScore);
        const intensity = Math.min(1, file.hotspotScore / 60);

        return {
          file,
          index,
          position1: [x1, height, z1],
          position2: [x2, height, z2],
          color,
          intensity,
          scale: 1.2 + (file.hotspotScore / 100) * 0.3
        };
      });
  }, [dnaSequence]);

  if (hotspotBoundaries.length === 0) return null;

  return (
    <group>
      {hotspotBoundaries.map((hotspot) => (
        <HotspotBoundary
          key={hotspot.index}
          data={hotspot}
          onClick={() => onHotspotClick?.(hotspot.file)}
        />
      ))}
    </group>
  );
}

/**
 * HotspotBoundary - Renders a glowing boundary shell around hotspot nucleotides
 */
function HotspotBoundary({ data, onClick }) {
  return (
    <group>
      {/* Outer glow shell for strand 1 */}
      <mesh
        position={data.position1}
        onClick={onClick}
      >
        <sphereGeometry args={[0.55 * data.scale, 24, 24]} />
        <meshBasicMaterial
          color={data.color}
          transparent
          opacity={0.15 * data.intensity}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Outer glow shell for strand 2 */}
      <mesh
        position={data.position2}
        onClick={onClick}
      >
        <sphereGeometry args={[0.55 * data.scale, 24, 24]} />
        <meshBasicMaterial
          color={data.color}
          transparent
          opacity={0.15 * data.intensity}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Ring boundary for strand 1 */}
      <mesh
        position={data.position1}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <torusGeometry args={[0.52 * data.scale, 0.03, 8, 32]} />
        <meshBasicMaterial
          color={data.color}
          transparent
          opacity={0.6 * data.intensity}
        />
      </mesh>

      {/* Ring boundary for strand 2 */}
      <mesh
        position={data.position2}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <torusGeometry args={[0.52 * data.scale, 0.03, 8, 32]} />
        <meshBasicMaterial
          color={data.color}
          transparent
          opacity={0.6 * data.intensity}
        />
      </mesh>
    </group>
  );
}

function getHotspotColor(score) {
  if (score >= 60) return '#ff0000'; // High severity - red
  if (score >= 30) return '#ff6b35'; // Medium severity - orange
  return '#ffd43b'; // Low severity - yellow
}

export default HeatmapOverlay;
