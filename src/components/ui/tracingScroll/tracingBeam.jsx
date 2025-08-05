import React, { useEffect, useState } from "react";
import "./beam.css";

const gradientStops = ["#db00c1", "#551bb3"];

const dots = [
  { className: "tracing-beam-dot-start", pos: 0.01 },
  { className: "tracing-beam-dot-1", pos: 0.33 },
  { className: "tracing-beam-dot-2", pos: 0.66 },
  { className: "tracing-beam-dot-end", pos: 0.98 }
];

const TracingBeam = ({ scrollProgress }) => {
  const [dotColors, setDotColors] = useState(dots.map(() => "#fff"));
  const gradientHeight = `${Math.min(scrollProgress * 100, 100)}%`;

  useEffect(() => {
    const newColors = dots.map(({ pos }) => {
      if (scrollProgress >= pos) {
        const relativePos = pos / scrollProgress;
        return sampleLinearGradient(gradientStops, relativePos);
      }
      return "#fff";
    });
    setDotColors(newColors);
  }, [scrollProgress]);

  return (
    <div className="tracing-beam-wrapper">
      <div className="tracing-beam-content">
        <div className="tracing-beam-line">
          <div
            className="tracing-beam-gradient"
            style={{ height: gradientHeight }}
          />
        </div>
        {dots.map((dot, i) => (
          <div
            key={i}
            className={`${dot.className} ${scrollProgress >= dot.pos ? "active" : ""}`}
            style={{
              backgroundColor: dotColors[i],
              border: scrollProgress >= dot.pos ? "2px solid #fff" : "none"
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default TracingBeam;


function sampleLinearGradient(colorStops, t) {
  t = Math.min(Math.max(t, 0), 1);

  const hexToRgb = (hex) => {
    const sanitized = hex.replace("#", "");
    const bigint = parseInt(sanitized, 16);
    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: bigint & 255
    };
  };

  const rgbToHex = ({ r, g, b }) =>
    `#${[r, g, b].map((x) => Math.round(x).toString(16).padStart(2, "0")).join("")}`;

  const c1 = hexToRgb(colorStops[0]);
  const c2 = hexToRgb(colorStops[1]);

  const interpolated = {
    r: c1.r + (c2.r - c1.r) * t,
    g: c1.g + (c2.g - c1.g) * t,
    b: c1.b + (c2.b - c1.b) * t
  };

  return rgbToHex(interpolated);
}
