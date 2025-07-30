import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import './section1.css'

const Section1 = ({ isMobile }) => {

    // CTA BUTTONS SCROLL ACTIONS
    const scrollToSection2 = () => {
        window.scrollTo({
            top: window.innerHeight * 0.6,
            behavior: 'smooth'
        });
    };
    const scrollToSection3 = () => {
        if (isMobile) {
            window.scrollTo({
                top: window.innerHeight * 2.701,
                behavior: 'smooth'
            });
        } else {
            window.scrollTo({
                top: window.innerHeight * 3.701,
                behavior: 'smooth'
            });
        }
    };

    // THREE.JS ANIMATION
    const threeRef = useRef();
    useEffect(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        // Handle responsive resizing
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('resize', handleResize);
        threeRef.current.appendChild(renderer.domElement);

        const stars = [];
        const geometry = new THREE.SphereGeometry(0.1, 24, 24);
        const material = new THREE.MeshBasicMaterial({ color: 0xffffff });

        for (let i = 0; i < 500; i++) {
            const star = new THREE.Mesh(geometry, material);

            // Target position
            const targetPos = {
                x: (Math.random() - 0.5) * 100,
                y: (Math.random() - 0.5) * 100,
                z: -Math.random() * 100,
            };
            // Start at center
            star.position.set(0, 0, 0);
            star.userData.target = targetPos;

            scene.add(star);
            stars.push(star);
        }

        camera.position.z = 5;

        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');

        // Create a radial gradient for mist glow
        const gradient = ctx.createRadialGradient(256, 256, 20, 256, 256, 256);
        gradient.addColorStop(0, 'rgba(37, 6, 117, 1)');
        gradient.addColorStop(0.5, 'rgba(43, 9, 100, 0.34)');
        gradient.addColorStop(1, 'rgba(8, 8, 89, 0.3)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 512, 512);

        const texture = new THREE.CanvasTexture(canvas);
        const mistMaterial = new THREE.SpriteMaterial({
            map: texture,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });

        const mist = new THREE.Sprite(mistMaterial);
        mist.position.set(0, 0, 0); // Centered in front of camera
        mist.scale.set(isMobile ? 5 : 25, isMobile ? 5 : 25, 1);; // Controls visual size
        scene.add(mist);

        // Haze background mist (larger and darker)
        const hazeCanvas = document.createElement('canvas');
        hazeCanvas.width = 512;
        hazeCanvas.height = 512;
        const hazeCtx = hazeCanvas.getContext('2d');

        const hazeGradient = hazeCtx.createRadialGradient(256, 256, 50, 256, 256, 256);
        hazeGradient.addColorStop(0, 'rgba(80, 30, 120, 0.15)');
        hazeGradient.addColorStop(0.7, 'rgba(20, 10, 50, 0.05)');
        hazeGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        hazeCtx.fillStyle = hazeGradient;
        hazeCtx.fillRect(0, 0, 512, 512);

        const hazeTexture = new THREE.CanvasTexture(hazeCanvas);
        const hazeMaterial = new THREE.SpriteMaterial({
            map: hazeTexture,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });

        const haze = new THREE.Sprite(hazeMaterial);
        haze.position.set(0, 0, -1); // Slightly behind the main mist
        haze.scale.set(isMobile ? 10 : 45, isMobile ? 10 : 45, 1) // Bigger than the main mist
        scene.add(haze);

        let lastTime = 0;
        let targetScale = isMobile ? 5 : 25;
        let targetOpacity = 0.3;
        let targetRotation = 0;
        let targetOffset = { x: 0, y: 0 };

        const explosionDuration = 1; // seconds
        const startTime = performance.now();

        const animate = (time) => {
            requestAnimationFrame(animate);

            const t = time * 0.001;
            const elapsed = (time - startTime) / 1000;
            const progress = Math.min(elapsed / explosionDuration, 1);

            // Animate stars outward
            stars.forEach((star) => {
                const target = star.userData.target;

                // Compute explosion movement
                const explodedX = target.x * progress;
                const explodedY = target.y * progress;
                const explodedZ = target.z * progress;

                if (!star.userData.exploded) {
                    star.position.set(explodedX, explodedY, explodedZ);

                    if (progress >= 1) {
                        star.userData.exploded = true;
                    }
                }

                // Immediately start floating regardless of explosion state
                if (progress >= 1 || star.userData.exploded) {
                    // Tiny X/Y drift (optional)
                    star.position.x += (Math.random() - 0.5) * 0.005;
                    star.position.y += (Math.random() - 0.5) * 0.005;

                    // Forward floating motion
                    star.position.z += 0.1;

                    if (star.position.z > 5) {
                        star.position.z = -100;
                    }
                }
            });

            // Randomize targets every few seconds
            if (t - lastTime > 2) {
                targetScale = (isMobile ? 4 : 24) + Math.random() * (isMobile ? 2 : 4);
                targetOpacity = 0.25 + Math.random() * 0.15;
                targetRotation = Math.random() * 2 * Math.PI;
                targetOffset = {
                    x: (Math.random() - 0.5) * 0.2,
                    y: (Math.random() - 0.5) * 0.2,
                };
                lastTime = t;
            }

            // Smooth transitions (easing)
            mist.scale.x += (targetScale - mist.scale.x) * 0.02;
            mist.scale.y = mist.scale.x;

            mist.material.opacity += (targetOpacity - mist.material.opacity) * 0.02;

            mist.rotation.z += (targetRotation - mist.rotation.z) * 0.002;

            mist.position.x += (targetOffset.x - mist.position.x) * 0.01;
            mist.position.y += (targetOffset.y - mist.position.y) * 0.01;

            // Haze stays more stable, just slow rotate
            haze.rotation.z += 0.0005;

            renderer.render(scene, camera);
        };

        animate();

        return () => {
            window.removeEventListener('resize', handleResize); // Clean up

            if (threeRef.current) {
                while (threeRef.current.firstChild) {
                    threeRef.current.removeChild(threeRef.current.firstChild);
                }
            }
        };

    }, []);

    return (
        <div className="section1-main">
            {isMobile ?
                (<div>
                    <div className="three-bg-wrapper">
                        <div ref={threeRef} className="three-bg" />
                    </div>
                    <div className="landing-text">
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            Automate Your Threads Growth
                        </motion.h1>
                        <motion.h3
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1.2 }}
                        >
                            Manage multiple accounts, post with AI, engage automatically, and grow faster
                        </motion.h3>
                        <motion.div className='cta-buttons'
                            initial={{ opacity: 0, y: 60 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1.2 }}>
                            <motion.button
                                className="cta-button ghost"
                                onClick={scrollToSection2}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 1.2 }}>
                                Learn More
                            </motion.button>
                            <motion.button
                                className="cta-button solid"
                                onClick={scrollToSection3}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 1.2 }}>
                                Start Now
                            </motion.button>
                        </motion.div>
                    </div>
                </div>
                ) : (
                    <div>
                        <div className="three-bg-wrapper">
                            <div ref={threeRef} className="three-bg" />
                        </div>
                        <div className="landing-text">
                            <motion.h1
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                Automate Your Threads Growth
                            </motion.h1>
                            <motion.h3
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1.2 }}
                            >
                                Manage multiple accounts, post with AI, engage automatically, and grow faster
                            </motion.h3>
                            <motion.div className='cta-buttons'
                                initial={{ opacity: 0, y: 60 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1.2 }}>
                                <motion.button
                                    className="cta-button ghost"
                                    onClick={scrollToSection2}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 1.2 }}>
                                    Learn More
                                </motion.button>
                                <motion.button
                                    className="cta-button solid"
                                    onClick={scrollToSection3}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 1.2 }}>
                                    Start Now
                                </motion.button>
                            </motion.div>
                        </div>
                    </div>
                )}
        </div>
    )
}

export default Section1;