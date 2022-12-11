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

async function partOne(fileName) {
  /** @type string */
  const [input] = await getInput(fileName);
  console.log(input.length);
  const packetSize = 4;
  for (let i = packetSize; i < input.length; i++) {
    const candidate = input.substring(i, i - packetSize);

    const charSet = new Set();
    for (let char of candidate) {
      charSet.add(char);
    }
    if (charSet.size === packetSize) {
      console.log(candidate, i);
      break;
    }
  }
}

async function partTwo(fileName) {
  /** @type string */
  const [input] = await getInput(fileName);
  console.log(input.length);
  const packetSize = 14;
  for (let i = packetSize; i < input.length; i++) {
    const candidate = input.substring(i, i - packetSize);

    const charSet = new Set();
    for (let char of candidate) {
      charSet.add(char);
    }
    if (charSet.size === packetSize) {
      console.log(candidate, i);
      break;
    }
  }
}

partOne("input_06.txt");
partTwo("input_06.txt");
// partOne("input_06_small.txt");
