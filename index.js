const canvas = document.querySelector("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const c = canvas.getContext("2d");

class Player {
  x;
  y;
  radius;
  color;
  constructor({ x, y, radius, color }) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }
}

class P extends Player {
  constructor({ x, y, radius, color, velocity }) {
    super({ x, y, radius, color });
    this.velocity = velocity;
  }

  update() {
    this.draw();
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }
}

const x = canvas.width / 2;
const y = canvas.height / 2;

const player = new Player({ x, y, radius: 30, color: "blue" });
const ps = [];

const es = [];

function addEnemy() {
  setInterval(() => {
    const r = Math.atan2(canvas.height / 2 - 100, canvas.width / 2 - 100);
    es.push(
      new P({
        x: 100,
        y: 100,
        radius: 30,
        velocity: { x: Math.cos(r), y: Math.sin(r) },
      })
    );
  }, 1000);
}

addEnemy();

function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);
  player.draw();
  for (const p of ps) {
    p.update();
  }

  for (const e of es) {
    e.update();
  }
}

window.addEventListener("click", (event) => {
  const angle = Math.atan2(
    event.clientY - canvas.height / 2,
    event.clientX - canvas.width / 2
  );

  const velocity = {
    x: Math.cos(angle),
    y: Math.sin(angle),
  };

  const p = new P({
    x,
    y,
    radius: 10,
    color: "green",
    velocity,
  });
  console.log(angle);
  ps.push(p);
});

animate();
