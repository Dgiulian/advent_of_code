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

function parseField(lines) {
  const field = [];
  for (let line of lines) {
    field.push(line.split("").map(Number));
  }
  return field;
}

async function partOne(fileName) {
  /** @type string */
  const input = await getInput(fileName);
  const field = parseField(input);
  let visibleTreesCount = (field.length - 2) * 2 + field[0].length * 2;
  console.log(visibleTreesCount);

  for (let i = 1; i < field.length - 1; i++) {
    for (let j = 1; j < field.length - 1; j++) {
      console.log(i, j, field[i][j], isVisible(field, i, j));
      if (isVisible(field, i, j)) {
        // console.log(i, j, field[i][j]);
        visibleTreesCount += 1;
      }
    }
  }
  console.log(visibleTreesCount);
}

function isVisible(field, i, j) {
  const TREE = field[i][j];
  let CANDIDATES = [];
  for (let r = 0; r < i; r++) {
    const CANDIDATE = field[r][j];
    CANDIDATES.push(CANDIDATE);
  }
  if (TREE > Math.max(...CANDIDATES)) {
    return true;
  }

  CANDIDATES = [];
  for (let r = i + 1; r < field.length; r++) {
    const CANDIDATE = field[r][j];
    CANDIDATES.push(CANDIDATE);
  }
  if (TREE > Math.max(...CANDIDATES)) {
    return true;
  }

  CANDIDATES = [];
  for (let c = 0; c < j; c++) {
    const CANDIDATE = field[i][c];
    CANDIDATES.push(CANDIDATE);
  }
  if (TREE > Math.max(...CANDIDATES)) {
    return true;
  }

  CANDIDATES = [];
  for (let c = j + 1; c < field[0].length; c++) {
    const CANDIDATE = field[i][c];
    CANDIDATES.push(CANDIDATE);
  }
  if (TREE > Math.max(...CANDIDATES)) {
    return true;
  }
  return false;
}

async function partTwo(fileName) {
  /** @type string */
  const [input] = await getInput(fileName);
}

// partOne("input_08_small.txt");
partOne("input_08.txt");
