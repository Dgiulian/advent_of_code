const fs = require("fs");

async function partOne(fileName) {
  const fileBuffer = await fs.promises.readFile(fileName);
  const file = fileBuffer.toString();
  const backpacks = file.split("\n").filter((line) => line);
  console.log(backpacks);

  const compartments = backpacks.map((backpack) => {
    const mid = Math.floor(backpack.length / 2);
    return [backpack.slice(0, mid), backpack.slice(mid, backpack.length)];
  });
  const sumValue = compartments
    .map((backpacks) => getDuplicateItem(backpacks))
    .map((item) => getItemValue(item))
    .reduce((acum, v) => acum + v, 0);

  console.log(sumValue);
}

function getDuplicateItem(backpack) {
  /** @type [string, string] */
  const [A, B] = backpack;
  for (let i = 0; i < A.length; i++) {
    if (B.includes(A[i])) {
      return A[i];
    }
  }
}

function getItemValue(/** @type string */ item) {
  const code = item.charCodeAt(0);
  if (code >= 97 && code <= 122) {
    return code - 96;
  } else {
    if (code >= 65 && code <= 90) {
      return code - 64 + 26;
    }
  }
}

partOne("input_03.txt");
