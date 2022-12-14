const fs = require("fs");

let debug = false;

async function getInput(fileName) {
  if (!fileName) {
    throw new Error("Missing filename Argument");
  }
  const fileBuffer = await fs.promises.readFile(fileName);
  const file = fileBuffer.toString();
  /* @type string[] */
  const groups = file.split("\n").filter((line) => line);

  return groups;
}
/** @type Set<string> */
const occupiedPossitions = new Set();
const rockPossitions = new Set();

function parsePositions(line) {
  const positions = line
    .split(" -> ")
    .map((position) => position.split(",").map(Number));

  for (let i = 0; i < positions.length - 1; i++) {
    const cur = positions[i];
    const next = positions[i + 1];
    if (cur[0] === next[0]) {
      /* It's a column */
      const from = Math.min(cur[1], next[1]);
      const to = Math.max(cur[1], next[1]);
      for (let j = from; j <= to; j++) {
        const id = flatId(cur[0], j);
        occupiedPossitions.add(id);
        rockPossitions.add(id);
        console.log(id);
      }
    } else {
      /* It's a Row */

      const from = Math.min(cur[0], next[0]);
      const to = Math.max(cur[0], next[0]);
      for (let j = from; j <= to; j++) {
        const id = flatId(j, cur[1]);
        occupiedPossitions.add(id);
        rockPossitions.add(id);
        console.log(id);
      }
    }
  }
  console.log();
}

async function partOne(fileName) {
  const input = await getInput(fileName);
  for (let line of input) {
    parsePositions(line);
  }
  let i = 1;
  while (true) {
    // debug = i > 22;
    console.log(`----${i}----`);
    const flag = simulateSand();
    if (!flag) {
      break;
    }
    i += 1;
  }
  console.log(i);

  for (let k of rockPossitions.keys()) {
    if (debug) console.log(k);
  }
  printGrid([500, 0]);
}
function printGrid(sandPosition) {
  if (!debug) return;
  const grid = Array.from({ length: 10 }).map(() => Array.from({ length: 10 }));
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      const gridPosition = [j + 494, i];
      const id = flatId(...gridPosition);
      if (id === flatId(...sandPosition)) {
        grid[i][j] = "*";
      } else if (occupiedPossitions.has(id)) {
        grid[i][j] = rockPossitions.has(id) ? "#" : "o";
      } else {
        grid[i][j] = ".";
      }
    }
    console.log(grid[i].join(""));
  }
  console.log();
}

function simulateSand() {
  let sandPosition = [500, 0];
  const moves = [
    [0, 1],
    [-1, 1],
    [1, 1],
  ];

  let currentMove = 0;
  let frame = 0;
  while (true) {
    printGrid(sandPosition);
    frame++;
    const move = moves[currentMove];
    const nextPosition = [sandPosition[0] + move[0], sandPosition[1] + move[1]];
    if (nextPosition[0] < 0 || frame > 1000) return false;
    // console.log(sandPosition, nextPosition);
    if (occupiedPossitions.has(flatId(...nextPosition))) {
      // Try next position
      currentMove += 1;
      if (currentMove >= moves.length) {
        // Rest
        occupiedPossitions.add(flatId(...sandPosition));
        break;
      }
    } else {
      sandPosition = nextPosition;
      currentMove = 0;
    }
  }
  return true;
}
function flatId(i, j) {
  return `${i},${j}`;
}
// partOne("input_14_small.txt");
partOne("input_14.txt");
