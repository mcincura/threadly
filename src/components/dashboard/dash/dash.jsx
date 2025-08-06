import './dash.css';

const Dash = () => {
    // Placeholder data - will be replaced with real data later
    const metrics = [
        { title: 'Affiliate Earnings', value: '$2,840', change: '+12%', description: 'From last month' },
        { title: 'Subscriptions', value: '1,258', change: '+24%', description: 'Active members' },
        { title: 'Registered Devices', value: '4,732', change: '-3%', description: 'Company-wide' },
        { title: 'Active Users', value: '3,912', change: '+18%', description: 'Currently online' },
        { title: 'Pending Requests', value: '142', change: '+6%', description: 'Awaiting approval' },
        { title: 'API Calls', value: '28.1k', change: '+32%', description: 'This month' },
    ];

    return (
        <div className="dash-main">
            {/* Header Section */}
            <header className="dashboard-header">
                <div className="header-content">
                    <h1>Dashboard Overview</h1>
                    <p>Welcome back! Here's what's happening with your platform today.</p>
                </div>
                <div className="header-actions">
                    <button className="notif-btn">🔔</button>
                    <div className="user-avatar">JD</div>
                </div>
            </header>

            {/* Bento Grid Section */}
            <div className="bento-grid">
                {metrics.map((metric, index) => (
                    <div
                        className={`card card-${index + 1}`}
                        key={index}
                        style={{ '--rotation': index % 2 === 0 ? '-1.5deg' : '1.5deg' }}
                    >
                        <div className="card-content">
                            <h3>{metric.title}</h3>
                            <div className="metric-value">{metric.value}</div>
                            <div className="metric-footer">
                                <span className={`change-indicator ${metric.change.startsWith('+') ? 'positive' : 'negative'}`}>
                                    {metric.change}
                                </span>
                                <span className="metric-desc">{metric.description}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Dash;