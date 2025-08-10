import './dash.css';
import './cards.css'
import { IconUserCircle } from '@tabler/icons-react';
import { useState } from 'react';

const Dash = () => {

    const [isAff, setIsAff] = useState(false);
    const [hasPfp, setHasPfp] = useState(false)

    return (
        <div className="dash-main">
            <div className="dash-content-wrapper">
                <div className="dash-content">
                    <div className="dash-bento-grid">
                        <div className="bento-card tall device-usage-card">
                            <div className="device-usage-content">
                                <div className="device-progress">
                                    <svg viewBox="0 0 36 36" className="progress-ring">
                                        <path
                                            className="progress-ring-bg"
                                            d="M18 2.0845
                       a 15.9155 15.9155 0 0 1 0 31.831
                       a 15.9155 15.9155 0 0 1 0 -31.831"
                                        />
                                        <path
                                            className="progress-ring-fill"
                                            strokeDasharray="80, 100" /* example: 70% usage */
                                            d="M18 2.0845
                       a 15.9155 15.9155 0 0 1 0 31.831
                       a 15.9155 15.9155 0 0 1 0 -31.831"
                                        />
                                    </svg>
                                    <div className="progress-text">
                                        <span className="used-devices">8</span>
                                        <span className="total-devices">/ 10</span>
                                    </div>
                                </div>
                                <div className="device-info">
                                    <h2>Devices in Use</h2>
                                    <p>7 of 10 licensed devices are active</p>
                                </div>
                            </div>
                        </div>

                        <div className="bento-card device-allocation-card">
                            <h2 className="allocation-title">Change Device Allocation</h2>
                            <div className="allocation-controls">
                                <button className="allocation-btn" onClick={() => console.log('Remove device')}>
                                    –
                                </button>
                                <span className="device-count">3</span>
                                <button className="allocation-btn" onClick={() => console.log('Add device')}>
                                    +
                                </button>
                            </div>
                            <p className="allocation-note">Upgrade for more devices</p>
                        </div>

                        <div className="bento-card invoice-card">
                            <h2 className="invoice-title">Next Invoice</h2>
                            <div className="invoice-amount">$149.99</div>
                            <div className="invoice-due-date">Due: Aug 28, 2025</div>

                            <button className="invoice-pay-btn" onClick={() => console.log('Pay now')}>
                                Pay Now
                            </button>

                            {/*<div className="invoice-breakdown">
                                <p>Base License: $99.99</p>
                                <p>Extra Devices: $50.00</p>
                            </div>*/}
                        </div>

                        <div className="bento-card tall announcements-card">
                            <h2 className="announcements-title">📢 Announcements</h2>

                            {/* New Feature Hero */}
                            <div className="announcement-hero">
                                <h3>🚀 New Feature!</h3>
                                <p>Introducing smart device allocation for your team.</p>
                                <button className="announcement-btn">Learn More</button>
                            </div>

                            {/* Updates List */}
                            <div className="announcement-list">
                                <div className="announcement-item">
                                    <span className="announcement-date">Aug 8</span>
                                    <p>🔧 Scheduled maintenance on Aug 12, 2 AM - 4 AM UTC.</p>
                                </div>
                                <div className="announcement-item">
                                    <span className="announcement-date">Aug 6</span>
                                    <p>📊 New analytics dashboard released.</p>
                                </div>
                            </div>
                        </div>

                        <div className="bento-card large">
                            <h1>large bento grid</h1>
                        </div>
                        <div className="bento-card tall">

                        </div>

                        <div className="bento-card">
                            <h1>normal bento grid</h1>
                        </div>
                        <div className="bento-card account-card">
                            <h2 className="account-title">Account Management</h2>
                            <div className="account-content">
                                {hasPfp ? (
                                    <img
                                        src="https://via.placeholder.com/80"
                                        alt="Profile"
                                        className="account-avatar"
                                    />
                                ) : (
                                    <IconUserCircle className='account-avatar' />
                                )}
                                <div className="account-info">
                                    <p className="account-email">user@example.com</p>
                                    <button className="account-edit-btn" onClick={() => console.log('Edit account')}>
                                        Edit Profile
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="bento-card wide affiliate-card">
                            <div className="affiliate-text">
                                <h2 className="affiliate-title">Affiliate Marketing</h2>
                                <p className="affiliate-subtitle">
                                    {isAff ? "You are making it rain. Check out your statistics!" : "Earn 50% from referrals. Join now and start earning today!"}
                                </p>
                            </div>

                            <button className="affiliate-cta" onClick={() => console.log('Go to affiliate page')}>
                                {isAff ? "Check Statistics" : "Get Started"}
                                <span className="affiliate-arrow">→</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Dash;