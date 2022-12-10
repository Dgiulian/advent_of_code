const fs = require("fs");

const data = fs
  .readFileSync("input_09.txt", "utf8")
  .split("\n")
  .slice(0, -1)
  .map((r) => r.split(" "));

class Point {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.history = [[0, 0]];
  }

  move(x, y) {
    this.x += x;
    this.y += y;
    this.history.push([this.x, this.y]);
  }

  moveDir(dir) {
    let dX = 0;
    let dY = 0;
    switch (dir) {
      case "U":
        dY += 1;
        break;
      case "D":
        dY -= 1;
        break;
      case "R":
        dX += 1;
        break;
      case "L":
        dX -= 1;
        break;
    }
    this.move(dX, dY);
  }

  follow(point, dir) {
    const dX = point.x - this.x;
    const dY = point.y - this.y;

    // Diagonal
    if (Math.hypot(dX, dY) > 2) {
      this.move(Math.sign(dX), Math.sign(dY));
    } else if (Math.abs(dX) == 2) {
      this.move(Math.sign(dX), 0);
    } else if (Math.abs(dY) == 2) {
      this.move(0, Math.sign(dY));
    }
  }
}

class Snake {
  constructor(size) {
    this.points = [...new Array(size)].map((_) => new Point());
  }
  move(dir) {
    this.points[0].moveDir(dir);
    for (let i = 1; i < this.points.length; i++) {
      this.points[i].follow(this.points[i - 1]);
    }
  }
  head() {
    return this.points[0];
  }
  tail() {
    return this.points[this.points.length - 1];
  }
}

// Part 1
const H = new Point();
const T = new Point();
for (const [dir, steps] of data) {
  for (const _ of [...Array(parseInt(steps))]) {
    H.moveDir(dir);
    T.follow(H);
  }
}

console.log(new Set(T.history.map((p) => p.join())).size);

// Part 2
const snake = new Snake(10);
for (const [dir, steps] of data) {
  for (const _ of [...Array(parseInt(steps))]) {
    snake.move(dir);
  }
}

console.log(new Set(snake.tail().history.map((p) => p.join())).size);
