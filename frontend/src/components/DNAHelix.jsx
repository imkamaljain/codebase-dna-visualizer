import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { useMemo, useState } from 'react';
import * as THREE from 'three';
import HeatmapOverlay from './HeatmapOverlay';

function DNAHelix({ dnaSequence, onFileSelect, timelineKey = 0, onHotspotSelect }) {
  const [hoveredFile, setHoveredFile] = useState(null);

  const nucleotides = useMemo(() => {
    return dnaSequence.map((file, index) => {
      const angle = index * 0.3;
      const radius = 8;
      const height = index * 0.4 - dnaSequence.length * 0.2;

      // Strand 1
      const x1 = Math.cos(angle) * radius;
      const z1 = Math.sin(angle) * radius;

      // Strand 2 (offset by PI)
      const x2 = Math.cos(angle + Math.PI) * radius;
      const z2 = Math.sin(angle + Math.PI) * radius;

      return {
        ...file,
        index,
        position1: [x1, height, z1],
        position2: [x2, height, z2],
        color: getNucleotideColor(file.nucleotide),
        entropyColor: getEntropyColor(file.entropy)
      };
    });
  }, [dnaSequence]);

  return (
    <div className="w-full h-full relative">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 25]} fov={60} />
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          autoRotate
          autoRotateSpeed={0.5}
        />
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <Environment preset="city" />

        <group rotation={[0.2, 0, 0]}>
          {nucleotides.map((nucleotide) => (
            <NucleotidePair
              key={nucleotide.index}
              data={nucleotide}
              onHover={setHoveredFile}
              onClick={() => onFileSelect(nucleotide)}
            />
          ))}
        </group>

        {/* Heatmap overlay for hotspots */}
        <HeatmapOverlay 
          dnaSequence={dnaSequence} 
          onHotspotClick={onHotspotSelect}
        />

        {/* Connection lines (backbone) */}
        <Backbone nucleotides={nucleotides} />
      </Canvas>

      {/* Tooltip */}
      {hoveredFile && (
        <div className="absolute top-4 left-4 glass rounded-lg p-3 pointer-events-none max-w-xs">
          <div className="text-white font-semibold text-sm">{hoveredFile.file}</div>
          <div className="text-slate-400 text-xs mt-1">
            Nucleotide: {hoveredFile.nucleotide}
          </div>
          <div className="text-slate-400 text-xs">
            Entropy: {hoveredFile.entropy} | Complexity: {hoveredFile.complexity}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 glass rounded-lg p-3">
        <div className="text-white text-xs font-semibold mb-2">File Types</div>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#00ff88]"></span>
            <span className="text-slate-400">JS/JSX/HTML/MD</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#ff6b6b]"></span>
            <span className="text-slate-400">TS/TSX/CSS/SQL</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#4dabf7]"></span>
            <span className="text-slate-400">Go/C/C++/JSON</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#ffd43b]"></span>
            <span className="text-slate-400">Python/YAML/XML</span>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-white/10">
          <div className="text-white text-xs font-semibold mb-1">🔥 Hotspots</div>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/60 border border-red-500"></span>
              <span className="text-slate-400">High severity</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-orange-500/60 border border-orange-500"></span>
              <span className="text-slate-400">Medium severity</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-yellow-500/60 border border-yellow-500"></span>
              <span className="text-slate-400">Low severity</span>
            </div>
          </div>
          <div className="text-slate-500 text-xs mt-2">Click any node to view details</div>
        </div>
      </div>
    </div>
  );
}

function NucleotidePair({ data, onHover, onClick }) {
  const [hovered, setHovered] = useState(false);

  // Use nucleotide color for the spheres
  const color = hovered ? '#ffffff' : data.color;
  const scale = hovered ? 1.3 : 1;
  
  // Entropy affects emissive intensity (glow)
  const entropyIntensity = Math.min(1, data.entropy / 5);

  return (
    <group>
      {/* Strand 1 nucleotide */}
      <mesh
        position={data.position1}
        onPointerOver={() => {
          setHovered(true);
          onHover(data);
        }}
        onPointerOut={() => {
          setHovered(false);
          onHover(null);
        }}
        onClick={onClick}
      >
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.3 + entropyIntensity * 0.5}
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>

      {/* Strand 2 nucleotide */}
      <mesh
        position={data.position2}
        onPointerOver={() => {
          setHovered(true);
          onHover(data);
        }}
        onPointerOut={() => {
          setHovered(false);
          onHover(null);
        }}
        onClick={onClick}
      >
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.3 + entropyIntensity * 0.5}
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>

      {/* Base pair connector */}
      <line>
        <bufferGeometry>
          <float32BufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([...data.position1, ...data.position2])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color={data.color} opacity={0.3} transparent />
      </line>
    </group>
  );
}

function Backbone({ nucleotides }) {
  const strand1Points = useMemo(() => {
    return nucleotides.map(n => new THREE.Vector3(...n.position1));
  }, [nucleotides]);

  const strand2Points = useMemo(() => {
    return nucleotides.map(n => new THREE.Vector3(...n.position2));
  }, [nucleotides]);

  return (
    <>
      <line>
        <bufferGeometry>
          <float32BufferAttribute
            attach="attributes-position"
            count={strand1Points.length}
            array={new Float32Array(strand1Points.flatMap(p => [p.x, p.y, p.z]))}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#475569" opacity={0.5} transparent />
      </line>
      <line>
        <bufferGeometry>
          <float32BufferAttribute
            attach="attributes-position"
            count={strand2Points.length}
            array={new Float32Array(strand2Points.flatMap(p => [p.x, p.y, p.z]))}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#475569" opacity={0.5} transparent />
      </line>
    </>
  );
}

function getNucleotideColor(nucleotide) {
  const colors = {
    'A': '#00ff88',
    'T': '#ff6b6b',
    'G': '#4dabf7',
    'C': '#ffd43b'
  };
  return colors[nucleotide] || '#ffffff';
}

function getEntropyColor(entropy) {
  if (entropy < 3.5) return '#00ff88';
  if (entropy < 4.5) return '#ffd43b';
  if (entropy < 5.5) return '#ff922b';
  return '#ff6b6b';
}

export default DNAHelix;
