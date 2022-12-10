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

function drawPixel(cycleCount, X) {
  let row = Math.floor(cycleCount / 40);
  let col = cycleCount % 40;

  const sprite = X - 1;
  if (col >= X - 1 && col <= X + 1) {
    CRT[row][col] = "#";
  }
  console.log({ cycleCount, row, col });
}

let CRT = Array.from({ length: 6 }).map(() =>
  Array.from({ length: 40 }).fill(" ")
);

async function partTwo(fileName) {
  const instructions = await getInput(fileName);
  const checks = [20, 60, 100, 140, 180, 220];
  let X = 1;
  let cycleCount = 0;
  let signalStrength = 0;

  for (let instruction of instructions) {
    if (instruction === "noop") {
      drawPixel(cycleCount, X);
      cycleCount += 1;
      if (checks.includes(cycleCount)) {
        // console.log({ cycleCount, X, signal: X * cycleCount });
        signalStrength += X * cycleCount;
      }
    } else {
      const [, V] = instruction.split(" ");
      for (let i = 0; i < 2; i++) {
        drawPixel(cycleCount, X);
        cycleCount += 1;
        if (checks.includes(cycleCount)) {
          // console.log({ cycleCount, X, signal: X * cycleCount });
          signalStrength += X * cycleCount;
        }
        if (i == 1) {
          X += Number(V);
        }
      }
    }
  }
  console.log(signalStrength);
  for (let i = 0; i < CRT.length; i++) {
    console.log(CRT[i].join(""));
  }
}

// partOne("input_10_small.txt");
// partOne("input_10.txt");
partTwo("input_10.txt");
