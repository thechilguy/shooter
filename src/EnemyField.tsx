import enemy from "./assets/enemy.png";
import boom from "./assets/boom.png";

interface Enemy {
  x: number;
  y: number;
  boom: boolean;
  boomTime?: number;
}

interface EnemyFieldProps {
  enemies: Enemy[];
}

function EnemyField({ enemies }: EnemyFieldProps) {
  return (
    <>
      {enemies.map((enemyPos, i) => (
        <img
          key={i}
          src={enemyPos.boom ? boom : enemy}
          alt="enemy"
          className="enemySprite"
          style={{ left: enemyPos.x, top: enemyPos.y }}
        />
      ))}
    </>
  );
}

export default EnemyField;
