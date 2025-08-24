import React from 'react';
import './affGraph.css';

const data = [40, 70, 55, 90, 65]; // purely decorative values

export default function AffRewardsGraph() {
    return (
        <div className="aff-graph" aria-hidden="true">
            <svg className="aff-graph-svg" viewBox="0 0 320 140" preserveAspectRatio="xMidYMid meet">
                <defs>
                    <linearGradient id="barGrad" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#a260fe" />
                        <stop offset="100%" stopColor="#883cf3" />
                    </linearGradient>
                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="6" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
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
                            {/* medal for high performers */}
                            {val >= 85 && (
                                <g className="medal" transform={`translate(${x + 13}, ${y - 18})`}>
                                    <circle r="10" fill="#ffd166" filter="url(#glow)" />

                                    <path d="M-2 1 L0 -5 L2 1 L-3 -2 L3 -2 Z" fill="#9b4d05" />
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