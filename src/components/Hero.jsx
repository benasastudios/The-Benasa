import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Hero = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (!canvasRef.current) return;
        
        const container = canvasRef.current;
        let scene, camera, renderer, globe, points, lines = [];

        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(45, container.offsetWidth / container.offsetHeight, 0.1, 1000);
        camera.position.z = 250;

        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(container.offsetWidth, container.offsetHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);

        // Create dotted globe
        const radius = 90;
        const segments = 40;
        const rings = 40;
        const geometry = new THREE.BufferGeometry();
        const positions = [];

        for (let i = 0; i <= rings; i++) {
            const phi = i * Math.PI / rings;
            for (let j = 0; j <= segments; j++) {
                const theta = j * 2 * Math.PI / segments;
                const x = radius * Math.sin(phi) * Math.cos(theta);
                const y = radius * Math.cos(phi);
                const z = radius * Math.sin(phi) * Math.sin(theta);
                positions.push(x, y, z);
            }
        }
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        const material = new THREE.PointsMaterial({ color: 0x000000, size: 0.8, transparent: true, opacity: 0.15 });
        globe = new THREE.Points(geometry, material);
        scene.add(globe);

        // Specific City Hubs (lat, lon) -> (x, y, z)
        const hubs = [
            { name: 'Accra', lat: 5.6037, lon: -0.1870 },
            { name: 'London', lat: 51.5074, lon: -0.1278 },
            { name: 'New York', lat: 40.7128, lon: -74.0060 },
            { name: 'Dubai', lat: 25.2048, lon: 55.2708 },
            { name: 'Tokyo', lat: 35.6762, lon: 139.6503 },
            { name: 'San Francisco', lat: 37.7749, lon: -122.4194 }
        ];

        const coords = hubs.map(h => {
            const phi = (90 - h.lat) * (Math.PI / 180);
            const theta = (h.lon + 180) * (Math.PI / 180);
            return new THREE.Vector3(
                -radius * Math.sin(phi) * Math.cos(theta),
                radius * Math.cos(phi),
                radius * Math.sin(phi) * Math.sin(theta)
            );
        });

        // Add highlight points
        const hubGeometry = new THREE.BufferGeometry().setFromPoints(coords);
        const hubMaterial = new THREE.PointsMaterial({ color: 0x000000, size: 3 });
        const hubPoints = new THREE.Points(hubGeometry, hubMaterial);
        globe.add(hubPoints);

        function createConnection(start, end) {
            const curve = new THREE.QuadraticBezierCurve3(
                start,
                start.clone().multiplyScalar(1.4).add(end.clone().multiplyScalar(1.4)).multiplyScalar(0.5),
                end
            );
            const points = curve.getPoints(50);
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const material = new THREE.LineBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.1 });
            const line = new THREE.Line(geometry, material);
            globe.add(line);
            
            // Animated dash
            const dashGeom = new THREE.BufferGeometry().setFromPoints(points.slice(0, 5));
            const dashMat = new THREE.LineBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.4 });
            const dash = new THREE.Line(dashGeom, dashMat);
            dash.userData = { points, offset: 0 };
            globe.add(dash);
            lines.push(dash);
        }

        // Connect Accra (hubs[0]) to others
        const accra = coords[0];
        for (let i = 1; i < coords.length; i++) {
            createConnection(accra, coords[i]);
        }

        let animationFrameId;

        function animate() {
            animationFrameId = requestAnimationFrame(animate);
            globe.rotation.y += 0.001;
            globe.rotation.x += 0.0005;

            lines.forEach(dash => {
                dash.userData.offset = (dash.userData.offset + 1) % dash.userData.points.length;
                const startIdx = dash.userData.offset;
                const endIdx = (startIdx + 5) % dash.userData.points.length;
                const segment = endIdx > startIdx 
                    ? dash.userData.points.slice(startIdx, endIdx)
                    : [...dash.userData.points.slice(startIdx), ...dash.userData.points.slice(0, endIdx)];
                dash.geometry.setFromPoints(segment);
            });

            renderer.render(scene, camera);
        }

        animate();

        const handleResize = () => {
            if (!container) return;
            camera.aspect = container.offsetWidth / container.offsetHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.offsetWidth, container.offsetHeight);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
            if (container && renderer.domElement) {
                container.removeChild(renderer.domElement);
            }
            // Cleanup Three.js resources
            scene.clear();
            renderer.dispose();
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
