const fs = require("fs");

/**
 *
 * Score
 * Loss -> 0
 * Draw -> 3
 * Win -> 6
 *
 */
const shape_values = { X: 1, Y: 2, Z: 3, A: 1, B: 2, C: 3 };

const scores = {
  AX: 3,
  AY: 6,
  AZ: 0,
  BX: 0,
  BY: 3,
  BZ: 6,
  CX: 6,
  CY: 0,
  CZ: 3,

  AA: 3,
  AB: 6,
  AC: 0,

  BA: 0,
  BB: 3,
  BC: 6,
  CA: 6,
  CB: 0,
  CC: 3,
};

async function partOne(fileName) {
  // A, X -> Rock -> 1
  // B, Y -> Paper -> 2
  // C, Z -> Scissor -> 3
  const fileBuffer = await fs.promises.readFile(fileName);
  const file = fileBuffer.toString();
  const plays = file
    .split("\n")
    .filter((line) => line)
    .map((line) => line.split(" "));

  const rounds = [];

  for (let i = 0; i < plays.length; i += 3) {
    rounds.push([...plays.slice(i, i + 3)]);
  }
  let totalScore = 0;
  for (let round of rounds) {
    const sum = round.reduce((acum, play) => {
      return acum + scores[play.join("")] + shape_values[play[1]];
    }, 0);

    totalScore += sum;
  }
  console.log(totalScore);
  return totalScore;
}

async function partTwo(fileName) {
  /*
  X -> Loose
  Y -> Draw
  Z -> Win
  A, X -> Rock -> 1
  B, Y -> Paper -> 2
  C, Z -> Scissor -> 3
  */
  const complement_shapes = {
    A: {
      X: "C",
      Y: "A",
      Z: "B",
    },
    B: {
      X: "A",
      Y: "B",
      Z: "C",
    },
    C: {
      X: "B",
      Y: "C",
      Z: "A",
    },
  };

  const fileBuffer = await fs.promises.readFile(fileName);
  const file = fileBuffer.toString();
  const plays = file
    .split("\n")
    .filter((line) => line)
    .map((line) => line.split(" "));

  const rounds = [];

  for (let i = 0; i < plays.length; i += 3) {
    rounds.push([...plays.slice(i, i + 3)]);
  }
  let totalScore = 0;
  for (let round of rounds) {
    const sum = round.reduce((acum, play) => {
      return (
        acum +
        scores[[play[0], complement_shapes[play[0]][play[1]]].join("")] +
        shape_values[complement_shapes[play[0]][play[1]]]
      );
    }, 0);

    totalScore += sum;
  }
  console.log(totalScore);
  return totalScore;
}

// partOne("input_02.txt");
partTwo("input_02.txt");
