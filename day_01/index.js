const fs = require("fs");

function getDeerCaloriesSum(deers) {
  return deers.map((deer) =>
    deer
      .filter((food) => food)
      .map((food) => parseInt(food, 10))
      .reduce((sum, f) => sum + f, 0)
  );
}

async function partTwo(fileName) {
  try {
    const fileBuffer = await fs.promises.readFile(fileName);
    const file = fileBuffer.toString();
    const deers = file.split("\n\n").map((line) => line.split("\n"));

    const result = getDeerCaloriesSum(deers);

    result.sort((a, b) => (parseInt(a) > parseInt(b) ? -1 : 1));

    const sumTop3 = result.slice(0, 3).reduce((sum, cal) => sum + cal, 0);
    console.log(sumTop3);
  } catch (error) {
    console.error("There was an error reading the file", error);
  }
}

async function partOne(fileName) {
  try {
    const fileBuffer = await fs.promises.readFile(fileName);
    const file = fileBuffer.toString();
    const deers = file.split("\n\n").map((line) => line.split("\n"));

    const result = getDeerCaloriesSum(deers);

    result.sort((a, b) => (parseInt(a) > parseInt(b) ? -1 : 1));

    console.log(result[0]);
  } catch (error) {
    console.error("There was an error reading the file", error);
  }
}

partOne("input_01.txt");
partTwo("input_01.txt");
