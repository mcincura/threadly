import { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, useGLTF } from '@react-three/drei';
import { ContactShadows } from '@react-three/drei';
import './section2.css'

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
    const prevScroll = useRef(0);

    const videoSources = [
        './assets/videos/video1.mp4',
        './assets/videos/video2.mp4',
        './assets/videos/video3.mp4',
        './assets/videos/video4.mp4',
    ];

    const thresholds = [0.0, 0.25, 0.5, 0.75];

    const targetPosition = new THREE.Vector3(0, 0, 0);
    const targetRotation = new THREE.Euler(0.1, 0.25, 0);

    // Load initial video texture
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

    // Entrance animation
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

    // Define this utility
    const getIndexFromProgress = (progress) => {
        if (progress < 0.25) return 0;
        if (progress < 0.5) return 1;
        if (progress < 0.75) return 2;
        return 3; // catch-all for >= 0.75
    };

    useEffect(() => {
        if (!animationDone || spinning) return;

        const newIndex = getIndexFromProgress(scrollProgress);

        if (newIndex !== currentVideoIndex) {
            setDesiredVideoIndex(newIndex); // store what we want to switch to
            setSpinning(true);
            spinRef.current = 0;
        }
    }, [scrollProgress, animationDone, spinning, currentVideoIndex]);

    useFrame(() => {
        if (!ref.current) return;

        // Entrance animation
        if (!animationDone && startAnimation) {
            const lerpFactor = 0.03;

            ref.current.position.lerp(targetPosition, lerpFactor);
            ref.current.rotation.x = THREE.MathUtils.lerp(
                ref.current.rotation.x,
                targetRotation.x,
                lerpFactor
            );
            ref.current.rotation.y = THREE.MathUtils.lerp(
                ref.current.rotation.y,
                targetRotation.y,
                lerpFactor
            );
            ref.current.rotation.z = THREE.MathUtils.lerp(
                ref.current.rotation.z,
                targetRotation.z,
                lerpFactor
            );

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

        // Spin + jump animation
        if (spinning) {
            const speed = 0.07;
            spinRef.current += speed;

            // Rotate
            ref.current.rotation.y += speed;

            // Jump arc using sine
            const jumpHeight = 0.2;
            const progress = spinRef.current / (2 * Math.PI); // 0 to 1
            const yJump = Math.sin(progress * Math.PI) * jumpHeight;
            ref.current.position.y = targetPosition.y + yJump;

            if (
                spinRef.current >= Math.PI &&
                currentVideoIndex !== desiredVideoIndex
            ) {
                const video = videoRef.current;
                video.src = videoSources[desiredVideoIndex];
                video.load();
                video.play().catch(() => { });
                setCurrentVideoIndex(desiredVideoIndex);
            }

            if (spinRef.current >= 2 * Math.PI) {
                // End of spin
                ref.current.rotation.y = targetRotation.y;
                ref.current.position.y = targetPosition.y;
                setSpinning(false);
            }
        }
    });

    return <primitive ref={ref} object={scene} scale={2} />;
}

const PhoneModelMobile = ({ isSection2, targetIndex, onIndexChange }) => {
    const { scene } = useGLTF('./model/iphone2.glb');
    const ref = useRef();
    const videoRef = useRef(document.createElement('video'));

    const [animationDone, setAnimationDone] = useState(false);
    const [startAnimation, setStartAnimation] = useState(false);
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const [desiredVideoIndex, setDesiredVideoIndex] = useState(0);
    const [spinning, setSpinning] = useState(false);
    const [rotationDirection, setRotationDirection] = useState(1); // 1 = right, -1 = left
    const spinRef = useRef(0);

    const videoSources = [
        './assets/videos/video1.mp4',
        './assets/videos/video2.mp4',
        './assets/videos/video3.mp4',
        './assets/videos/video4.mp4',
    ];

    const targetPosition = new THREE.Vector3(0, 0, 0);
    const targetRotation = new THREE.Euler(0.1, 0.25, 0);

    // Load video texture
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

    //SET VIDEO INDEX & ROTATION
    useEffect(() => {
        if (targetIndex !== currentVideoIndex && !spinning) {
            // Determine rotation direction based on swipe
            const direction = targetIndex > currentVideoIndex ? -1 : 1;
            setRotationDirection(direction);

            setDesiredVideoIndex(targetIndex);
            setSpinning(true);
            spinRef.current = 0;
        }
    }, [targetIndex, currentVideoIndex, spinning]);

    // ENTRANCE ANIMATION
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

    //ANIMATIONS IMPLEMENTATION
    useFrame((state, delta) => {
        if (!ref.current) return;

        // Entrance animation
        if (!animationDone && startAnimation) {
            const animationSpeed = 3; // Units per second
            const lerpFactor = 1 - Math.exp(-animationSpeed * delta);

            ref.current.position.lerp(targetPosition, lerpFactor);
            ref.current.rotation.x = THREE.MathUtils.lerp(
                ref.current.rotation.x,
                targetRotation.x,
                lerpFactor
            );
            ref.current.rotation.y = THREE.MathUtils.lerp(
                ref.current.rotation.y,
                targetRotation.y,
                lerpFactor
            );
            ref.current.rotation.z = THREE.MathUtils.lerp(
                ref.current.rotation.z,
                targetRotation.z,
                lerpFactor
            );

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

        // Spin animation for video transitions
        if (spinning) {
            const rotationsPerSecond = 1; // Half rotation per second
            const rotationAmount = rotationsPerSecond * Math.PI * 2 * delta * rotationDirection;

            ref.current.rotation.y += rotationAmount;
            spinRef.current += Math.abs(rotationAmount);

            // Jump arc using sine
            const jumpHeight = 0.1;
            const progress = spinRef.current / (2 * Math.PI);
            const yJump = Math.sin(progress * Math.PI) * jumpHeight;
            ref.current.position.y = targetPosition.y + yJump;

            // Update video at 180 degrees (half rotation)
            if (spinRef.current >= Math.PI && currentVideoIndex !== desiredVideoIndex) {
                const video = videoRef.current;
                video.src = videoSources[desiredVideoIndex];
                video.load();
                video.play().catch(() => { });
                setCurrentVideoIndex(desiredVideoIndex);
                onIndexChange(desiredVideoIndex);
            }

            // End spin after full rotation (360 degrees)
            if (spinRef.current >= 2 * Math.PI) {
                // Reset to target rotation but maintain the new orientation
                ref.current.rotation.y = targetRotation.y + (2 * Math.PI * rotationDirection);
                ref.current.position.y = targetPosition.y;
                setSpinning(false);
            }
        }
    });

    return <primitive ref={ref} object={scene} scale={2} />;
}

const Section2 = ({ isMobile, isSection2, scrollProgress }) => {

    const [mobileIndex, setMobileIndex] = useState(0);
    const touchStartX = useRef(0);

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
        },
        {
            title: 'Section 2.4',
            description: 'DESCRIPTION4',
        },
    ];

    // HANDLE SWIPE GESTURES ON MOBILE
    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
    };
    const handleTouchEnd = (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX.current - touchEndX;

        // 50px threshold for swiping
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                // Swipe left | next video
                setMobileIndex(prev => Math.min(3, prev + 1));
            } else {
                // Swipe right | previous video
                setMobileIndex(prev => Math.max(0, prev - 1));
            }
        }
    };

    //CHANGE VIDEO BASED ON SCROLL
    const getIndexFromProgress = (progress) => {
        if (typeof progress !== 'number' || isNaN(progress)) return 0;
        if (progress < 0.25) return 0;
        if (progress < 0.5) return 1;
        if (progress < 0.75) return 2;
        return 3; // Handles progress >= 0.75 and invalid high values
    };

    const currentIndex = isMobile ? mobileIndex : getIndexFromProgress(scrollProgress);
    const { title, description } = contentMap[currentIndex];

    return (
        <div className="section2-main">
            {isMobile ?
                (
                    <>
                        <div
                            className="section2-mobile-phone"
                            onTouchStart={handleTouchStart}
                            onTouchEnd={handleTouchEnd}
                        >
                            <Canvas camera={{ position: [0, 0, -2] }} shadows>
                                <ambientLight intensity={0.5} />
                                <directionalLight
                                    position={[2, 6, -3]}
                                    intensity={1}
                                />
                                <PhoneModelMobile
                                    isSection2={isSection2}
                                    targetIndex={mobileIndex}
                                    onIndexChange={setMobileIndex}
                                />
                                <ContactShadows
                                    position={[0, -1.04, 0]}
                                    opacity={0.7}
                                    scale={3}
                                    blur={3}
                                    far={9}
                                />
                                <Environment preset="studio" />
                            </Canvas>
                        </div>
                        <div className="section2-mobile-UI">
                            {/* Carousel dots */}
                            <div className="dots-container">
                                {[0, 1, 2, 3].map((index) => (
                                    <div
                                        key={index}
                                        className={`dot ${mobileIndex === index ? "active" : ""}`}
                                        onClick={() => setMobileIndex(index)}
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
                    </>
                ) : (
                    <>
                        <div className="section2-desktop-phone">
                            <Canvas camera={{ position: [0, 0, -2] }} shadows>
                                <ambientLight intensity={0.5} />
                                <directionalLight
                                    position={[2, 6, -3]}
                                    intensity={1}
                                    castShadow
                                    shadow-mapSize-width={4096}
                                    shadow-mapSize-height={4096}
                                />
                                <PhoneModel
                                    isSection2={isSection2}
                                    scrollProgress={scrollProgress}
                                />
                                <ContactShadows
                                    position={[0, -1.1, 0]}
                                    opacity={0.7}
                                    scale={3}
                                    blur={3}
                                    far={9}
                                />
                                <Environment preset="studio" />
                            </Canvas>
                        </div>
                        <div className="section2-desktop-UI">
                            {/* Carousel dots */}
                            <div className="dots-container-desktop">
                                {[0, 1, 2, 3].map((index) => (
                                    <div
                                        key={index}
                                        className={`dot ${currentIndex === index ? "active" : ""}`}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="section2-desktop-text">
                            <h1>{title}</h1>
                            <p>{description}</p>
                        </div>
                    </>
                )}
        </div>
    )
}

export default Section2;