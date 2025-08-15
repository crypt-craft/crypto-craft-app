import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';

function CubeGrid({ count = 20, spacing = 1.5 }) {
  const group = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 0.1;
    if (group.current) {
      group.current.rotation.y = t;
      group.current.rotation.x = Math.sin(t) * 0.2;
    }
  });

  return (
    <group ref={group}>
      {Array.from({ length: count }).map((_, i) => 
        Array.from({ length: count }).map((_, j) => (
          <mesh 
            key={`${i}-${j}`} 
            position={[
              (i - count / 2) * spacing, 
              0, 
              (j - count / 2) * spacing
            ]}
            scale={0.05 + Math.sin(i) * 0.02 + Math.cos(j) * 0.02}
          >
            <boxGeometry />
            <meshStandardMaterial 
              color={new THREE.Color(0.1 + i/count, 0.3, 0.5 + j/count).getHex()} 
              transparent 
              opacity={0.2} 
              emissive={new THREE.Color(0.1 + i/count, 0.3, 0.5 + j/count).getHex()}
              emissiveIntensity={0.5}
            />
          </mesh>
        ))
      )}
    </group>
  );
}

export function BackgroundScene() {
  return (
    <div className="fixed w-full h-full top-0 left-0 -z-10 bg-gradient-to-b from-gray-900 via-blue-900 to-black">
      <Canvas camera={{ position: [0, 2, 5], fov: 75 }}>
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <CubeGrid />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      </Canvas>
    </div>
  );
}