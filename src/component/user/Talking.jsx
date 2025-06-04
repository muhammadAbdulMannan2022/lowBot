import React from "react";
import "./talking.css";

export default function Talking() {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <svg
        className="talking-svg animate-float"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 40 40"
        width="60"
        height="60"
      >
        <ellipse
          className="wobble"
          cx="20"
          cy="20"
          rx="8"
          ry="8"
          fill="#035bbb"
        />
      </svg>
    </div>
  );
}
