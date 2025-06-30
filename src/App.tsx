import "./App.css";
import { useState, useRef, useEffect } from "react";
import bulletImg from "./assets/bullet.png";
import Hero from "./Hero";
import BulletContainer from "./BulletContainer";
import EnemyField from "./EnemyField";

function App() {
  const [heroX, setHeroX] = useState(0);
  const [bullets, setBullets] = useState([]);
  const [enemies, setEnemies] = useState([]);
  const containerRef = useRef(null);
  const heroRef = useRef(null);

  const isDragging = useRef(false);
  const isShooting = useRef(false);
  const shootInterval = useRef(null);
  const startX = useRef(0);
  const startLeft = useRef(0);

  useEffect(() => {
    const bulletInterval = setInterval(() => {
      setBullets((prev) =>
        prev.map((b) => ({ ...b, y: b.y - 10 })).filter((b) => b.y > -20)
      );
    }, 30);

    const enemyInterval = setInterval(() => {
      setEnemies((prev) =>
        prev
          .map((e) => ({ ...e, y: e.y + 2 }))
          .filter((e) => e.y < window.innerHeight)
      );
    }, 30);

    const spawnInterval = setInterval(() => {
      const containerWidth = containerRef.current.offsetWidth;
      const x = Math.random() * (containerWidth - 50);
      setEnemies((prev) => [...prev, { x, y: -50 }]);
    }, 1500);

    return () => {
      clearInterval(bulletInterval);
      clearInterval(enemyInterval);
      clearInterval(spawnInterval);
    };
  }, []);

  // 🔥 Колізії: куля влучила у ворога
  useEffect(() => {
    setEnemies((prevEnemies) =>
      prevEnemies.filter((enemy) => {
        const hit = bullets.some(
          (b) =>
            b.x >= enemy.x &&
            b.x <= enemy.x + 50 &&
            b.y >= enemy.y &&
            b.y <= enemy.y + 50
        );
        return !hit;
      })
    );
  }, [bullets]);

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
      const x = heroRect.left + heroRect.width / 2 - containerRect.left - 6;
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
      <EnemyField enemies={enemies} />
      <BulletContainer bullets={bullets} bulletImg={bulletImg} />
      <Hero
        ref={heroRef}
        heroX={heroX}
        onStartDrag={startDrag}
        onStartShooting={startShooting}
        onStopShooting={stopShooting}
      />
    </div>
  );
}

export default App;
