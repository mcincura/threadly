import './affGraph.css';
import { motion } from 'framer-motion';

const data = [40, 70, 55, 90, 80]; // purely decorative values

export default function AffRewardsGraph() {

    const rewardMap = {
        90: './assets/images/rolex.png',
        80: './assets/images/macbook.png',
        70: './assets/images/apple_watch.png',
        55: './assets/images/airpods.png',
        40: './assets/images/gift_card.png',
    };

    return (
        <div className="aff-graph" aria-hidden="true">
            <svg className="aff-graph-svg" viewBox="0 0 320 140" preserveAspectRatio="xMidYMid meet">
                <defs>
                    <linearGradient id="barGrad" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#883cf3" />
                        <stop offset="100%" stopColor="#5f2eea" />
                    </linearGradient>

                    {/* smaller, white glow for images */}
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
                        {/* blur the alpha so the glow is uniformly white (not colored by the image) */}
                        <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
                        {/* paint a white color */}
                        <feFlood floodColor="#ffffff" floodOpacity="0.9" result="flood" style={{ floodColor: "var(--aff-glow-color)" }} />
                        {/* keep the white only where the blur exists */}
                        <feComposite in="flood" in2="blur" operator="in" result="glow" />
                        {/* merge the white glow behind the original graphic */}
                        <feMerge>
                            <feMergeNode in="glow" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

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

                            {/* reward images for specific values */}
                            {rewardSrc && (
                                <g className="reward" transform={`translate(${x + 13}, ${y - 18})`} aria-hidden="true">
                                    {/* center the image on the transform origin */}
                                    <motion.image
                                        href={rewardSrc}
                                        x="-14"
                                        y="-14"
                                        width="28"
                                        height="28"
                                        preserveAspectRatio="xMidYMid meet"
                                        filter="url(#glow)"
                                        initial={{ y: 0, opacity: 0 }}
                                        animate={{
                                            y: [0, -2, 0],
                                            opacity: 1,
                                            transition: {
                                                y: {
                                                    duration: 4,
                                                    repeat: Infinity,
                                                    repeatType: "loop",
                                                    ease: "easeInOut"
                                                },
                                                opacity: { duration: 0.7, ease: "easeOut" }
                                            }
                                        }}
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
                <div className="sparkle s3" />
            </div>
        </div>
    );
}