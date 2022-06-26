const canvas = document.querySelector("canvas");
const score = document.getElementById("score");
const gameover = document.getElementById("gameover");
const gameoveScore = document.getElementById("gameoverScore");
const restart = document.getElementById("restart");
const start = document.getElementById("start");
let intervalId;
let powerIntervalId;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const friction = 0.98;

const c = canvas.getContext("2d");

function init() {
  powerUps = [];
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

  addPowerUp();
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

  addPowerUp();
  gsap.to("#gameover", {
    opacity: 0,
    scale: 0.3,
    duration: 0.8,
    ease: "expo",
    onComplete: () => (gameover.style.display = "none"),
  });
});

const x = canvas.width / 2;
const y = canvas.height / 2;

let player = new MoviePlayer({ x, y, radius: 30, color: "white" });
let ps = [];
let es = [];
let particles = [];
let powerUps = [];

function addPowerUp() {
  const interval = 5000;

  powerIntervalId = setInterval(() => {
    const chance3 = Math.random();
    let x;
    let y;
    let vx;
    let vy;

    if (chance3 <= 0.5) {
      const chance = Math.random();
      x = chance <= 0.5 ? canvas.width : 0;
      y = Math.random() * canvas.height;
    } else {
      const chance2 = Math.random();
      x = Math.random() * canvas.width;
      y = chance2 <= 0.5 ? 0 : canvas.height;
    }

    const angle = Math.atan2(player.y - y, player.x - x);
    vx = Math.cos(angle);
    vy = Math.sin(angle);

    const powerUp = new PowerUp({
      position: { x, y },
      velocity: { x: vx, y: vy },
    });

    powerUps.push(powerUp);
  }, 1000);
}

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

  for (let i = powerUps.length - 1; i >= 0; i--) {
    powerUps[i].update();
  }

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
    es[i].pPupdate();

    if (
      es[i].x + es[i].radius * 2 < 0 ||
      es[i].x - es[i].radius * 2 > canvas.width ||
      es[i].y + es[i].radius * 2 < 0 ||
      es[i].y - es[i].radius * 2 > canvas.height
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
      clearInterval(powerIntervalId);
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
