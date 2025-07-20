import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import './payment.css';

const Payment = () => {
  const [devices, setDevices] = useState(1);
  const basePrice = 97;
  const additionalDevicePrice = 10;
  const totalPrice = basePrice + (devices - 1) * additionalDevicePrice;

  const handleIncrement = () => setDevices((prev) => prev + 1);
  const handleDecrement = () => setDevices((prev) => (prev > 1 ? prev - 1 : 1));

  const bgRef = useRef(null);

  useEffect(() => {
    const squaresInRow = 25;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#121212');

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 50);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    bgRef.current?.appendChild(renderer.domElement);

    const gradientTopColor = new THREE.Color(0x232323); // Pink
    const gradientBottomColor = new THREE.Color(0x232323); // Purple

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

      const visibleHeight =
        2 * Math.tan((camera.fov * Math.PI) / 360) * camera.position.z;
      const visibleWidth = visibleHeight * camera.aspect;

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
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      drawGrid();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (bgRef.current && renderer.domElement.parentNode) {
        bgRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="payment-main">
      <div className="geometric-bg" ref={bgRef}>
        <motion.div
          className="gradient-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, ease: 'easeOut' }}
        />
      </div>
      <div className="cards-container">
        <motion.div
          className="main-card"
          initial={{ y: 2000, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <h2>Most Popular Plan</h2>
          <p className="price">${totalPrice}</p>
          <div className="device-selector">
            <button onClick={handleDecrement}>-</button>
            <span>
              {devices} Device{devices > 1 ? 's' : ''}
            </span>
            <button onClick={handleIncrement}>+</button>
          </div>
          <p className="note">
            Base price: $97 for 1 device
            <br />
            +$10 per extra device
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Payment;
