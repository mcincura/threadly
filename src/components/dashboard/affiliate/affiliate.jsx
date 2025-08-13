import './affiliate.css'
import DotGrid from '../../ui/dotGrid/dotgrid';
import AffiliateTitle from './affTitle';
import AffiliateSubtitle from './affSub';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bar } from 'react-chartjs-2';
import Stepper, { Step } from '../../ui/stepper/stepper';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const Affiliate = ({ user, loggedIn }) => {

    const [isAff, setIsAff] = useState(null);
    const [hasAnimated, setHasAnimated] = useState(false);
    const [hasAnimated2, setHasAnimated2] = useState(false);
    const [isLight, setIsLight] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (loggedIn) {
            if (user.isAff === 0) {
                setIsAff(false);
            } else {
                setIsAff(true);
            }
        }
    }, [user, loggedIn])

    const title = !isAff
        ? "Become an Affiliate"
        : `Welcome Back, ${user.username}!`;

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
                        initial={{ opacity: 0, y: 400 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 400 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        {!isAff ? (
                            <div className="NO-affiliate-section2-content">
                                <button
                                    onClick={() => setShowModal(true)}
                                >JOIN NOW</button>
                            </div>
                        ) : (
                            <div className="affiliate-section2-content">
                                AFFILIATE
                            </div>
                        )}
                    </motion.div>
                )}
                {showModal && (
                    <div className="stepper-wrapper">
                        <Stepper
                            initialStep={1}
                            onStepChange={(step) => {
                                console.log(step);
                            }}
                            onFinalStepCompleted={() => setShowModal(false)}
                            backButtonText="Previous"
                            nextButtonText="Next"
                        >
                            <Step>
                                <h2>Welcome to the Threadly Affiliate program!</h2>
                                <p>Follow these steps to join.</p>
                            </Step>
                            <Step>
                                <h2>Create a custom link</h2>
                                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your custom link" />
                                <p>or leave empty to get a random one</p>
                            </Step>
                            <Step>
                                <h2>Final Step</h2>
                                <p>You made it!</p>
                            </Step>
                        </Stepper>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Affiliate;