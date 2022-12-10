const fs = require("fs");

/* @type Set<string> */
const visitedPositions = new Set();

const ROW = 0;
const COL = 1;

/* @type string[][] */
let state;
let initialPosition;
let positions;

async function getMovements(fileName) {
  const fileBuffer = await fs.promises.readFile(fileName);
  const file = fileBuffer.toString();
  /* @type string[] */
  const input = file.split("\n").filter((line) => line);
  const movements = input
    .map((line) => line.split(" "))
    .map((line) => [line[0], parseInt(line[1])]);
  return movements;
}
async function partOne(fileName) {
  state = [5, 6];
  initialPosition = [4, 0];
  positions = [[...initialPosition], [...initialPosition]];
  const movements = await getMovements(fileName);
  for (let movement of movements) {
    executeMovement(movement);
  }
  let count = 0;
  visitedPositions.forEach((p) => count++);

  for (let i = 0; i < state[0]; i++) {
    const line = [];
    for (let j = 0; j < state[1]; j++) {
      if (visitedPositions.has(`${i},${j}`)) {
        line.push("#");
      } else {
        line.push(".");
      }
    }
    console.log(line.join(""));
  }

  console.log(count);
}

async function partTwo(fileName) {
  state = [21, 26];
  initialPosition = [15, 11];
  positions = [
    [...initialPosition],
    [...initialPosition],
    [...initialPosition],
    [...initialPosition],
    [...initialPosition],
    [...initialPosition],
    [...initialPosition],
    [...initialPosition],
    [...initialPosition],
    [...initialPosition],
  ];
  const movements = await getMovements(fileName);
  debugState();
  for (let movement of movements) {
    executeMovement(movement);
  }

  let count = 0;
  visitedPositions.forEach((p) => count++);
  console.log(count);
}

function executeMovement(movement) {
  const [dir, count] = movement;
  console.log(movement, "--->");
  const head = positions[0];
  for (let i = 0; i < count; i++) {
    switch (dir) {
      case "U": {
        head[ROW] -= 1;
        break;
      }
      case "D": {
        head[ROW] += 1;
        break;
      }
      case "L": {
        head[COL] -= 1;
        break;
      }
      case "R": {
        head[COL] += 1;
        break;
      }
      default:
        throw new Error("Movement not handled", movement);
    }
    for (let t = 1; t < positions.length; t++) {
      updateTail(positions[t - 1], positions[t]);
      visitedPositions.add(positions[1].join(","));
      debugState();
    }
    // debugState();
  }
}

function updateTail(head, tail) {
  /* Is Same Row? */

  if (head[ROW] === tail[ROW]) {
    if (head[COL] - tail[COL] >= 2) {
      tail[COL] += 1;
    }
    if (head[COL] - tail[COL] <= -2) {
      tail[COL] -= 1;
    }
  } else if (head[COL] === tail[COL]) {
    /* Is  Same col? */
    if (head[0] - tail[0] >= 2) {
      tail[0] += 1;
    }
    if (head[0] - tail[0] <= -2) {
      tail[0] -= 1;
    }
  } else if (head[COL] + 1 === tail[COL]) {
    /* TODO: Diagonals???? */
    if (head[ROW] + 2 === tail[ROW]) {
      tail[ROW] -= 1;
      tail[COL] -= 1;
    } else if (head[ROW] - 2 === tail[ROW]) {
      tail[ROW] += 1;
      tail[COL] -= 1;
    }
  } else if (head[COL] - 1 === tail[COL]) {
    if (head[ROW] + 2 === tail[ROW]) {
      tail[ROW] -= 1;
      tail[COL] += 1;
    } else if (head[ROW] - 2 === tail[ROW]) {
      tail[ROW] += 1;
      tail[COL] += 1;
    }
  } else if (head[ROW] + 1 === tail[ROW]) {
    if (head[COL] + 2 === tail[COL]) {
      tail[ROW] -= 1;
      tail[COL] -= 1;
    } else if (head[COL] - 2 === tail[COL]) {
      tail[ROW] -= 1;
      tail[COL] += 1;
    }
  } else if (head[ROW] - 1 === tail[ROW]) {
    if (head[COL] + 2 === tail[COL]) {
      tail[ROW] += 1;
      tail[COL] -= 1;
    } else if (head[COL] - 2 === tail[COL]) {
      tail[ROW] += 1;
      tail[COL] += 1;
    }
  }
}

function isHead(/* @type number */ i, /* @type number */ j) {
  return positions[0][0] === i && positions[0][1] === j;
}
function isTail(
  /* @type [number, number] */ tail,
  /* @type number */ i,
  /* @type number */ j
) {
  return tail[0] === i && tail[1] === j;
}

function debugState() {
  for (let i = 0; i < state[0]; i++) {
    let line = [];
    let isOccupied = false;
    for (let j = 0; j < state[1]; j++) {
      isOccupied = false;
      if (isHead(i, j)) {
        line.push("H");
      } else {
        for (let t = 1; t < positions.length; t++) {
          if (!isOccupied && isTail(positions[t], i, j)) {
            isOccupied = true;
            line.push(t);
          }
        }
        if (!isOccupied) {
          line.push(".");
        }
      }
    }

    console.log([...line].join(""));
  }
  console.log("    ");
}

partOne("input_09_small.txt");
// partOne("input_09.txt");
// partTwo("input_09_larger.txt");
// partTwo("input_09.txt");
