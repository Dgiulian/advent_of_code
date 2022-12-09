const fs = require("fs");

/* @type Set<string> */
const visitedPositions = new Set();

/* @type string[][] */
const state = [5, 6];
const start = [0, 0];
const ROW = 0;
const COL = 1;

const positions = {
  head: [4, 0],
  tail: [4, 0],
};

async function partOne(fileName) {
  const fileBuffer = await fs.promises.readFile(fileName);
  const file = fileBuffer.toString();
  /* @type string[] */
  const input = file.split("\n").filter((line) => line);
  const movements = input
    .map((line) => line.split(" "))
    .map((line) => [line[0], parseInt(line[1])]);

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

  for (let i = 0; i < count; i++) {
    switch (dir) {
      case "U": {
        positions.head[ROW] -= 1;
        break;
      }
      case "D": {
        positions.head[ROW] += 1;
        break;
      }
      case "L": {
        positions.head[COL] -= 1;
        break;
      }
      case "R": {
        positions.head[COL] += 1;
        break;
      }
      default:
        throw new Error("Movement not handled", movement);
    }
    updateTail();
  }
}

function updateTail() {
  const { head, tail } = positions;

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
  visitedPositions.add(positions.tail.join(","));
  debugState();
}

function isEndPoint(
  /* @type 'head' | 'tail' */ end,
  /* @type number */ i,
  /* @type number */ j
) {
  return positions[end][0] === i && positions[end][1] === j;
}
function debugState() {
  for (let i = 0; i < state[0]; i++) {
    let line = [];

    for (let j = 0; j < state[1]; j++) {
      if (isEndPoint("head", i, j)) {
        line.push("H");
      } else if (isEndPoint("tail", i, j)) {
        line.push("T");
      } else line.push(".");
    }

    console.log([...line].join(""));
  }
  console.log("    ");
}

partOne("input_09_small.txt");
