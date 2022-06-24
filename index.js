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
    const radius = Math.random() * 20 + 10;
    let x;
    let y;

    if (Math.random() <= 0.5) {
      x = Math.random() <= 0.5 ? canvas.width + radius : 0 - radius;
      y = Math.random() * canvas.height;
    } else {
      x = Math.random() * canvas.width;
      y = Math.random() <= 0.5 ? canvas.height + radius : 0 - radius;
    }

    const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x);
    const velocity = { x: Math.cos(angle), y: Math.sin(angle) };

    es.push(
      new P({
        x,
        y,
        radius,
        velocity,
      })
    );
  }, 1000);
}

addEnemy();
let animationId;
function animate() {
  animationId = requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);
  player.draw();

  for (const p of ps) {
    p.update();
  }

  for (let i = 0; i < es.length; i++) {
    if (
      Math.hypot(es[i].x - player.x, es[i].y - player.y) -
        player.radius -
        es[i].radius <
      1
    ) {
      cancelAnimationFrame(animationId);
    }

    for (let j = 0; j < ps.length; j++) {
      const dist = Math.hypot(es[i].x - ps[j].x, es[i].y - ps[j].y);

      if (dist - es[i].radius - ps[j].radius < 1) {
        ps.splice(j, 1);
        es.splice(i, 1);
      }
    }

    if (es[i]) es[i].update();
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
    color: "blue",
    velocity,
  });
  console.log(angle);
  ps.push(p);
});

animate();
