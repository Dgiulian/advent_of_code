const Graph = require("graph-data-structure");
const fs = require("fs");

function calculateResult(input) {
  const grid = input.split("\n");
  var graph = new Graph();

  function findLocation(ch) {
    const flatIndex = grid.join("").indexOf(ch);
    return [Math.floor(flatIndex / grid[0].length), flatIndex % grid[0].length];
  }

  function isAllowed(ch1, ch2) {
    /* This is a hack to make the graph work. The graph is built on the assumption that the letters are
    in alphabetical order. */
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

  function flatId(i, j) {
    return `${i} ${j} ${grid[i][j]}`;
  }

  const startId = flatId(...findLocation("S"));
  const destId = flatId(...findLocation("E"));

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (i > 0 && isAllowed(grid[i - 1][j], grid[i][j])) {
        let top = flatId(i - 1, j);
        graph.addEdge(flatId(i, j), top);
      }

      if (i < grid.length - 1 && isAllowed(grid[i + 1][j], grid[i][j])) {
        let bottom = flatId(i + 1, j);
        graph.addEdge(flatId(i, j), bottom);
      }

      if (j < grid[0].length - 1 && isAllowed(grid[i][j + 1], grid[i][j])) {
        let right = flatId(i, j + 1);
        graph.addEdge(flatId(i, j), right);
      }

      if (j > 0 && isAllowed(grid[i][j - 1], grid[i][j])) {
        let left = flatId(i, j - 1);
        graph.addEdge(flatId(i, j), left);
      }
    }
  }

  return graph.shortestPath(startId, destId).length - 1;
}

let input = `Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi`;

async function partOne(fileName) {
  if (!fileName) {
    throw new Error("Missing filename Argument");
  }
  const fileBuffer = await fs.promises.readFile(fileName);
  const input = fileBuffer.toString();
  console.log(calculateResult(input)); // 31
}

// partOne("input_12.txt");
partOne("input_12_small.txt");
