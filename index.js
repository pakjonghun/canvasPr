const canvas = document.querySelector("canvas");
const score = document.getElementById("score");
const gameover = document.getElementById("gameover");
const gameoveScore = document.getElementById("gameoverScore");
const restart = document.getElementById("restart");
const start = document.getElementById("start");
let intervalId;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const friction = 0.98;

const c = canvas.getContext("2d");

function init() {
  ps = [];
  es = [];
  particles = [];
  gameoveScore.innerText = 0;
  s = 0;
  player = new MoviePlayer({ x, y, radius: 30, color: "white" });
}

start.addEventListener("click", () => {
  init();
  animate();
  addEnemy();
  gsap.to("#start", {
    opacity: 0,
    scale: 0.3,
    duration: 0.8,
    ease: "expo",
    onComplete: () => (start.style.display = "none"),
  });
});

restart.addEventListener("click", () => {
  init();
  animate();
  addEnemy();
  gsap.to("#gameover", {
    opacity: 0,
    scale: 0.3,
    duration: 0.8,
    ease: "expo",
    onComplete: () => (gameover.style.display = "none"),
  });
});

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

class MoviePlayer extends Player {
  frictinon = 0.96;
  velocity = { x: 0, y: 0 };
  constructor({ x, y, radius, color }) {
    super({ x, y, radius, color });
  }

  update() {
    this.draw();
    this.velocity.x *= this.frictinon;
    this.velocity.y *= this.frictinon;

    if (this.x + this.radius + this.velocity.x <= canvas.width) {
      this.x += this.velocity.x;
    } else {
      this.velocity.x = 0;
    }

    this.y += this.velocity.y;
  }
}

class Partical {
  constructor({ x, y, radius, color, velocity }) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.alpha = 1;
  }

  draw() {
    c.save();
    c.globalAlpha = this.alpha;
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
    c.restore();
  }

  update() {
    this.draw();
    this.velocity.x *= friction;
    this.velocity.y *= friction;
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.alpha -= 0.01;
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

let player = new MoviePlayer({ x, y, radius: 30, color: "white" });
let ps = [];
let es = [];
let particles = [];

function addEnemy() {
  intervalId = setInterval(() => {
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

    const angle = Math.atan2(player.y - y, player.x - x);
    const velocity = { x: Math.cos(angle), y: Math.sin(angle) };
    const color = `hsl(${Math.random() * 360},50%,50%)`;

    es.push(
      new P({
        x,
        y,
        radius,
        velocity,
        color,
      })
    );
  }, 1000);
}

let animationId;
let s = 0;
function animate() {
  animationId = requestAnimationFrame(animate);
  c.fillStyle = "rgba(0, 0, 0, 0.1)";
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  for (let i = particles.length - 1; i >= 0; i--) {
    if (particles[i].alpha <= 0) {
      particles.splice(i, 1);
    } else {
      particles[i].update();
    }
  }

  for (let i = ps.length - 1; i >= 0; i--) {
    ps[i].update();

    const p = ps[i];
    if (
      p.x + p.radius < 0 ||
      p.y + p.radius < 0 ||
      p.x - p.radius > canvas.width ||
      p.y - p.radius > canvas.height
    ) {
      ps.splice(i, 1);
      continue;
    }
  }

  for (let i = es.length - 1; i >= 0; i--) {
    es[i].update();

    if (
      es[i].x + es[i].radius < 0 ||
      es[i] - es[i].radius > canvas.width ||
      es[i].y + es[i].radius < 0 ||
      es[i].y - es[i].radius > canvas.height
    ) {
      es.splice(i, 1);
      continue;
    }

    if (
      Math.hypot(es[i].x - player.x, es[i].y - player.y) -
        player.radius -
        es[i].radius <
      1
    ) {
      cancelAnimationFrame(animationId);
      clearInterval(intervalId);

      gsap.fromTo(
        "#gameover",
        {
          scale: 0.8,
          opacity: 0,
        },
        {
          scale: 1,
          opacity: 1,
          ease: "expo",
          duration: 1,
          oncomplete: () => {
            gameover.style.display = "flex";
            gameoveScore.innerText = s;
          },
        }
      );
    }

    for (let j = ps.length - 1; j >= 0; j--) {
      const dist = Math.hypot(es[i].x - ps[j].x, es[i].y - ps[j].y);

      if (dist - es[i].radius - ps[j].radius < 1) {
        const r = es[i].radius;
        const c = es[i].color;
        for (let i = 0; i < r; i++) {
          const radius = Math.random() * 3 + 1;
          const vx = (Math.random() - 0.5) * Math.random() * 10;
          const vy = (Math.random() - 0.5) * Math.random() * 10;
          const particle = new Partical({
            x: ps[j].x,
            y: ps[j].y,
            radius,
            color: c,
            velocity: { x: vx, y: vy },
          });

          particles.push(particle);
        }

        if (es[i].radius - 10 > 10) {
          s += 50;
          score.innerText = s;

          gsap.to(es[i], {
            radius: es[i].radius - 10,
          });
          ps.splice(j, 1);
        } else {
          s += 100;
          score.innerText = s;
          ps.splice(j, 1);
          es.splice(i, 1);
        }
      }
    }
  }
}

window.addEventListener("click", (event) => {
  const fromX = player.x;
  const fromY = player.y;

  const angle = Math.atan2(event.clientY - fromY, event.clientX - fromX);

  const velocity = {
    x: Math.cos(angle) * 6,
    y: Math.sin(angle) * 6,
  };

  const p = new P({
    x: fromX,
    y: fromY,
    radius: 10,
    color: "blue",
    velocity,
  });

  ps.push(p);
});

window.addEventListener("keydown", (event) => {
  const key = event.key;
  switch (key) {
    case "ArrowRight":
      player.velocity.x += 1;
      break;
    case "ArrowLeft":
      player.velocity.x -= 1;
      break;
    case "ArrowDown":
      player.velocity.y += 1;
      break;
    case "ArrowUp":
      player.velocity.y -= 1;
      break;
    default:
      break;
  }
});
