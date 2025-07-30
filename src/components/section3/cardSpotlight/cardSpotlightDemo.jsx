import React from "react";
import CountUp from "react-countup";
import "./cardSpotlightDemo.css"; // Optional: for custom styles
import { CardSpotlight } from "../../ui/card-spotlight";

export function CardSpotlightDemo() {

    const stats = [
        { title: "CLIENTS", value: 109, unit: "+" },
        { title: "ENGAGEMENT", value: 5.8, unit: "x" },
        { title: "CONVERSIONS", value: 4, unit: "x" },
        { title: "FOLLOWS", value: 12.3, unit: "x" },
    ];


    return (
        <CardSpotlight>
            <div className="stat-container">
                {stats.map((stat, idx) => (
                    <div key={idx} className="stat-box">
                        <h3 className="stat-value">
                            <CountUp
                                start={0}
                                end={stat.value}
                                duration={2}
                                decimals={stat.value % 1 !== 0 ? 1 : 0}
                            />
                            {stat.unit}
                        </h3>
                        <p className="stat-title">
                            {stat.title}
                        </p>
                    </div>
                ))}
            </div>

        </CardSpotlight>
    );
}

