import './affiliate.css';
import './noAff.css';
import './aff.css';
import AffRewardsGraph from '../../ui/affGraph/affGraph';
import DotGrid from '../../ui/dotGrid/dotgrid';
import AffiliateTitle from './affTitle';
import AffiliateSubtitle from './affSub';
import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Stepper, { Step } from '../../ui/stepper/stepper';
import axios from 'axios';

const Affiliate = ({ user, loggedIn }) => {

    const [isAff, setIsAff] = useState(null);
    const [isLight, setIsLight] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [name, setName] = useState('');
    const [linkAvailable, setLinkAvailable] = useState(true);
    const [linkError, setLinkError] = useState('');
    const debounceRef = useRef();
    const [agreeEmail, setAgreeEmail] = useState(false);
    const [agreeTos, setAgreeTos] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);

    // Handler for final step submit
    const handleAffiliateSignup = async () => {
        if (!user || !user.id) {
            alert("User not found. Please log in.");
            return;
        }
        try {
            const res = await axios.post('http://localhost:3001/affiliate/signup', {
                id: user.id,
                link: name,
                email_report: agreeEmail
            });
            alert(res.data.message || "Successfully joined the affiliate program!");
            setShowModal(false);
            setTimeout(() => {
                window.location.reload();
            }, 300); // Give the modal time to hide before reload
        } catch (err) {
            alert(
                err.response?.data?.error ||
                "Signup to become affiliate failed."
            );
            setShowModal(false);
            setTimeout(() => {
                window.location.reload();
            }, 300);
        }
    };

    // Check link availability
    const checkLink = async (link) => {
        if (!link) {
            setLinkAvailable(true);
            setLinkError('');
            return;
        }
        try {
            const res = await axios.post('http://localhost:3001/affiliate/check-link', { link });
            if (res.data.available) {
                setLinkAvailable(true);
                setLinkError('');
            } else {
                setLinkAvailable(false);
                setLinkError('This link is already taken.');
            }
        } catch (err) {
            setLinkAvailable(false);
            setLinkError('Error checking link.');
        }
    };

    // Debounce link checking
    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        if (!name) {
            setLinkAvailable(true);
            setLinkError('');
            return;
        }
        debounceRef.current = setTimeout(() => {
            checkLink(name);
        }, 500);
        return () => clearTimeout(debounceRef.current);
    }, [name]);

    useEffect(() => {
        if (loggedIn && user && typeof user.isAff !== "undefined") {
            if (user.isAff === 0) {
                setIsAff(false);
            } else {
                setIsAff(true);
            }
        } else {
            setIsAff(false);
        }
    }, [user, loggedIn])

    const title = !isAff
        ? "Become an Affiliate"
        : `Welcome Back, ${user && user.username ? user.username : "Affiliate"}!`;

    const subtitle = !isAff
        ? "Earn up to 50% commission from each sale and recurring sales!"
        : "Monitor your commissions and performance here.";

    useEffect(() => {
        const mq = window.matchMedia('(prefers-color-scheme: light)');
        setIsLight(mq.matches);

        const handler = (e) => setIsLight(e.matches);
        mq.addEventListener('change', handler);

        return () => mq.removeEventListener('change', handler);
    }, []);

    return (
        <div className="affiliate-main">
            <div className="affiliate-content-wrapper">
                <div className="affiliate-section1-2-bg">
                    <DotGrid
                        dotSize={4}
                        gap={15}
                        baseColor={isLight ? "#c2b2de" : "#271E37"}
                        activeColor={isLight ? "#883cf3" : "#883cf3"}
                        proximity={200}
                        shockRadius={250}
                        shockStrength={5}
                        resistance={750}
                        returnDuration={1.5}
                    />
                </div>
                {/* Only render after isAff is determined */}
                {isAff !== null && (
                    <div className="affiliate-section1">
                        <AffiliateTitle isAff={isAff} text={title} />
                        <AffiliateSubtitle isAff={isAff} text={subtitle} />
                    </div>
                )}
                {isAff !== null && (
                    <motion.div className="affiliate-section2"
                        initial={{ opacity: 0, y: 200 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 200 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                        <div className="affiliate-section2-decoration">
                            <div className="deco-dot first" />
                            <div className="deco-dot second" />
                            <div className="deco-dot third" />
                        </div>
                        {!isAff ? (
                            <div className="NO-affiliate-section2-content">
                                <div className='NO-affiliate-section2-content1'>
                                    <motion.div className='NO-affiliate-section2-content1-left'
                                        initial={{ opacity: 0, y: 300 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.7, ease: "easeOut" }}
                                    >
                                        <h1>Turn Conversations into Conversions</h1>
                                        <h3>Become an Affiliate Today</h3>
                                        <button
                                            onClick={() => setShowModal(true)}
                                            className='affiliate-hero-cta-button'
                                        >JOIN NOW</button>
                                    </motion.div>
                                    <motion.div className='NO-affiliate-section2-content1-right'
                                        initial={{ opacity: 0, y: 300 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.7, ease: "easeOut" }}
                                    >
                                        <img
                                            src={isLight ? './assets/images/cone.png' : './assets/images/cone.avif'}
                                            className={isLight ? 'NO-affiliate-cone-light' : 'NO-affiliate-cone-dark'}
                                        />
                                    </motion.div>
                                </div>
                                <div className="NO-affiliate-section2-content2">
                                    <div className="NO-affiliate-section2-content2-left">
                                        <AffRewardsGraph />
                                    </div>
                                    <div className="NO-affiliate-section2-content2-right">
                                        <h1>
                                            Earn more than just money.
                                        </h1>
                                        <h3>Top performing affiliates earn exclusive rewards. Each month.</h3>
                                    </div>
                                </div>
                                <div className="NO-affiliate-section2-content3">
                                    <div className="affiliate-cta-card">
                                        <h2>Ready to Start Earning?</h2>
                                        <p className="affiliate-cta-desc">
                                            Don’t miss your chance to be part of our growing affiliate community. Whether you’re a creator, influencer, or just passionate about sharing great products, Threadly’s affiliate program is your gateway to recurring income and exclusive rewards.
                                        </p>
                                        <ul className="affiliate-cta-list">
                                            <li>Earn up to <strong>50% commission</strong> on every sale</li>
                                            <li>Monthly bonuses for top affiliates</li>
                                            <li>Real-time tracking and easy payouts</li>
                                            <li>Free to join — no hidden fees</li>
                                        </ul>
                                        <button
                                            className="affiliate-hero-cta-button"
                                            onClick={() => setShowModal(true)}
                                        >
                                            JOIN NOW
                                        </button>
                                        <p className="affiliate-cta-note">
                                            Take the first step today. Early members get access to special launch rewards!
                                        </p>
                                    </div>
                                </div>
                            </div>

                        ) : (
                            <div className="affiliate-section2-content">
                                AFFILIATE
                            </div>
                        )}
                    </motion.div>
                )}                {showModal && (
                    <div className="stepper-wrapper">
                        <Stepper
                            initialStep={1}
                            onStepChange={setCurrentStep}
                            onFinalStepCompleted={handleAffiliateSignup}
                            backButtonText="Previous"
                            nextButtonText="Next"
                            nextButtonProps={{
                                disabled:
                                    (currentStep === 2 && name && !linkAvailable) ||
                                    (currentStep === 4 && !agreeTos)
                            }}
                        >
                            <Step>
                                <h2 className="step-title">Welcome to the Threadly Affiliate program!</h2>
                                <p className="step-desc">Follow these steps to join.</p>
                            </Step>
                            <Step>
                                <h2 className="step-title">Create a custom link</h2>
                                <input
                                    className="step-input"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Your custom link"
                                />
                                <p className="step-desc">or leave empty to get a random one</p>
                                {!linkAvailable && (
                                    <div className="step-error">{linkError}</div>
                                )}
                            </Step>
                            <Step>
                                <h2 className="step-title">Email Reports</h2>
                                <label className="step-checkbox-label">
                                    <input
                                        type="checkbox"
                                        className="step-checkbox"
                                        checked={agreeEmail}
                                        onChange={e => setAgreeEmail(e.target.checked)}
                                    />
                                    I agree to receive reports via email.
                                </label>
                            </Step>
                            <Step>
                                <h2 className="step-title">Affiliate Terms of Service</h2>
                                <label className="step-checkbox-label">
                                    <input
                                        type="checkbox"
                                        className="step-checkbox"
                                        checked={agreeTos}
                                        onChange={e => setAgreeTos(e.target.checked)}
                                    />
                                    I agree to the <a className='affiliate-tos-link' href="/affiliate-terms" target="_blank" rel="noopener noreferrer">Affiliate Terms of Service</a>
                                </label>
                            </Step>
                            <Step>
                                <h2 className="step-title">Final Step</h2>
                                <p className="step-desc">You're all set! Click "Complete" to finish your application.</p>
                            </Step>
                        </Stepper>
                    </div>
                )}
            </div>
        </div >
    )
}

export default Affiliate;