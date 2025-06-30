import "./App.css";
import { useState, useRef, useEffect } from "react";
import bulletImg from "./assets/bullet.png";
import Hero from "./Hero";
import BulletContainer from "./BulletContainer";
import EnemyField from "./EnemyField";

interface Bullet {
  x: number;
  y: number;
}

interface Enemy {
  x: number;
  y: number;
  boom: boolean;
  boomTime?: number;
}

function App() {
  const [heroX, setHeroX] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [shootDelay, setShootDelay] = useState(200);
  const [enemySpeed, setEnemySpeed] = useState(2);
  const [bullets, setBullets] = useState<Bullet[]>([]);
  const [enemies, setEnemies] = useState<Enemy[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const isDragging = useRef(false);
  const isShooting = useRef(false);
  const shootInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const cleanupInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const startX = useRef(0);
  const startLeft = useRef(0);

  useEffect(() => {
    if (gameOver) return;

    const bulletInterval = setInterval(() => {
      setBullets((prev) =>
        prev.map((b) => ({ ...b, y: b.y - 30 })).filter((b) => b.y > -20)
      );
    }, 10);

    const enemyInterval = setInterval(() => {
      setEnemies((prev) =>
        prev
          .map((e) => (e.boom ? e : { ...e, y: e.y + enemySpeed }))
          .filter((e) => e.y < window.innerHeight)
      );
    }, 10);

    const spawnInterval = setInterval(() => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.offsetWidth;
      const x = Math.random() * (containerWidth - 50);
      setEnemies((prev) => [...prev, { x, y: -50, boom: false }]);
    }, 500);

    cleanupInterval.current = setInterval(() => {
      const now = Date.now();
      setEnemies((prev) =>
        prev.filter(
          (enemy) =>
            !(
              enemy.boom &&
              enemy.boomTime !== undefined &&
              now - enemy.boomTime > 300
            )
        )
      );
    }, 100);

    return () => {
      clearInterval(bulletInterval);
      clearInterval(enemyInterval);
      clearInterval(spawnInterval);
      if (cleanupInterval.current) clearInterval(cleanupInterval.current);
    };
  }, [gameOver, enemySpeed]);

  useEffect(() => {
    const newEnemies = [...enemies];
    const hits = new Set<number>();

    bullets.forEach((b) => {
      newEnemies.forEach((enemy, idx) => {
        const isHit =
          b.x >= enemy.x &&
          b.x <= enemy.x + 50 &&
          b.y >= enemy.y &&
          b.y <= enemy.y + 50;
        if (isHit && !enemy.boom) {
          newEnemies[idx] = { ...enemy, boom: true, boomTime: Date.now() };
          hits.add(idx);
        }
      });
    });

    if (hits.size > 0) {
      setScore((prev) => prev + hits.size);
      setEnemies(newEnemies);
    }
  }, [bullets]);

  useEffect(() => {
    if (!heroRef.current || gameOver) return;
    const heroRect = heroRef.current.getBoundingClientRect();

    enemies.forEach((enemy) => {
      const enemyRect = {
        left: enemy.x,
        right: enemy.x + 50,
        top: enemy.y,
        bottom: enemy.y + 50,
      };

      const heroLeft = heroRect.left;
      const heroRight = heroRect.right;
      const heroTop = heroRect.top;
      const heroBottom = heroRect.bottom;

      const isColliding =
        heroLeft < enemyRect.right &&
        heroRight > enemyRect.left &&
        heroTop < enemyRect.bottom &&
        heroBottom > enemyRect.top;

      if (isColliding) {
        setGameOver(true);
      }
    });
  }, [enemies, gameOver]);

  useEffect(() => {
    const handleMove = (clientX: number) => {
      if (!containerRef.current || !heroRef.current) return;
      const deltaX = clientX - startX.current;
      const newPos = startLeft.current + deltaX;

      const containerWidth = containerRef.current.offsetWidth;
      const heroWidth = heroRef.current.offsetWidth;

      const minX = -(containerWidth / 2 - heroWidth / 2);
      const maxX = containerWidth / 2 - heroWidth / 2;

      setHeroX(Math.max(minX, Math.min(maxX, newPos)));
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging.current) handleMove(e.clientX);
    };
    const handleTouchMove = (e: TouchEvent) => {
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

  const startDrag = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    isDragging.current = true;
    startX.current = "touches" in e ? e.touches[0].clientX : e.clientX;
    startLeft.current = heroX;
  };

  const startShooting = () => {
    if (shootInterval.current || gameOver) return;
    isShooting.current = true;

    shootInterval.current = setInterval(() => {
      if (!isShooting.current || !heroRef.current || !containerRef.current)
        return;
      const heroRect = heroRef.current.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();
      const x = heroRect.left + heroRect.width / 2 - containerRect.left - 6;
      const y = heroRect.top - containerRect.top;
      setBullets((prev) => [...prev, { x, y }]);
    }, shootDelay);
  };

  const stopShooting = () => {
    isShooting.current = false;
    if (shootInterval.current) clearInterval(shootInterval.current);
    shootInterval.current = null;
  };

  const handleRestart = () => {
    setGameOver(false);
    setBullets([]);
    setEnemies([]);
    setScore(0);
    setHeroX(0);
    setShootDelay(200);
    setEnemySpeed(2);
  };

  useEffect(() => {
    const level = Math.floor(score / 5);
    setShootDelay(Math.max(80, 200 - level * 10));
    setEnemySpeed(2 + level * 0.5);
  }, [score]);

  return (
    <div
      className="container"
      ref={containerRef}
      style={{ overflow: "hidden" }}
    >
      <div className="score">Score: {score}</div>
      {gameOver && (
        <div className="game-over">
          <p>Game Over</p>
          <p>Score: {score}</p>
          <button onClick={handleRestart}>Try Again</button>
        </div>
      )}
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
