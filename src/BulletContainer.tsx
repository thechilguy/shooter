interface Bullet {
  x: number;
  y: number;
}

interface BulletContainerProps {
  bullets: Bullet[];
  bulletImg: string;
}

function BulletContainer({ bullets, bulletImg }: BulletContainerProps) {
  return (
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
  );
}

export default BulletContainer;
