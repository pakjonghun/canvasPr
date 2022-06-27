class Player {
  x;
  y;
  radius;
  color;
  powerUp;
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

    if (
      this.x + this.radius + this.velocity.x <= canvas.width &&
      this.x - this.radius + this.velocity.x >= 0
    ) {
      this.x += this.velocity.x;
    } else {
      this.velocity.x = 0;
    }

    if (
      this.y + this.velocity.y + this.radius <= canvas.height &&
      this.y + this.velocity.y - this.radius >= 0
    ) {
      this.y += this.velocity.y;
    } else {
      this.velocity.y = 0;
    }

    this.velocity.x *= this.frictinon;
    this.velocity.y *= this.frictinon;
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
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.globalAlpha = this.alpha;
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
    this.center = { x, y };
    this.radian = 0;
    const random = Math.random();
    if (random <= 0.5) {
      this.type = "homing";
    } else {
      this.type = "ring";
    }
  }

  update() {
    this.draw();
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }

  pPupdate() {
    this.draw();
    if (this.type == "homing") {
      const angle = Math.atan2(player.y - this.y, player.x - this.x);
      this.velocity.x = Math.cos(angle);
      this.velocity.y = Math.sin(angle);
      this.x += this.velocity.x;
      this.y += this.velocity.y;
    }

    if (this.type == "ring") {
      const angle = Math.atan2(
        player.y - this.center.y,
        player.x - this.center.x
      );
      this.velocity.x = Math.cos(angle);
      this.velocity.y = Math.sin(angle);

      this.radian += 0.1;

      this.center.x += this.velocity.x;
      this.center.y += this.velocity.y;

      this.x = this.center.x + Math.cos(this.radian) * 30;
      this.y = this.center.y + Math.sin(this.radian) * 30;
    }
  }
}

class PowerUp {
  constructor({ position = { x: 0, y: 0 }, velocity }) {
    this.position = position;
    this.velocity = velocity;
    this.img = new Image();
    this.img.src = "./img/lightningBolt.png";
    this.alpha = 1;
    this.radians = 0;
    gsap.to(this, {
      alpha: 0,
      duration: 0.5,
      repeat: -1,
      ease: "linear",
    });
  }

  draw() {
    c.save();
    c.globalAlpha = this.alpha;
    c.translate(
      this.position.x + this.img.width / 2,
      this.position.y + this.img.height / 2
    );
    c.rotate(this.radians);
    c.translate(
      -this.position.x - this.img.width / 2,
      -this.position.y - this.img.height / 2
    );
    c.drawImage(this.img, this.position.x, this.position.y);
    c.restore();
  }

  update() {
    this.draw();
    this.radians += 0.01;
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

class Background {
  constructor({ position: { x, y }, color, radius }) {
    this.position = { x, y };
    this.color = color;
    this.alpha = 0.1;
    this.radius = radius;
  }

  draw() {
    c.save();
    c.globalAlpha = this.alpha;
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
    c.restore();
  }
}
