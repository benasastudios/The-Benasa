import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Hero = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        // Basic Three.js initialization (placeholder for the full globe logic)
        if (!canvasRef.current) return;
        
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        
        renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
        canvasRef.current.appendChild(renderer.domElement);
        
        const geometry = new THREE.SphereGeometry(2, 32, 32);
        const material = new THREE.MeshBasicMaterial({ color: 0xcccccc, wireframe: true });
        const sphere = new THREE.Mesh(geometry, material);
        scene.add(sphere);
        
        camera.position.z = 5;
        
        const animate = function () {
            requestAnimationFrame(animate);
            sphere.rotation.x += 0.005;
            sphere.rotation.y += 0.005;
            renderer.render(scene, camera);
        };
        
        animate();

        const handleResize = () => {
            if (!canvasRef.current) return;
            camera.aspect = canvasRef.current.clientWidth / canvasRef.current.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (canvasRef.current) {
                canvasRef.current.innerHTML = '';
            }
        };
    }, []);

    return (
        <section className="min-h-screen flex items-center pt-20 bg-white relative overflow-hidden" id="hero-section">
            <div className="absolute inset-0 abstract-pattern"></div>
            
            {/* Three.js Canvas Container */}
            <div 
                id="hero-canvas" 
                ref={canvasRef}
                className="absolute top-0 right-0 w-full h-full z-[1] pointer-events-none opacity-60"
                role="img" 
                aria-label="Interactive 3D globe visualization"
            ></div>

            <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
                <div className="max-w-4xl">
                    <span className="tag text-neutral-400 mb-8 inline-block text-[0.65rem] font-extrabold uppercase tracking-[0.15em] px-3 py-1 border border-current rounded-sm">
                        Established in Accra • Global Integration
                    </span>
                    <h1 className="text-6xl md:text-[5.5rem] font-extrabold mb-8 tracking-[-0.04em] leading-[0.95] text-neutral-900">
                        Your Remote <br/>Creative <span className="text-neutral-300 italic font-light">Department.</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-neutral-500 mb-12 max-w-2xl font-light leading-relaxed">
                        High-end Graphic Design and Web Development. Integrated directly into your workflow, from Ghana to the world.
                    </p>
                    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-8">
                        <a href="#pricing" className="btn-black px-10 py-5 text-[0.8rem] font-bold uppercase tracking-widest text-center bg-black text-white transition-all duration-400 hover:tracking-[0.05em] hover:bg-neutral-800">
                            Start Trial
                        </a>
                        <a href="#model" className="flex items-center text-black font-bold text-[0.8rem] uppercase tracking-widest group">
                            The Philosophy 
                            <i className="fas fa-arrow-right ml-3 transform group-hover:translate-x-2 transition"></i>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
