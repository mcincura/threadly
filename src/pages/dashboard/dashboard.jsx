import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import './dashboard.css';

const PhoneModel = () => {
    const { scene } = useGLTF('/iphone2.glb');
    const videoRef = useRef(document.createElement('video'));

    useEffect(() => {
        const video = videoRef.current;
        video.src = '/video.mp4';
        video.crossOrigin = 'anonymous';
        video.loop = true;
        video.muted = true;
        video.playsInline = true;
        video.load();
        video.play().catch((err) => console.warn('Autoplay blocked:', err));

        const videoTexture = new THREE.VideoTexture(video);
        videoTexture.minFilter = THREE.LinearFilter;
        videoTexture.magFilter = THREE.LinearFilter;
        videoTexture.generateMipmaps = false;
        videoTexture.colorSpace = THREE.SRGBColorSpace;

        scene.traverse((child) => {
            if (child.isMesh && child.name === 'Body_Wallpaper_0') {
                child.material.map = videoTexture;
                child.material.needsUpdate = true;
            }
        });
    }, [scene]);

    return <primitive object={scene} scale={1} />;
};

const Dash = () => {
    return (
        <div className="dash-main" style={{ width: '100%', height: '100vh' }}>
            <Canvas camera={{ position: [0, 0, 2] }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[2, 2, 5]} intensity={1} />
                <PhoneModel />
                <Environment preset="studio" />
                <OrbitControls enableZoom={true} />
            </Canvas>
        </div>
    );
};

export default Dash;
