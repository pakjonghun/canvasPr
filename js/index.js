const canvas = document.querySelector("canvas");
const score = document.getElementById("score");
const gameover = document.getElementById("gameover");
const gameoveScore = document.getElementById("gameoverScore");
const restart = document.getElementById("restart");
const start = document.getElementById("start");
const mute = document.getElementById("mute");
const soundPlay = document.getElementById("soundPlay");

let onlyStart = true;
let intervalId;
let powerIntervalId;
let machineGunId;
let frame = 0;
let isGameStart = false;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const mouseDirection = {
  x: 0,
  y: 0,
};
const friction = 0.98;

const c = canvas.getContext("2d");

mute.addEventListener("click", () => {
  background.pause();
  shootAudio.mute(true);
  damageAudio.mute(true);
  explode.mute(true);
  death.mute(true);
  powerUp.mute(true);
  select.mute(true);
  mute.style.display = "none";
  soundPlay.style.display = "block";
});

soundPlay.addEventListener("click", () => {
  background.play();
  shootAudio.mute(false);
  damageAudio.mute(false);
  explode.mute(false);
  death.mute(false);
  powerUp.mute(false);
  select.mute(false);
  mute.style.display = "block";
  soundPlay.style.display = "none";
});

function createScore({ top, left, score }) {
  const ele = document.createElement("label");
  ele.innerText = score;
  ele.style.position = "absolute";
  ele.style.color = "white";
  ele.style.top = `${top}px`;
  ele.style.left = `${left}px`;
  ele.style.userSelect = "none";
  document.body.appendChild(ele);

  gsap.to(ele, {
    opacity: 0,
    y: -30,
    duration: 0.9,
    onComplete: () => ele.parentNode.removeChild(ele),
  });
}

function init() {
  background.play();
  isGameStart = true;
  frame = 0;
  const spacing = 30;
  for (let x = 0; x < canvas.width + spacing; x += spacing) {
    for (let y = 0; y < canvas.height + spacing; y += spacing) {
      const back = new Background({
        position: { x, y },
        radius: 3,
        color: "green",
      });
      backgrounds.push(back);
    }
  }

  powerUps = [];
  ps = [];
  es = [];
  particles = [];
  gameoveScore.innerText = 0;
  s = 0;
  player = new MoviePlayer({ x, y, radius: 30, color: "white" });
}

start.addEventListener("click", () => {
  select.play();
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
  select.play();

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
let backgrounds = [];

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
    vx = Math.cos(angle) * 3;
    vy = Math.sin(angle) * 3;

    const powerUp = new PowerUp({
      position: { x, y },
      velocity: { x: vx, y: vy },
    });

    powerUps.push(powerUp);
  }, interval);
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
  for (const back of backgrounds) {
    back.draw();

    const dist = Math.hypot(
      back.position.x - player.x,
      back.position.y - player.y
    );

    if (dist < 100) back.alpha = 1;
    if (dist < 50) back.alpha = 0;
    if (back.alpha >= 0.15 && dist >= 100) back.alpha -= 0.05;
  }

  frame++;
  animationId = requestAnimationFrame(animate);
  c.fillStyle = "rgba(0, 0, 0, 0.1)";
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.update();

  for (let i = powerUps.length - 1; i >= 0; i--) {
    const poserUpPosition = powerUps[i].position;
    if (
      poserUpPosition.y < 0 ||
      poserUpPosition.x < 0 ||
      poserUpPosition.x > canvas.width ||
      poserUpPosition.y > canvas.height
    ) {
      powerUps.splice(i, 1);
    }

    powerUps[i].update();

    const position = powerUps[i].position;
    const img = powerUps[i].img;

    if (
      Math.hypot(position.x - player.x, position.y - player.y) -
        img.width / 2 -
        player.radius <
      1
    ) {
      powerUp.play();
      powerUps.splice(i, 1);
      player.powerUp = "machineGun";
      player.color = "yellow";
      setTimeout(() => {
        player.powerUp = "";
        player.color = "white";
      }, 3000);
    }
  }

  if (player.powerUp === "machineGun") {
    if (!(frame % 8)) {
      const angle = Math.atan2(
        mouseDirection.y - player.y,
        mouseDirection.x - player.x
      );

      const newP = new P({
        x: player.x,
        y: player.y,
        color: "red",
        radius: 10,
        velocity: { x: Math.cos(angle) * 10, y: Math.sin(angle) * 10 },
      });
      shootAudio.play();
      ps.push(newP);
    }
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
      background.pause();
      cancelAnimationFrame(animationId);
      isGameStart = false;
      death.play();
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

          const top = ps[j].y;
          const left = ps[j].x;
          createScore({ top, left, score: 50 });
          damageAudio.play();
          gsap.to(es[i], {
            radius: es[i].radius - 10,
          });
          ps.splice(j, 1);
        } else {
          s += 100;
          score.innerText = s;
          const top = ps[j].y;
          const left = ps[j].x;
          createScore({ top, left, score: 100 });

          const color = es[i].color;
          for (const back of backgrounds) {
            gsap.set(back, {
              color: "white",
              alpha: 1,
            });

            gsap.to(back, {
              color,
              alpha: 0.1,
            });
          }
          explode.play();
          ps.splice(j, 1);
          es.splice(i, 1);
        }
      }
    }
  }
}

window.addEventListener("click", (event) => {
  if (!isGameStart) return;
  shootAudio.play();
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

window.addEventListener("mousemove", (event) => {
  mouseDirection.x = event.clientX;
  mouseDirection.y = event.clientY;
});

document.addEventListener("visibilitychange", (event) => {
  if (document.hidden) {
    clearInterval(intervalId);
    clearInterval(powerIntervalId);
    clearInterval(machineGunId);
  } else {
    addEnemy();
    addPowerUp();
  }
});
