import React, { forwardRef } from "react";
import hero from "./assets/hero.png";

const Hero = forwardRef(
  ({ heroX, onStartDrag, onStartShooting, onStopShooting }, ref) => {
    return (
      <div
        className="hero"
        ref={ref}
        style={{ transform: `translateX(${heroX}px)` }}
        onMouseDown={(e) => {
          onStartDrag(e);
          onStartShooting();
        }}
        onTouchStart={(e) => {
          onStartDrag(e);
          onStartShooting();
        }}
        onMouseUp={onStopShooting}
        onMouseLeave={onStopShooting}
        onTouchEnd={onStopShooting}
      >
        <img src={hero} alt="hero" />
      </div>
    );
  }
);

export default Hero;
