import { useEffect, useState, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import axios from 'axios';
import Balatro from '../../ui/balatro/balatro.js';
import { IconUserSquareRounded, IconEye, IconEyeOff } from '@tabler/icons-react';
import './profile.css'
import './profileUser.css';

const Profile = ({ user }) => {

    //VAR - username editing
    const [isEditingUsername, setIsEditingUsername] = useState(false);
    const [username, setUsername] = useState(user ? user.username : "Example");

    //VAR - button width
    const [buttonWidth, setButtonWidth] = useState(150);
    const divRef = useRef(null);

    //VAR - image width
    const imgDivRef = useRef(null);
    const imgWidth = imgDivRef.current ? imgDivRef.current.offsetHeight : 50;

    //VAR - email editing
    const [isEditingEmail, setIsEditingEmail] = useState(false);
    const [email, setEmail] = useState(user ? user.email : "example@example.com");
    const [showEmailChangeModal, setShowEmailChangeModal] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const [emailChangeError, setEmailChangeError] = useState('');

    // VAR - change password
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [passwordChangeError, setPasswordChangeError] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    //VAR - delete account
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteInput, setDeleteInput] = useState('');
    const [deleteError, setDeleteError] = useState('');

    //VAR - misc
    const [isLight, setIsLight] = useState(false);
    const controls = useAnimation();

    //FUN - delete account
    const handleDeleteAccount = () => {
        setShowDeleteModal(true);
        setDeleteInput('');
        setDeleteError('');
    };

    //FUN - confirm delete account
    const handleConfirmDelete = async () => {
        if (deleteInput === (user?.email || '')) {
            try {
                // send DELETE with body using axios (axios.delete accepts `data` in config)
                await axios.delete('http://localhost:3001/profile/delete-account', {
                    data: { id: user.id }
                });
                // close modal on success (optionally show a toast or redirect)
                setShowDeleteModal(false);
            } catch (error) {
                console.error(error);
                setDeleteError('Failed to delete account. Please try again.');
            }
        } else {
            setDeleteError('Email does not match. Please try again.');
        }
    };

    //FUN - change username
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

    //FUN - change email
    const handleEmailEdit = async () => {
        if (isEditingEmail) {
            setShowEmailChangeModal(true);
            setVerificationCode('');
            setEmailChangeError('');

            try {
                // Request verification to new email (server will send the verification code)
                const response = await axios.put('http://localhost:3001/profile/edit-email', {
                    id: user.id,
                    newEmail: email
                });
                // log response in console
                console.log('Email change requested:', response.data);
            } catch (error) {
                console.error(error);
                setEmailChangeError('Failed to request email change. Please try again.');
            }
        } else {
            setIsEditingEmail(true);
        }
    };

    //FUN - verify email change
    const handleEmailVerification = async () => {
        try {
            const response = await axios.post('http://localhost:3001/profile/confirm-email-change', {
                id: user.id,
                newEmail: email,
                verification_code: verificationCode
            });
            console.log('Email change confirmed:', response.data);
            setShowEmailChangeModal(false);
            setIsEditingEmail(false);
        } catch (error) {
            console.error(error);
            setEmailChangeError(error?.response?.data?.error || 'Failed to verify email. Please try again.');
        }
    };

    //FUN - validate password strength
    const validatePasswordStrength = (password) => {
        const strongPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        return strongPattern.test(password);
    };

    // FUN - change password
    const handleChangePassword = async () => {
        setPasswordChangeError('');
        if (!currentPassword || !newPassword || !confirmNewPassword) {
            setPasswordChangeError('Current and new passwords are required.');
            return;
        }
        if (newPassword !== confirmNewPassword) {
            setPasswordChangeError('New passwords do not match.');
            return;
        }
        if (!validatePasswordStrength(newPassword)) {
            setPasswordChangeError('New password must be 8+ chars, include upper & lower case, number and symbol.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3001/profile/change-password', {
                currentPassword,
                newPassword
            }, { withCredentials: true });
            console.log('Password changed:', response.data);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
            setIsChangingPassword(false);
            setTimeout(() => window.location.reload(), 600);
        } catch (error) {
            console.error(error);
            setPasswordChangeError(error?.response?.data?.error || 'Failed to change password. Please try again.');
        }
    };

    //FUN - dynamic button width
    useEffect(() => {
        if (divRef.current) {
            setButtonWidth(divRef.current.offsetWidth);
        }
    }, [divRef]);

    //FUN - animation controls for cubes
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

    //FUN - get light/dark mode
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
                {/* Profile Visible Content */}
                <div className="profile-content-container">
                    <div className="affiliate-section2-decoration">
                        <div className="deco-dot first" />
                        <div className="deco-dot second" />
                        <div className="deco-dot third" />
                    </div>
                    <div className="profile-content">
                        {/* MAIN PROFILE CONTAINER */}
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
                                            <h1>{username}</h1>
                                            <h3>{email}</h3>
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
                                                    defaultValue={email}
                                                    onChange={e => setEmail(e.target.value)}
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
                                            <button
                                                className='profile-btn-big'
                                                style={{ width: `${buttonWidth}px` }}
                                                onClick={() => { setIsChangingPassword(true); }}
                                            >
                                                Change Password
                                            </button>
                                            <button
                                                className='profile-btn-big accent'
                                                style={{ width: `${buttonWidth}px` }}
                                                onClick={handleDeleteAccount}
                                            >Delete Account</button>
                                        </div>
                                        <div className="user-profile-star" ref={imgDivRef}>
                                            <motion.div className="user-profile-star-image"
                                                animate={{
                                                    y: [0, -5, 0],
                                                }}
                                                transition={{
                                                    duration: 3,
                                                    repeat: Infinity,
                                                    repeatType: "loop",
                                                    ease: "easeInOut"
                                                }}
                                            >
                                                <img src="./assets/images/star.avif" alt="star" style={{ width: `${imgWidth}px` }} />
                                            </motion.div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                        {/* ANIMATED CUBES CONTAINER */}
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

                {/* Password Change Modal */}
                {isChangingPassword && (
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
                            maxWidth: '320px',
                            boxShadow: '0 4px 32px rgba(0,0,0,0.4)',
                            color: '#fff',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                        }}>
                            <h2>Change Password</h2>
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={e => setCurrentPassword(e.target.value)}
                                placeholder="Current password"
                                style={{
                                    margin: '0.5rem 0',
                                    textIndent: '0.5rem',
                                    marginTop: '1rem',
                                    padding: '0.5rem 0',
                                    borderRadius: '7px',
                                    border: 'transparent',
                                    width: '100%'
                                }}
                            />
                            <div
                                style={{
                                    width: '100%',
                                    height: '3px',
                                    background: '#2e2e2eff',
                                    margin: '0.2rem 0',
                                    borderRadius: '500px'
                                }}
                            />
                            <input
                                type="password"
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                                placeholder="New password (min 8 chars)"
                                style={{
                                    margin: '0.5rem 0',
                                    textIndent: '0.5rem',
                                    padding: '0.5rem 0',
                                    borderRadius: '7px',
                                    border: 'transparent',
                                    width: '100%'
                                }}
                            />
                            <input
                                type="password"
                                value={confirmNewPassword}
                                onChange={e => setConfirmNewPassword(e.target.value)}
                                placeholder="Confirm new password"
                                style={{
                                    margin: '0.5rem 0',
                                    marginBottom: '1rem',
                                    textIndent: '0.5rem',
                                    padding: '0.5rem 0',
                                    borderRadius: '7px',
                                    border: 'transparent',
                                    width: '100%'
                                }}
                            />
                            {passwordChangeError && (
                                <div style={{ color: '#ff4d4f', marginBottom: '1rem' }}>{passwordChangeError}</div>
                            )}
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button
                                    className="profile-btn accent"
                                    onClick={handleChangePassword}
                                >
                                    Change
                                </button>
                                <button
                                    className="profile-btn"
                                    onClick={() => {
                                        setIsChangingPassword(false);
                                        setPasswordChangeError('');
                                        setCurrentPassword('');
                                        setNewPassword('');
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Email Verification Modal */}
                {showEmailChangeModal && (
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
                            <h2>Change Email</h2>
                            <p>
                                To confirm email change, type the verification code sent to:<br />
                                <b>{email}</b>
                            </p>
                            <input
                                type="text"
                                value={verificationCode}
                                onChange={e => setVerificationCode(e.target.value)}
                                placeholder="Enter verification code"
                                style={{
                                    margin: '1rem 0',
                                    padding: '0.5rem',
                                    borderRadius: '5px',
                                    border: '1px solid #883cf3',
                                    width: '100%'
                                }}
                            />
                            {emailChangeError && (
                                <div style={{ color: '#ff4d4f', marginBottom: '1rem' }}>{emailChangeError}</div>
                            )}
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button
                                    className="profile-btn accent"
                                    onClick={handleEmailVerification}
                                >
                                    Verify
                                </button>
                                <button
                                    className="profile-btn"
                                    onClick={() => setShowEmailChangeModal(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

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