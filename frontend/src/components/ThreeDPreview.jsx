import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Float, PresentationControls, Stage, MeshDistortMaterial } from '@react-three/drei';
import { Suspense, useRef } from 'react';
import { motion } from 'framer-motion';
import { Maximize2, Move3D, RotateCcw } from 'lucide-react';

function Scene({ image }) {
    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 0, 5]} />
            <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
            <pointLight position={[-10, -10, -10]} />
            
            <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
                <mesh>
                    <boxGeometry args={[3, 2, 0.1]} />
                    <meshStandardMaterial map={image} />
                </mesh>
                {/* Visual accents for 3D feel */}
                <mesh position={[0, 0, -0.1]}>
                    <boxGeometry args={[3.2, 2.2, 0.05]} />
                    <meshStandardMaterial color="#B8860B" metalness={0.8} roughness={0.2} />
                </mesh>
            </Float>

            <Environment preset="city" />
        </>
    );
}

export default function ThreeDPreview({ imageUrl }) {
    const containerRef = useRef();

    return (
        <div className="relative w-full aspect-video rounded-[3rem] overflow-hidden bg-black/5 dark:bg-dark-surface-variant/20 border border-surface-variant dark:border-dark-surface-variant shadow-2xl group">
            {/* Header */}
            <div className="absolute top-8 left-8 z-10 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
                    <Move3D className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="font-black text-white text-sm uppercase tracking-widest">3D Virtual Tour</h3>
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Immersive Experience</p>
                </div>
            </div>

            {/* Canvas */}
            <Suspense fallback={<div className="flex items-center justify-center h-full text-white/20 font-black uppercase tracking-widest">Loading Immersive Scene...</div>}>
                <Canvas dpr={[1, 2]}>
                    <Scene />
                </Canvas>
            </Suspense>

            {/* Interaction UI */}
            <div className="absolute bottom-8 right-8 z-10 flex gap-4">
                <button className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-primary transition-all">
                    <RotateCcw className="w-5 h-5" />
                </button>
                <button className="px-6 h-12 rounded-2xl bg-accent text-white flex items-center gap-3 font-black uppercase tracking-widest text-[10px] shadow-xl hover:scale-105 transition-all">
                    <Maximize2 className="w-4 h-4" />
                    Fullscreen View
                </button>
            </div>

            {/* Instructions */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-black/40 backdrop-blur-sm px-6 py-3 rounded-full border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.2em]">
                    Drag to Orbit
                </div>
            </div>
        </div>
    );
}
