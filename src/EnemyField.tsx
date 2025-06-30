import React from "react";
import enemy from "./assets/enemy.png";

function EnemyField({ enemies }) {
  return (
    <>
      {enemies.map((enemyPos, i) => (
        <img
          key={i}
          src={enemy}
          alt="enemy"
          className="enemySprite"
          style={{ left: enemyPos.x, top: enemyPos.y }}
        />
      ))}
    </>
  );
}

export default EnemyField;
