import React from "react";

function BulletContainer({ bullets, bulletImg }) {
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
