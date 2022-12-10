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
  const instructions = await getInput(fileName);
  const checks = [20, 60, 100, 140, 180, 220];
  let X = 1;
  let cycleCount = 0;
  let signalStrength = 0;
  for (let instruction of instructions) {
    if (instruction === "noop") {
      cycleCount += 1;
      if (checks.includes(cycleCount)) {
        console.log({ cycleCount, X, signal: X * cycleCount });
        signalStrength += X * cycleCount;
      }
    } else {
      const [, V] = instruction.split(" ");
      for (let i = 0; i < 2; i++) {
        cycleCount += 1;

        if (checks.includes(cycleCount)) {
          console.log({ cycleCount, X, signal: X * cycleCount });
          signalStrength += X * cycleCount;
        }
        if (i == 1) {
          X += Number(V);
        }
      }
    }
  }
  console.log(signalStrength);
}

// partOne("input_10_small.txt");
partOne("input_10.txt");
