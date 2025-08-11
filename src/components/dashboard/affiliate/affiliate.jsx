import './affiliate.css'
import DotGrid from '../../ui/dotGrid/dotgrid';
import AffiliateTitle from './affTitle';
import AffiliateSubtitle from './affSub';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bar } from 'react-chartjs-2';
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

const Affiliate = () => {

    const [isAff, setIsAff] = useState(false);
    const [hasAnimated, setHasAnimated] = useState(false);
    const [hasAnimated2, setHasAnimated2] = useState(false);
    const [isLight, setIsLight] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const title = !isAff
        ? "Become an Affiliate"
        : "Welcome Back, {username}!";

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
                        activeColor={isLight ? "#ac79f5" : "#883cf3"}
                        proximity={200}
                        shockRadius={250}
                        shockStrength={5}
                        resistance={750}
                        returnDuration={1.5}
                    />
                </div>
                <div className="affiliate-section1">
                    <AffiliateTitle isAff={isAff} text={title} />
                    <AffiliateSubtitle isAff={isAff} text={subtitle} />
                </div>
                <motion.div className="affiliate-section2"
                    initial={{ opacity: 0, y: 400 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 400 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >

                    {!isAff ? (
                        <div className="NO-affiliate-section2-content">
                            NO AFFILIATE
                        </div>
                    ) : (
                        <div className="affiliate-section2-content">
                            AFFILIATE
                        </div>
                    )}

                </motion.div>
            </div>
        </div>
    )
}

export default Affiliate;