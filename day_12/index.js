const Graph = require("graph-data-structure");
const fs = require("fs");

async function getInput(fileName) {
  if (!fileName) {
    throw new Error("Missing filename Argument");
  }
  const fileBuffer = await fs.promises.readFile(fileName);
  const file = fileBuffer.toString();
  /* @type string[] */
  const input = file.split("\n").filter((line) => line);

  return input;
}

function flatId(i, j) {
  const value = grid[i][j];
  return `${i} ${j} ${value}`;
}

function parseGrid(lines) {
  const grid = lines.map((line) => line.split(""));

  return grid;
}

function findLocation(value) {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      const cell = grid[i][j];
      if (cell === value) {
        return [i, j];
      }
    }
  }
}
let grid;
const moves = [
  { pos: [1, 0], label: "V" },
  { pos: [-1, 0], label: "^" },
  { pos: [0, -1], label: "<" },
  { pos: [0, 1], label: ">" },
];

async function partOne(fileName) {
  const lines = await getInput(fileName);
  grid = parseGrid(lines);

  const graph = new Graph();

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      const cell = grid[i][j];
      const neighbors = getNeighbors([i, j]);
      for (let neighbor of neighbors) {
        graph.addEdge(flatId(i, j), flatId(...neighbor));
      }
    }
  }

  const start = flatId(...findLocation("S"));
  const end = flatId(...findLocation("E"));

  const shortestPath = graph.shortestPath(start, end);
  console.log(shortestPath.length - 1);
}
async function partTwo(fileName) {
  const lines = await getInput(fileName);
  grid = parseGrid(lines);

  const graph = new Graph();

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      const cell = grid[i][j];
      const neighbors = getNeighbors([i, j]);
      for (let neighbor of neighbors) {
        graph.addEdge(flatId(i, j), flatId(...neighbor));
      }
    }
  }

  const startIds = [flatId(...findLocation("S"))];
  const endId = flatId(...findLocation("E"));

  startIds.push(...graph.nodes().filter((node) => node.endsWith("a")));

  let i = 0;
  const promises = startIds.map((id) => {
    return new Promise((resolve) => {
      try {
        i += 1;
        console.log("running for: " + i + "/" + startIds.length);
        resolve(graph.shortestPath(id, endId).length - 1);
      } catch (error) {
        resolve(Infinity);
      }
    });
  });
  const distances = await Promise.all(promises);

  const minDistance = distances.sort((a, b) => (a > b ? 1 : -1))[0];

  console.log(minDistance);
}

function isAllowed(/** @type string */ ch1, /** @type string */ ch2) {
  if (ch1 == "S") {
    ch1 = "a";
  }
  if (ch2 == "S") {
    ch2 = "a";
  }

  if (ch1 == "E") {
    ch1 = "z";
  }
  if (ch2 == "E") {
    ch2 = "z";
  }

  return ch1.charCodeAt() - ch2.charCodeAt() <= 1;
}

function getNeighbors(currentPos) {
  const neihbors = [];

  const rows = grid.length;
  const cols = grid[0].length;

  for (let move of moves) {
    const r = currentPos[0] + move.pos[0];
    const c = currentPos[1] + move.pos[1];
    if (r >= 0 && r < rows && c >= 0 && c < cols) {
      const cell = grid[currentPos[0]][currentPos[1]];
      if (isAllowed(grid[r][c], cell)) {
        neihbors.push([r, c]);
      }
    }
  }

  return neihbors;
}

// partOne("input_12_small.txt");
partTwo("input_12_small.txt");

// partOne("input_12.txt");
partTwo("input_12.txt");

// test("input_12_small.txt");
