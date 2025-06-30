import React, { forwardRef } from "react";
import heroImg from "./assets/hero.png";

interface HeroProps {
  heroX: number;
  onStartDrag: (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => void;
  onStartShooting: () => void;
  onStopShooting: () => void;
}

const Hero = forwardRef<HTMLDivElement, HeroProps>(
  ({ heroX, onStartDrag, onStartShooting, onStopShooting }, ref) => {
    return (
      <div
        ref={ref}
        className="hero"
        onMouseDown={(e) => {
          onStartDrag(e);
          onStartShooting();
        }}
        onTouchStart={(e) => {
          onStartDrag(e);
          onStartShooting();
        }}
        onMouseUp={onStopShooting}
        onTouchEnd={onStopShooting}
        style={{ transform: `translateX(${heroX}px)` }}
      >
        <img src={heroImg} alt="hero" />
      </div>
    );
  }
);

export default Hero;
