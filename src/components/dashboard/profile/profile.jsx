import { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import Balatro from '../../ui/balatro/balatro.js';
import { IconUserSquareRounded } from '@tabler/icons-react';
import './profile.css'
import './profileUser.css';

const Profile = ({ user }) => {

    const [isLight, setIsLight] = useState(false);
    const controls = useAnimation();

    //animations for cubes
    useEffect(() => {
        async function sequence() {
            // Fly-in animation
            await controls.start({
                y: 0,
                opacity: 1,
                transition: { duration: 0.7, ease: "easeOut" }
            });
            // Infinite up-down animation
            controls.start({
                y: [0, -15, 0],
                transition: {
                    duration: 4,
                    repeat: Infinity,
                    repeatType: "loop",
                    ease: "easeInOut"
                }
            });
        }
        // Start with off-screen right and invisible
        controls.set({ y: 500, opacity: 0 });
        sequence();
    }, [controls]);

    //get light/dark mode
    useEffect(() => {
        const mq = window.matchMedia('(prefers-color-scheme: light)');
        setIsLight(mq.matches);

        const handler = (e) => setIsLight(e.matches);
        mq.addEventListener('change', handler);

        return () => mq.removeEventListener('change', handler);
    }, []);

    return (
        <div className="profile-main">
            <div className="profile-bg">
                <Balatro
                    isRotate={false}
                    mouseInteraction={false}
                    pixelFilter={20000}
                    color1={`${isLight ? '#ffffff' : '#121212'}`}
                    color2='#883cf3'
                    color3={`${isLight ? '#1b0a30ff' : ''}`}
                />
            </div>
            <div className="profile-content-wrapper">
                <div className="profile-content-container">
                    <div className="affiliate-section2-decoration">
                        <div className="deco-dot first" />
                        <div className="deco-dot second" />
                        <div className="deco-dot third" />
                    </div>
                    <div className="profile-content">
                        <div className="profile-content-left">
                            <div className="profile-content-left-container">
                                <motion.div
                                    className="profile-setting-main"
                                    initial={{ opacity: 0, y: -500, scale: 0.8 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{ duration: 0.7, ease: "easeOut" }}
                                >
                                    <div className="profile-setting-main-bg" />
                                    <div className="user-profile-header">
                                        <IconUserSquareRounded className='user-pfp' />
                                        <div className="user-details">
                                            <h1>{user ? user.username : "Example"}</h1>
                                            <h3>{user ? user.email : "example@example.com"}</h3>
                                        </div>
                                    </div>
                                    <div className="user-profile-form">
                                        <div className="user-profile-form-group">
                                            <label htmlFor="username">Username</label>
                                            <div className="user-input-button">
                                                <input
                                                    type="text"
                                                    id="username"
                                                    name="username"
                                                    defaultValue={user ? user.username : "Example"}
                                                />
                                                <button className="profile-btn accent">Change</button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                        <motion.div
                            className="profile-content-right"
                            animate={controls}
                        >
                            <img className='profile-content-right-image' src='./assets/images/cubes.avif' alt='cubes' />
                            <img className='profile-content-image-floating first' src='./assets/images/cube.avif' alt='cube' />
                            <img className='profile-content-image-floating second' src='./assets/images/cube.avif' alt='cube' />
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile;