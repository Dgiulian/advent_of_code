const fs = require("fs");

async function partOne(fileName) {
  const fileBuffer = await fs.promises.readFile(fileName);
  const file = fileBuffer.toString();
  const backpacks = file.split("\n").filter((line) => line);

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

function getGroupBadge(/** @type [string, string, string] */ backpacks) {
  backpacks.sort((a, b) => a.length - b.length);

  const [A, B, C] = backpacks;

  for (let item of A) {
    if (B.includes(item) && C.includes(item)) {
      return item;
    }
  }

  return;
}

async function partTwo(fileName) {
  const fileBuffer = await fs.promises.readFile(fileName);
  const file = fileBuffer.toString();
  const backpacks = file.split("\n").filter((line) => line);

  const groupedBackpacks = [];
  for (let i = 0; i < backpacks.length; i += 3) {
    groupedBackpacks.push(backpacks.slice(i, i + 3));
  }

  const badges = groupedBackpacks.map((group) => getGroupBadge(group));

  const sumValue = badges
    .map((item) => getItemValue(item))
    .reduce((acum, v) => acum + v, 0);
  console.log(sumValue);
}

partTwo("input_03.txt");
