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
  const input = await getInput(fileName);
  const field = parseField(input);
  let visibleTreesCount = (field.length - 2) * 2 + field[0].length * 2;
  console.log(visibleTreesCount);

  const scenicScores = [];
  let i = 3;
  let j = 2;
  // for (let i = 1; i < field.length - 1; i++) {
  scenicScores[i] = [];
  // for (let j = 1; j < field.length - 1; j++) {
  const filteredCandidates = [];
  const TREE = field[i][j];

  console.log("Tree: ", TREE);

  let CANDIDATES = [];
  let minHeight = TREE;
  for (let r = i; r >= 0; r--) {
    const CANDIDATE = field[r][j];
    if (CANDIDATE > minHeight) {
      CANDIDATES.push(CANDIDATE);
      break;
    }
    minHeight = Math.min(minHeight, CANDIDATE);
    CANDIDATES.push(CANDIDATE);
  }

  console.log("Top", CANDIDATES);

  filteredCandidates.push(CANDIDATES.length);
  CANDIDATES = [];
  for (let r = i + 1; r < field.length; r++) {
    const CANDIDATE = field[r][j];

    if (CANDIDATE > minHeight) {
      CANDIDATES.push(CANDIDATE);
      break;
    }
    minHeight = Math.min(minHeight, CANDIDATE);

    CANDIDATES.push(CANDIDATE);
  }
  console.log("Bottom", CANDIDATES);
  filteredCandidates.push(CANDIDATES.length);

  CANDIDATES = [];
  for (let c = j; c >= 0; c--) {
    const CANDIDATE = field[i][c];
    if (CANDIDATE > minHeight) {
      CANDIDATES.push(CANDIDATE);
      break;
    }
    minHeight = Math.min(minHeight, CANDIDATE);
    CANDIDATES.push(CANDIDATE);
  }
  console.log("Left", CANDIDATES);
  filteredCandidates.push(CANDIDATES.length);

  CANDIDATES = [];
  for (let c = j + 1; c < field[0].length; c++) {
    const CANDIDATE = field[i][c];
    if (CANDIDATE > minHeight) {
      CANDIDATES.push(CANDIDATE);
      break;
    }
    minHeight = Math.min(minHeight, CANDIDATE);
    CANDIDATES.push(CANDIDATE);
  }
  console.log("Right", CANDIDATES);

  filteredCandidates.push(CANDIDATES.length);
  console.log(filteredCandidates);
  const scenicScore = filteredCandidates.reduce((acc, x) => acc * x);
  scenicScores[i][j] = scenicScore;
  //   }
  // }

  for (let i = 0; i < field.length - 1; i++) {
    console.log(scenicScores[i]);
  }
}

// partOne("input_08_small.txt");
// partOne("input_08.txt");

partTwo("input_08_small.txt");
