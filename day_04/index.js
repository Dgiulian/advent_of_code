const fs = require("fs");

async function partOne(fileName) {
  const fileBuffer = await fs.promises.readFile(fileName);
  const file = fileBuffer.toString();
  const backpacks = file.split("\n").filter((line) => line);
}

function getDirectorySize() {}

partOne("input_04.txt");
