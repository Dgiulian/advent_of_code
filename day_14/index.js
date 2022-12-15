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
  const height = getMaxHeight();
  const maxWidth = getMaxWidth();
  const minWidth = getMinWidth();
  const width = maxWidth - minWidth + 1;
  const grid = Array.from({ length: height }).map(() =>
    Array.from({ length: width })
  );
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      const gridPosition = [j + minWidth, i];
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

function getMaxHeight() {
  const keys = [...occupiedPossitions.keys()];
  const maxHeight = Math.max(...keys.map((position) => position.split(",")[1]));
  return maxHeight + 2;
}
function getMaxWidth() {
  const keys = [...occupiedPossitions.keys()];
  const maxWidth = Math.max(...keys.map((position) => position.split(",")[0]));
  return maxWidth;
}
function getMinWidth() {
  const keys = [...occupiedPossitions.keys()];
  const maxWidth = Math.min(...keys.map((position) => position.split(",")[0]));
  return maxWidth;
}

async function partTwo(fileName) {
  const input = await getInput(fileName);
  for (let line of input) {
    parsePositions(line);
  }

  const maxHeight = getMaxHeight();
  let i = 1;
  while (true) {
    // debug = i > 22;
    if (debug) console.log(`----${i}----`);
    const flag = simulateSand2(maxHeight);
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
function simulateSand2(maxHeight) {
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
    // if (nextPosition[0] < 0 || frame > 1000) return false;

    // console.log(sandPosition, nextPosition);
    if (
      occupiedPossitions.has(flatId(...nextPosition)) ||
      nextPosition[1] >= maxHeight
    ) {
      // Try next position
      currentMove += 1;
      if (currentMove >= moves.length) {
        // Rest
        occupiedPossitions.add(flatId(...sandPosition));
        if (sandPosition[0] === 500 && sandPosition[1] === 0) return false;
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
// partOne("input_14.txt");
// partTwo("input_14_small.txt");
partTwo("input_14.txt");
