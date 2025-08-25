import './affGraph.css';

const data = [40, 70, 55, 100, 90]; // purely decorative values

export default function AffRewardsGraph() {

    const rewardMap = {
        100: './assets/images/rolex.png',
        90: './assets/images/macbook.png',
        70: './assets/images/apple_watch.png',
        55: './assets/images/airpods.png',
        40: './assets/images/gift_card.png',
    };

    return (
        <div className="aff-graph" aria-hidden="true">
            <svg className="aff-graph-svg" viewBox="0 0 320 140" preserveAspectRatio="xMidYMid meet">
                <defs>
                    <linearGradient id="barGrad" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#a260fe" />
                        <stop offset="100%" stopColor="#883cf3" />
                    </linearGradient>

                    {/* smaller, white glow for images */}
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
                        {/* blur the alpha so the glow is uniformly white (not colored by the image) */}
                        <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
                        {/* paint a white color */}
                        <feFlood floodColor="#ffffff" floodOpacity="0.9" result="flood" />
                        {/* keep the white only where the blur exists */}
                        <feComposite in="flood" in2="blur" operator="in" result="glow" />
                        {/* merge the white glow behind the original graphic */}
                        <feMerge>
                            <feMergeNode in="glow" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* grid lines 
                {[0, 25, 50, 75, 100].map((v, i) => (
                    <line key={i} x1="20" x2="300" y1={10 + (100 - v) * 0.9} y2={10 + (100 - v) * 0.9} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                ))}*/}

                {/* bars */}
                {data.map((val, i) => {
                    const x = 30 + i * 50;
                    const h = (val / 100) * 100;
                    const y = 110 - h;
                    const rewardSrc = rewardMap[val];

                    return (
                        <g key={i} className={`bar-group b-${i}`}>
                            <rect
                                className="bar"
                                x={x}
                                y={y}
                                width="26"
                                height={h}
                                rx="6"
                                ry="6"
                                fill="url(#barGrad)"
                                style={{ animationDelay: `${i * 140}ms` }}
                            />
                            {/* soft top highlight 
                            <rect x={x} y={y} width="26" height={Math.max(6, h * 0.12)} fill="rgba(255,255,255,0.12)" rx="6" ry="6" />
                            */}

                            {/* reward images for specific values */}
                            {rewardSrc && (
                                <g className="reward" transform={`translate(${x + 13}, ${y - 18})`} aria-hidden="true">
                                    {/* center the image on the transform origin */}
                                    <image
                                        href={rewardSrc}
                                        x="-12"
                                        y="-12"
                                        width="24"
                                        height="24"
                                        preserveAspectRatio="xMidYMid meet"
                                        filter="url(#glow)"
                                    />
                                </g>
                            )}
                        </g>
                    );
                })}

                {/* baseline 
                <line x1="20" x2="300" y1="110" y2="110" stroke="rgba(255,255,255,0.06)" strokeWidth="2" />*/}
            </svg>

            {/* decorative floating sparkles */}
            <div className="aff-sparkles">
                <div className="sparkle s1" />
                <div className="sparkle s2" />
                <div className="sparkle s3" />
            </div>
        </div>
    );
}