"use strict";

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

const x = canvas.width / 2;
const y = canvas.height / 2;

const player = new Player({ x: x, y: y, radius: 30, color: "blue" });
player.draw();

console.log(player);
