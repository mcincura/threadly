import './dash.css';
import './cards.css'
import { IconUserCircle } from '@tabler/icons-react';

const Dash = () => {



    return (
        <div className="dash-main">
            <div className="dash-content-wrapper">
                <div className="dash-content">
                    <div className="dash-header">
                        <h1>DASHBOARD</h1>
                        <div className="dash-profile">
                            <div className="dash-profile-circle">
                                <IconUserCircle className='dash-profile-icon' />
                            </div>
                        </div>
                    </div>
                    <div className="dash-bento-grid">
                        <div className="bento-card wide device-usage-card">
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
                                            strokeDasharray="70, 100" /* example: 70% usage */
                                            d="M18 2.0845
                       a 15.9155 15.9155 0 0 1 0 31.831
                       a 15.9155 15.9155 0 0 1 0 -31.831"
                                        />
                                    </svg>
                                    <div className="progress-text">
                                        <span className="used-devices">7</span>
                                        <span className="total-devices">/ 10</span>
                                    </div>
                                </div>
                                <div className="device-info">
                                    <h2>Devices in Use</h2>
                                    <p>7 of 10 licensed devices are active</p>
                                </div>
                            </div>
                        </div>
                        <div className="bento-card tall">
                            <h1>tall bento grid</h1>
                        </div>
                        <div className="bento-card">
                            <h1>normal bento grid</h1>
                        </div>
                        <div className="bento-card large">
                            <h1>large bento grid</h1>
                        </div>
                        <div className="bento-card tall">
                            <h1>tall bento grid</h1>
                        </div>
                        <div className="bento-card wide">
                            <h1>wide bento grid</h1>
                        </div>
                        <div className="bento-card">
                            <h1>normal bento grid</h1>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Dash;