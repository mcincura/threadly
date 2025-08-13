import './dash.css'
import './cards.css'
import { useState, useEffect, useRef } from 'react'
import { IconPlus, IconMinus, IconArrowRight, IconUser, IconBrandX, IconBrandInstagram } from '@tabler/icons-react'
import LightRays from '../../ui/lightRays/LightRays'

const updates = [
    { date: "Aug 6", text: "📊 New analytics dashboard released." },
    { date: "Aug 2", text: "🛡️ Security improvements deployed." },
    { date: "Jul 28", text: "✨ UI enhancements for dashboard." },
    { date: "Jul 26", text: "🛡️ Security improvements deployed." },
    { date: "Jul 24", text: "✨ UI enhancements for dashboard." },
    { date: "Jul 22", text: "✨ UI enhancements for dashboard." },
    { date: "Jul 18", text: "🛡️ Security improvements deployed." },
    { date: "Jul 8", text: "✨ UI enhancements for dashboard." },
    // Add more updates as needed
];

const Dash = ({ setActive, open, user, loggedIn }) => {

    const [usedDevices, setUsedDevices] = useState(9);
    const [allDevices, setAllDevices] = useState(10);
    const progress = (usedDevices / allDevices) * 100;
    const [newDevices, setnewDevices] = useState(0);
    const [invoiceAmount, setInvoiceAmount] = useState(149.99);
    const [isAff, setIsAff] = useState(false);
    const [hasPfp, sethasPfp] = useState(false);
    const [newFeature, setNewFeature] = useState(false);
    const [visibleUpdates, setVisibleUpdates] = useState(2);
    const wrapperRef = useRef(null);
    const itemRef = useRef(null);
    let isOpen = useState(open);
    const [nextMaintenance, setNextMaintenance] = useState({
        date: "Aug 12, 2025",
        time: "02:00 AM UTC",
        duration: "2 hours"
    });

    useEffect(() => {
        if (loggedIn) {
            if (user.isAff === 0) {
                setIsAff(false);
            } else {
                setIsAff(true);
            }
        }
    }, [user, loggedIn])

    useEffect(() => {
        const updateVisibleItems = () => {
            if (wrapperRef.current && itemRef.current) {
                const wrapperHeight = wrapperRef.current.offsetHeight;
                const itemHeight = itemRef.current.offsetHeight + 8;
                console.log('wrapperHeight:', wrapperHeight);
                console.log('itemHeight:', itemHeight);
                if (wrapperHeight === 0) {
                    console.log('wrapperHeight is 0 (possibly not visible)');
                }
                if (itemHeight === 0) {
                    console.log('itemHeight is 0 (possibly not visible)');
                }
                const count = Math.max(1, Math.floor(wrapperHeight / itemHeight));
                console.log('Calculated visibleUpdates count:', count);
                setVisibleUpdates(count);
            }
            console.log('Current visibleUpdates:', visibleUpdates);
        };
        updateVisibleItems();
        window.addEventListener('resize', updateVisibleItems);

        // Delayed recalculation after 50ms
        const timeout = setTimeout(() => {
            console.log('--- Delayed updateVisibleItems called ---');
            updateVisibleItems();
        }, 50);

        return () => {
            window.removeEventListener('resize', updateVisibleItems);
            clearTimeout(timeout);
        };
    }, [isOpen]);

    return (
        <div className="dash-main">
            <div className="dash-content-wrapper">
                <div className="dash-content">
                    <div className="dash-bento-grid">

                        {/* DEVICE USAGE */}
                        <div className="bento-card tall device-usage-card">
                            <div className="device-usage-content">
                                <div className="device-progress-ring">
                                    <div className="progress-ring">
                                        <svg viewBox="0 0 36 36" className="progress-ring-svg">
                                            <path
                                                className="progress-ring-bg"
                                                d="M18 2.0845
                       a 15.9155 15.9155 0 0 1 0 31.831
                       a 15.9155 15.9155 0 0 1 0 -31.831"
                                            />
                                            <path
                                                className="progress-ring-fill"
                                                strokeDasharray={`${progress}, 100`} /* example: 70% usage */
                                                d="M18 2.0845
                       a 15.9155 15.9155 0 0 1 0 31.831
                       a 15.9155 15.9155 0 0 1 0 -31.831"
                                            />
                                        </svg>
                                        <div className="progress-text">
                                            <span className="used-devices">{usedDevices}</span>
                                            <span className="total-devices">/{allDevices}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="device-info">
                                    <h2>Devices in Use</h2>
                                    <p>{usedDevices} of {allDevices} licensed devices are active</p>
                                </div>
                            </div>
                        </div>

                        {/* DEVICE ALLOCATION CARD */}
                        <div className="bento-card device-allocation-card">
                            <h2 className="allocation-title">Devices</h2>
                            <div className="allocation-controls">
                                <button className="allocation-btn" onClick={() => setnewDevices(newDevices - 1)}>
                                    <IconMinus style={{ height: '100%', width: '100%' }} />
                                </button>
                                <span className="device-count">{newDevices}</span>
                                <button className="allocation-btn" onClick={() => setnewDevices(newDevices + 1)}>
                                    <IconPlus style={{ height: '100%', width: '100%' }} />
                                </button>
                            </div>
                            <p className="allocation-note">Upgrade for more devices</p>
                        </div>

                        {/* INVOICE CARD */}
                        <div className="bento-card invoice-card">
                            <h2 className='invoice-title'>Next Invoice</h2>
                            <div className="invoice-amount-wrapper">
                                <div className="invoice-amount">${invoiceAmount}</div>
                                <div className="invoice-due-date">Due: Aug 28, 2025</div>
                            </div>
                            <button className="invoice-pay-btn" onClick={() => setActive('pay')}>
                                Pay Now
                            </button>
                        </div>

                        {/* UPDATE CARD */}
                        <div className="bento-card tall update-card">
                            <h2 className="update-title">Updates</h2>

                            {/* New Feature Hero */}
                            {newFeature ? (<div className="update-hero">
                                <h3>🚀 New Feature!</h3>
                                <p>Introducing smart device allocation for your team.</p>
                                <button className='update-btn'>Learn More</button>
                            </div>) : (<></>)}


                            {/* Updates List */}
                            <div className="update-list">
                                <div className="update-items-wrapper" ref={wrapperRef}>
                                    {updates.slice(0, visibleUpdates).map((update, idx) => (
                                        <div
                                            className="update-item"
                                            key={idx}
                                            ref={idx === 0 ? itemRef : null} // Only the first item gets the ref
                                        >
                                            <span className="update-date">{update.date}</span>
                                            <p>{update.text}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* DEVICE MAP CARD */}
                        <div className="bento-card large device-map-card">
                            <div className="rays-wrapper">
                                <LightRays
                                    raysOrigin="top-center"
                                    raysColor="#883cf3"
                                    raysSpeed={1.5}
                                    lightSpread={2}
                                    rayLength={1}
                                    followMouse={true}
                                    mouseInfluence={0.1}
                                    noiseAmount={0.1}
                                    distortion={0.1}
                                    className="custom-rays"
                                />
                            </div>
                            <div className="hero-content-wrapper">
                                <h1 className="hero-title">Welcome to Threadly</h1>
                                <p className="hero-description">Your one-stop solution for all your Threads automation needs.</p>
                            </div>
                        </div>

                        {/* RESOURCE LINKS CARD */}
                        <div className="bento-card tall resource-links-card">
                            <h2 className="resource-title">Resources & Support</h2>
                            <div className="resource-links">
                                <a
                                    className="resource-link"
                                    href="https://docs.threadly.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Documentation
                                </a>
                                <a
                                    className="resource-link"
                                    href="mailto:support@threadly.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Contact Support
                                </a>
                                <a
                                    className="resource-link"
                                    href="https://community.threadly.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Community Forum
                                </a>
                            </div>
                            <div className="resource-socials">
                                <a
                                    href="https://twitter.com/threadly"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Twitter"
                                    className="resource-social"
                                >
                                    <IconBrandX className="resource-icon" style={{ height: '100%', width: '100%' }} />
                                </a>
                                <a
                                    href="https://instagram.com/threadly"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Instagram"
                                    className="resource-social"
                                >
                                    <IconBrandInstagram className="resource-icon" style={{ height: '100%', width: '100%' }} />
                                </a>
                                {/* Add more social icons as needed */}
                            </div>
                        </div>

                        {/* MAINTENANCE CARD */}
                        <div className="bento-card maintenance-card">
                            <h2 className="maintenance-title">Scheduled Maintenance</h2>
                            {nextMaintenance ? (
                                <div className="maintenance-info-wrapper">
                                    <div className="maintenance-info">
                                        <span className="maintenance-date">
                                            {nextMaintenance.date} at {nextMaintenance.time}
                                        </span>
                                        <span className="maintenance-duration">
                                            Duration: {nextMaintenance.duration}
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <div className="maintenance-none">
                                    <span>No maintenance scheduled</span>
                                </div>
                            )}
                        </div>

                        {/* PROFILE CARD */}
                        <div className="bento-card account-card">
                            <h2 className="account-title">Account Management</h2>
                            <div className="account-content">
                                <div className="account-info">
                                    {hasPfp ? (
                                        <img
                                            src="https://via.placeholder.com/80"
                                            alt="Profile"
                                            className="account-avatar"
                                        />
                                    ) : (
                                        <IconUser className='account-avatar' />
                                    )}
                                    <p className="account-email">{loggedIn ? user.email : 'user@example.com'}</p>
                                </div>
                                <div className="account-buttons">
                                    <button className="account-btn" onClick={() => setActive('prof')}>
                                        Edit Profile
                                    </button>
                                    <button className="account-btn" onClick={() => console.log('Edit account')}>
                                        Log Out
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* AFFILIATE CARD */}
                        <div className="bento-card wide affiliate-card">
                            <div className="affiliate-text">
                                <h2 className='affiliate-title'>Affiliate Marketing</h2>
                                <p className="affiliate-subtitle">
                                    {isAff ? "You are making it rain. Check out your statistics!" : "Earn 50% from referrals. Join now and start earning today!"}
                                </p>
                            </div>
                            <button className="affiliate-cta" onClick={() => setActive('aff')}>
                                {isAff ? "Check Statistics" : "Get Started"}
                                <div className="affiliate-arrow"><IconArrowRight /></div>
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div >
    )
}

export default Dash