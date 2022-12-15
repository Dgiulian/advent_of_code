const fs = require("fs");

async function getInput(fileName) {
  if (!fileName) {
    throw new Error("Missing filename Argument");
  }
  const fileBuffer = await fs.promises.readFile(fileName);
  const file = fileBuffer.toString();
  /* @type string[] */
  const groups = file.split("\n\n").filter((line) => line);

  return groups;
}

function comparePair(/** @type [string, string] */ pair) {
  const [left, right] = pair.split("\n").map((line) => JSON.parse(line));

  for (let i = 0; i < left.length; i++) {
    const A = left[i];
    const B = right[i] ?? null;
    compareValues(A, B);
  }
}

function compareValues(A, B) {
  if (typeof A === "number") {
    if (typeof "B" === "number") {
    }
  } else {
    if (typeof "B" === "number") {
    }
  }
}

async function partOne(fileName) {
  /** @type string */
  const pairs = await getInput(fileName);
  for (let pair of pairs) {
    comparePair(pair);
  }
}

partOne("input_13_small.txt");
// partOne("input_13.txt");
