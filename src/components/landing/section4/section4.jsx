import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import './section4.css';

const Section4 = ({ isSection4, isMobile }) => {

    if (!isSection4) return null;

    const [devices, setDevices] = useState(1);
    const basePrice = 97;
    const additionalDevicePrice = 10;
    const totalPrice = basePrice + (devices - 1) * additionalDevicePrice;
    const [bundleOffsetX, setBundleOffsetX] = useState(0);
    const [showSignupModal, setShowSignupModal] = useState(false);

    const handleIncrement = () => setDevices((prev) => prev + 1);
    const handleDecrement = () => setDevices((prev) => (prev > 1 ? prev - 1 : 1));

    const bgRef = useRef(null);

    //CALCULATE X POSITION FOR BUNDLE ANIMATION DISTANCE
    useEffect(() => {
        const calcOffset = () => {
            const screenWidth = window.innerWidth;
            const offset = screenWidth * 0.12;
            setBundleOffsetX(offset);
        };

        calcOffset();
        window.addEventListener('resize', calcOffset);
        return () => window.removeEventListener('resize', calcOffset);
    }, []);

    //GRID BG
    useEffect(() => {
        let squaresInRow;
        if (isMobile) {
            squaresInRow = 10;
        } else {
            squaresInRow = 25;
        }

        const scene = new THREE.Scene();
        scene.background = new THREE.Color('#121212');

        // Create orthographic camera
        const width = window.innerWidth;
        const height = window.innerHeight;
        const camera = new THREE.OrthographicCamera(
            width / -2,   // left
            width / 2,    // right
            height / 2,   // top
            height / -2,  // bottom
            0.1,
            1000
        );
        camera.position.z = 50;

        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.domElement.classList.add('bg-canvas');
        bgRef.current?.appendChild(renderer.domElement);

        const gradientTopColor = new THREE.Color(0x232323);
        const gradientBottomColor = new THREE.Color(0x232323);

        let linesGroup = null;

        const animateLine = (line, axis = 'x', delay = 0, endCoord) => {
            let progress = 0;
            const grow = () => {
                progress = Math.min(progress + 0.03, 1);
                const attr = line.geometry.attributes.position;

                if (axis === 'x') {
                    const startX = attr.getX(0);
                    attr.setX(1, startX + progress * (endCoord - startX));
                    attr.setY(1, attr.getY(0));
                } else {
                    const startY = attr.getY(0);
                    attr.setY(1, startY + progress * (endCoord - startY));
                    attr.setX(1, attr.getX(0));
                }

                attr.needsUpdate = true;

                if (progress < 1) {
                    requestAnimationFrame(grow);
                }
            };

            setTimeout(grow, delay);
        };

        const drawGrid = () => {
            if (linesGroup) {
                scene.remove(linesGroup);
            }

            linesGroup = new THREE.Group();
            linesGroup.name = 'customGrid';
            scene.add(linesGroup);

            // Use window dimensions directly
            const visibleWidth = window.innerWidth;
            const visibleHeight = window.innerHeight;

            const squareSize = visibleWidth / squaresInRow;
            const rows = Math.ceil(visibleHeight / squareSize) + 1;

            const startX = -visibleWidth / 2;
            const startY = -visibleHeight / 2;

            // Vertical lines
            for (let i = 0; i <= squaresInRow; i++) {
                const x = startX + i * squareSize;
                const delay = i * 50;

                const positions = new Float32Array(6);
                positions[0] = x;
                positions[1] = startY;
                positions[2] = 0;

                positions[3] = x;
                positions[4] = startY;
                positions[5] = 0; // Initially collapsed

                const geometry = new THREE.BufferGeometry();
                geometry.setAttribute(
                    'position',
                    new THREE.BufferAttribute(positions, 3)
                );

                const colorFactor = (x - startX) / visibleWidth;
                const color = gradientBottomColor
                    .clone()
                    .lerp(gradientTopColor, 1 - colorFactor);

                const material = new THREE.LineBasicMaterial({ color });

                const line = new THREE.Line(geometry, material);
                linesGroup.add(line);

                const endY = startY + rows * squareSize;
                animateLine(line, 'y', delay, endY);
            }

            // Horizontal lines
            for (let j = 0; j <= rows; j++) {
                const y = startY + j * squareSize;
                const delay = j * 50;

                const positions = new Float32Array(6);
                positions[0] = startX;
                positions[1] = y;
                positions[2] = 0;

                positions[3] = startX;
                positions[4] = y;
                positions[5] = 0; // Initially collapsed

                const geometry = new THREE.BufferGeometry();
                geometry.setAttribute(
                    'position',
                    new THREE.BufferAttribute(positions, 3)
                );

                const colorFactor = (y - startY) / visibleHeight;
                const color = gradientBottomColor
                    .clone()
                    .lerp(gradientTopColor, 1 - colorFactor);

                const material = new THREE.LineBasicMaterial({ color });

                const line = new THREE.Line(geometry, material);
                linesGroup.add(line);

                const endX = startX + squaresInRow * squareSize;
                animateLine(line, 'x', delay, endX);
            }
        };

        drawGrid();

        const animate = () => {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        };

        animate();

        const handleResize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;

            // Update camera
            camera.left = -width / 2;
            camera.right = width / 2;
            camera.top = height / 2;
            camera.bottom = -height / 2;
            camera.updateProjectionMatrix();

            // Update renderer
            renderer.setSize(width, height);
            renderer.setPixelRatio(window.devicePixelRatio);

            // Redraw grid
            drawGrid();
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (bgRef.current && renderer.domElement.parentNode === bgRef.current) {
                bgRef.current.removeChild(renderer.domElement);
            }
        };
    }, [isMobile, isSection4]);

    const handleBuyNowClick = () => {
        location.href = '/checkout?devices=' + devices;
    }

    return (
        <div className="payment-main">
            <div className="geometric-bg" ref={bgRef} />
            <div className="gradient-overlay" />
            {isMobile ? (
                <div className="cards-container-mobile">
                    <motion.div
                        className="main-card"
                        initial={{ y: 2000, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                    >
                        <h2 className="card-title">Build Your Plan</h2>
                        <p className="price">${totalPrice}</p>

                        <div className="card-section">
                            <h3 className="section-title">What's Included</h3>
                            <ul className="feature-list">
                                <li>Automated posting & engagement</li>
                                <li>AI-generated captions</li>
                                <li>Advanced strategy tools</li>
                                <li>Multi-account & proxy support</li>
                            </ul>
                        </div>

                        <div className="card-section">
                            <h3 className="section-title">Benefits</h3>
                            <ul className="feature-list">
                                <li>Boost your reach with automation</li>
                                <li>Save hours every week</li>
                                <li>Scale across multiple devices</li>
                                <li>Flexible and easy to use</li>
                            </ul>
                        </div>

                        <div className="device-selector">
                            <button className="device-btn" onClick={handleDecrement}>-</button>
                            <span className="device-count">
                                {devices} Device{devices > 1 ? 's' : ''}
                            </span>
                            <button className="device-btn" onClick={handleIncrement}>+</button>
                        </div>

                        <p className="note">
                            <strong>+$10</strong> per extra device
                        </p>
                        <button className="buy-now-btn">Buy Now</button>
                    </motion.div>
                    <p>MOBILE BUNDLES SECTION</p>
                </div>
            ) : (
                <div className="cards-container-desktop">
                    <motion.div
                        className="bundle-left"
                        initial={{ y: 2000, opacity: 0, x: 0 }}
                        animate={{
                            y: 0,
                            opacity: 1,
                            x: -bundleOffsetX // ✅ dynamic!
                        }}
                        transition={{
                            y: { duration: 0.8, ease: 'easeOut' },
                            opacity: { duration: 0.8, ease: 'easeOut' },
                            x: { duration: 0.5, ease: 'easeOut', delay: 0.3 }
                        }}
                    >
                        <h2 className="card-title">Bundle: 10 Devices</h2>
                        <p className="price">$149</p>
                        <button className="buy-now-btn">Buy Bundle</button>
                    </motion.div>

                    <motion.div
                        className="main-card"
                        initial={{ y: 2000, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                    >
                        <h2 className="card-title">Build Your Plan</h2>
                        <p className="price">${totalPrice}</p>

                        <div className="card-section">
                            <h3 className="section-title">What's Included</h3>
                            <ul className="feature-list">
                                <li>Automated posting & engagement</li>
                                <li>AI-generated captions</li>
                                <li>Advanced strategy tools</li>
                                <li>Multi-account & proxy support</li>
                            </ul>
                        </div>

                        <div className="card-section">
                            <h3 className="section-title">Benefits</h3>
                            <ul className="feature-list">
                                <li>Boost your reach with automation</li>
                                <li>Save hours every week</li>
                                <li>Scale across multiple devices</li>
                                <li>Flexible and easy to use</li>
                            </ul>
                        </div>

                        <div className="device-selector">
                            <button className="device-btn" onClick={handleDecrement}>-</button>
                            <span className="device-count">
                                {devices} Device{devices > 1 ? 's' : ''}
                            </span>
                            <button className="device-btn" onClick={handleIncrement}>+</button>
                        </div>

                        <p className="note">
                            <strong>+$10</strong> per extra device
                        </p>
                        <button className="buy-now-btn"
                            onClick={handleBuyNowClick}
                        >Buy Now</button>
                    </motion.div>

                    <motion.div
                        className="bundle-right"
                        initial={{ y: 2000, opacity: 0, x: 0 }}
                        animate={{
                            y: 0,
                            opacity: 1,
                            x: bundleOffsetX // ✅ dynamic!
                        }}
                        transition={{
                            y: { duration: 0.8, ease: 'easeOut' },
                            opacity: { duration: 0.8, ease: 'easeOut' },
                            x: { duration: 0.5, ease: 'easeOut', delay: 0.3 }
                        }}
                    >
                        <h2 className="card-title">Bundle: 20 Devices</h2>
                        <p className="price">$219</p>
                        <button className="buy-now-btn">Buy Bundle</button>
                    </motion.div>
                </div>
            )}
        </div>

    );
};

export default Section4;
