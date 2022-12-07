const fs = require("fs");

// A, X -> Rock -> 1
// B, Y -> Paper -> 2
// C, Z -> Scissor -> 3

/**
 *
 * Score
 * Loss -> 0
 * Draw -> 3
 * Win -> 6
 *
 */
const shape_values = { X: 1, Y: 2, Z: 3 };
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
};

async function partOne(fileName) {
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

partOne("input_02.txt");
