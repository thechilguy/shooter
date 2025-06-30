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
        style={{
          position: "absolute",
          bottom: "20px",
          left: `calc(50% + ${heroX}px)`,
          transform: "translateX(-50%)",
        }}
      >
        <img src={heroImg} alt="hero" />
      </div>
    );
  }
);

export default Hero;
