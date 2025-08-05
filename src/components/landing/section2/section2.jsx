import { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, useGLTF } from '@react-three/drei';
import { ContactShadows } from '@react-three/drei';
import './section2.css';
import TracingBeam from '../../ui/tracingScroll/tracingBeam';

const PhoneModel = ({ isSection2, scrollProgress }) => {
    const { scene } = useGLTF('./model/iphone2.glb');
    const ref = useRef();
    const videoRef = useRef(document.createElement('video'));

    const [animationDone, setAnimationDone] = useState(false);
    const [startAnimation, setStartAnimation] = useState(false);
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const [desiredVideoIndex, setDesiredVideoIndex] = useState(0);
    const [spinning, setSpinning] = useState(false);

    const spinRef = useRef(0);

    const videoSources = [
        './assets/videos/video1.mp4',
        './assets/videos/video2.mp4',
        './assets/videos/video3.mp4'
    ];

    const targetPosition = new THREE.Vector3(0, 0, 0);
    const targetRotation = new THREE.Euler(0.1, 0.25, 0);

    useEffect(() => {
        const video = videoRef.current;
        video.src = videoSources[0];
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
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = false;

                if (child.name === 'Body_Wallpaper_0') {
                    child.material.map = videoTexture;
                    child.material.needsUpdate = true;
                }
            }
        });
    }, [scene]);

    useEffect(() => {
        if (isSection2 && ref.current) {
            ref.current.position.set(2, 2, 0);
            ref.current.rotation.set(-1.5, -5, 0);
            setAnimationDone(false);
            setStartAnimation(false);

            const timeout = setTimeout(() => {
                setStartAnimation(true);
            }, 200);

            return () => clearTimeout(timeout);
        }
    }, [isSection2]);

    const getIndexFromProgress = (progress) => {
        if (progress < 0.33) return 0;
        if (progress < 0.66) return 1;
        return 2;
    };

    useEffect(() => {
        if (!animationDone || spinning) return;

        const newIndex = getIndexFromProgress(scrollProgress);

        if (newIndex !== currentVideoIndex) {
            setDesiredVideoIndex(newIndex);
            setSpinning(true);
            spinRef.current = 0;
        }
    }, [scrollProgress, animationDone, spinning, currentVideoIndex]);

    useFrame(() => {
        if (!ref.current) return;

        if (!animationDone && startAnimation) {
            const lerpFactor = 0.03;
            ref.current.position.lerp(targetPosition, lerpFactor);
            ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, targetRotation.x, lerpFactor);
            ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, targetRotation.y, lerpFactor);
            ref.current.rotation.z = THREE.MathUtils.lerp(ref.current.rotation.z, targetRotation.z, lerpFactor);

            const dist = ref.current.position.distanceTo(targetPosition);
            const rotDiff =
                Math.abs(ref.current.rotation.x - targetRotation.x) +
                Math.abs(ref.current.rotation.y - targetRotation.y) +
                Math.abs(ref.current.rotation.z - targetRotation.z);

            if (dist < 0.01 && rotDiff < 0.01) {
                setAnimationDone(true);
                ref.current.position.copy(targetPosition);
                ref.current.rotation.copy(targetRotation);
            }
        }

        if (spinning) {
            const speed = 0.07;
            spinRef.current += speed;
            ref.current.rotation.y += speed;

            const jumpHeight = 0.2;
            const progress = spinRef.current / (2 * Math.PI);
            const yJump = Math.sin(progress * Math.PI) * jumpHeight;
            ref.current.position.y = targetPosition.y + yJump;

            if (spinRef.current >= Math.PI && currentVideoIndex !== desiredVideoIndex) {
                const video = videoRef.current;
                video.src = videoSources[desiredVideoIndex];
                video.load();
                video.play().catch(() => { });
                setCurrentVideoIndex(desiredVideoIndex);
            }

            if (spinRef.current >= 2 * Math.PI) {
                ref.current.rotation.y = targetRotation.y;
                ref.current.position.y = targetPosition.y;
                setSpinning(false);
            }
        }
    });

    return <primitive ref={ref} object={scene} scale={2} />;
};

const Section2 = ({ isMobile, isSection2, scrollProgress }) => {
    const getIndexFromProgress = (progress) => {
        if (typeof progress !== 'number' || isNaN(progress)) return 0;
        if (progress < 0.33) return 0;
        if (progress < 0.66) return 1;
        return 2;
    };

    const currentIndex = getIndexFromProgress(scrollProgress);

    const contentMap = [
        {
            title: 'Section 2.1',
            description: 'DESCRIPTION1',
        },
        {
            title: 'Section 2.2',
            description: 'DESCRIPTION2',
        },
        {
            title: 'Section 2.3',
            description: 'DESCRIPTION3',
        }
    ];

    const { title, description } = contentMap[currentIndex];

    return (
        isMobile ? (
            <div className="section2-main">
                <div className="section2-mobile-phone">
                    <Canvas camera={{ position: [0, 0, -2] }} shadows>
                        <ambientLight intensity={0.5} />
                        <directionalLight position={[2, 6, -3]} intensity={1} castShadow />
                        <PhoneModel isSection2={isSection2} scrollProgress={scrollProgress} />
                        <ContactShadows position={[0, -1.1, 0]} opacity={0.7} scale={3} blur={3} far={9} />
                        <Environment preset="studio" />
                    </Canvas>
                </div>

                <div className="section2-mobile-UI">
                    <div className="dots-container">
                        {[0, 1, 2].map((index) => (
                            <div
                                key={index}
                                className={`dot ${currentIndex === index ? "active" : ""}`}
                            />
                        ))}
                    </div>
                </div>

                <div className="section2-mobile-text">
                    <div className="section2-mobile-text-wrapper">
                        <h1>{title}</h1>
                        <p>{description}</p>
                    </div>
                </div>
            </div>
        ) : (
            <div className="section2-main">
                <TracingBeam scrollProgress={scrollProgress} />
                <div className="section2-desktop-phone">
                    <Canvas camera={{ position: [0, 0, -2] }} shadows>
                        <ambientLight intensity={0.5} />
                        <directionalLight position={[2, 6, -3]} intensity={1} castShadow />
                        <PhoneModel isSection2={isSection2} scrollProgress={scrollProgress} />
                        <ContactShadows position={[0, -1.1, 0]} opacity={0.7} scale={3} blur={3} far={9} />
                        <Environment preset="studio" />
                    </Canvas>
                </div>
                <div className="section2-desktop-text">
                    <h1>{title}</h1>
                    <p>{description}</p>
                </div>
            </div>
        )
    );

};

export default Section2;
