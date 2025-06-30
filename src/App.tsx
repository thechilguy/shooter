import "./App.css";
import { useState, useRef, useEffect } from "react";
import enemy from "./assets/enemy.png";
import hero from "./assets/hero.png";
import bulletImg from "./assets/bullet.png";

function App() {
  const [heroX, setHeroX] = useState(0);
  const [bullets, setBullets] = useState([]);
  const containerRef = useRef(null);
  const heroRef = useRef(null);

  const isDragging = useRef(false);
  const isShooting = useRef(false);
  const shootInterval = useRef(null);
  const startX = useRef(0);
  const startLeft = useRef(0);

  // 🔁 Bullet movement
  useEffect(() => {
    const interval = setInterval(() => {
      setBullets((prev) =>
        prev.map((b) => ({ ...b, y: b.y - 10 })).filter((b) => b.y > -20)
      );
    }, 30);

    return () => clearInterval(interval);
  }, []);

  // 🖱️ Mouse/touch movement
  useEffect(() => {
    const handleMove = (clientX) => {
      const deltaX = clientX - startX.current;
      const newPos = startLeft.current + deltaX;

      const containerWidth = containerRef.current.offsetWidth;
      const heroWidth = heroRef.current.offsetWidth;

      const minX = -(containerWidth / 2 - heroWidth / 2);
      const maxX = containerWidth / 2 - heroWidth / 2;

      setHeroX(Math.max(minX, Math.min(maxX, newPos)));
    };

    const handleMouseMove = (e) => {
      if (isDragging.current) handleMove(e.clientX);
    };

    const handleTouchMove = (e) => {
      if (isDragging.current) handleMove(e.touches[0].clientX);
    };

    const stopDrag = () => {
      isDragging.current = false;
      stopShooting();
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", stopDrag);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", stopDrag);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", stopDrag);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", stopDrag);
    };
  }, []);

  const startDrag = (e) => {
    isDragging.current = true;
    startX.current = e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
    startLeft.current = heroX;
  };

  const startShooting = () => {
    if (shootInterval.current) return;
    isShooting.current = true;

    shootInterval.current = setInterval(() => {
      if (!isShooting.current) return;

      const heroRect = heroRef.current.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();
      const x = heroRect.left + heroRect.width / 2 - containerRect.left - 6; // 6 — половина ширини кулі
      const y = heroRect.top - containerRect.top;

      setBullets((prev) => [...prev, { x, y }]);
    }, 200);
  };

  const stopShooting = () => {
    isShooting.current = false;
    clearInterval(shootInterval.current);
    shootInterval.current = null;
  };

  return (
    <div className="container" ref={containerRef}>
      <div className="enemy">
        <img src={enemy} alt="enemy" />
      </div>

      {/* Кулі */}
      <div className="bullet_container">
        {bullets.map((b, i) => (
          <img
            key={i}
            src={bulletImg}
            alt="bullet"
            className="bullet"
            style={{ left: b.x, top: b.y }}
          />
        ))}
      </div>

      {/* Герой */}
      <div
        className="hero"
        ref={heroRef}
        style={{ transform: `translateX(${heroX}px)` }}
        onMouseDown={(e) => {
          startDrag(e);
          startShooting();
        }}
        onTouchStart={(e) => {
          startDrag(e);
          startShooting();
        }}
        onMouseUp={stopShooting}
        onMouseLeave={stopShooting}
        onTouchEnd={stopShooting}
      >
        <img src={hero} alt="hero" />
      </div>
    </div>
  );
}

export default App;
