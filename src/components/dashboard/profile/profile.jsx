import { useEffect, useState, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import axios from 'axios';
import Balatro from '../../ui/balatro/balatro.js';
import { IconUserSquareRounded } from '@tabler/icons-react';
import './profile.css'
import './profileUser.css';

const Profile = ({ user }) => {

    const [isLight, setIsLight] = useState(false);
    const [isEditingUsername, setIsEditingUsername] = useState(false);
    const [username, setUsername] = useState(user ? user.username : "Example");
    const [isEditingEmail, setIsEditingEmail] = useState(false);
    const controls = useAnimation();

    const [buttonWidth, setButtonWidth] = useState(150);
    const divRef = useRef(null);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteInput, setDeleteInput] = useState('');
    const [deleteError, setDeleteError] = useState('');

    const handleDeleteAccount = () => {
        setShowDeleteModal(true);
        setDeleteInput('');
        setDeleteError('');
    };

    const handleConfirmDelete = () => {
        if (deleteInput === (user?.email || '')) {
            // Here you would send a request to the backend
            console.log('Account deletion request sent for:', user.email);
            setShowDeleteModal(false);
        } else {
            setDeleteError('Email does not match. Please try again.');
        }
    };

    const handleUsernameEdit = async () => {
        if (isEditingUsername) {
            try {
                await axios.put('http://localhost:3001/profile/edit-username', {
                    id: user.id,
                    newUsername: username
                });
                // Optionally show a success message or update parent state
            } catch (error) {
                // Optionally show an error message
                console.error(error);
            }
        }
        setIsEditingUsername(!isEditingUsername);
    };

    const handleEmailEdit = () => {
        if (isEditingEmail) {
            // Call your save email endpoint here
            // e.g., saveEmail();
        }
        setIsEditingEmail(!isEditingEmail);
    };

    //dynamic button width
    useEffect(() => {
        if (divRef.current) {
            setButtonWidth(divRef.current.offsetWidth);
        }
    }, [divRef]);

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
                                                    value={username}
                                                    onChange={e => setUsername(e.target.value)}
                                                    disabled={!isEditingUsername}
                                                />
                                                <button
                                                    className="profile-btn"
                                                    onClick={handleUsernameEdit}
                                                >
                                                    {isEditingUsername ? "Save" : "Change"}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="user-profile-form-group">
                                            <label htmlFor="email">Email</label>
                                            <div className="user-input-button" ref={divRef}>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    defaultValue={user ? user.email : "example@example.com"}
                                                    disabled={!isEditingEmail}
                                                />
                                                <button
                                                    className="profile-btn"
                                                    onClick={handleEmailEdit}
                                                >
                                                    {isEditingEmail ? "Save" : "Change"}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="user-profile-buttons">
                                            <button className='profile-btn-big' style={{ width: `${buttonWidth}px` }}>Change Password</button>
                                            <button
                                                className='profile-btn-big accent'
                                                style={{ width: `${buttonWidth}px` }}
                                                onClick={handleDeleteAccount}
                                            >Delete Account</button>
                                        </div>
                                        <div className="user-profile-star">
                                            <motion.img src="./assets/images/star.avif" alt="star"
                                                animate={{
                                                    y: [0, -5, 0],
                                                }}
                                                transition={{
                                                    duration: 3,
                                                    repeat: Infinity,
                                                    repeatType: "loop",
                                                    ease: "easeInOut"
                                                }}
                                            />
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

                {/* Delete Account Modal */}
                {showDeleteModal && (
                    <div className="modal-overlay" style={{
                        position: 'fixed',
                        top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000
                    }}>
                        <div className="modal-content" style={{
                            background: '#232323',
                            padding: '2rem',
                            borderRadius: '10px',
                            minWidth: '320px',
                            boxShadow: '0 4px 32px rgba(0,0,0,0.4)',
                            color: '#fff',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                        }}>
                            <h2>Delete Account</h2>
                            <p>
                                To confirm deletion, type your email address:<br />
                                <b>{user?.email}</b>
                            </p>
                            <input
                                type="email"
                                value={deleteInput}
                                onChange={e => setDeleteInput(e.target.value)}
                                placeholder="Enter your email"
                                style={{
                                    margin: '1rem 0',
                                    padding: '0.5rem',
                                    borderRadius: '5px',
                                    border: '1px solid #883cf3',
                                    width: '100%'
                                }}
                            />
                            {deleteError && (
                                <div style={{ color: '#ff4d4f', marginBottom: '1rem' }}>{deleteError}</div>
                            )}
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button
                                    className="profile-btn accent"
                                    onClick={handleConfirmDelete}
                                >
                                    Confirm
                                </button>
                                <button
                                    className="profile-btn"
                                    onClick={() => setShowDeleteModal(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Profile;