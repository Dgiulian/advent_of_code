const fs = require("fs");

async function getPairs(fileName) {
  const fileBuffer = await fs.promises.readFile(fileName);
  const file = fileBuffer.toString();
  const input = file.split("\n").filter((line) => line);
  return input.map((line) =>
    line.split(",").map((l) => l.split("-").map(Number))
  );
}

async function partOne(fileName) {
  const pairs = await getPairs(fileName);
  let count = 0;
  for (let pair of pairs) {
    if (isFullyContainedPair(pair)) {
      count += 1;
    }
  }
  console.log(count);
}

function sortTuples(tuples) {
  // Sort the array of tuples in ascending order by their first element, and if the
  // first element is the same, sort by the second element
  return tuples.sort(([a1, b1], [a2, b2]) => {
    if (a1 === a2) {
      return b2 - b1;
    }
    return a1 - a2;
  });
}

function isFullyContainedPair(pair) {
  const sortedPairs = sortTuples(pair);

  const [[start1, end1], [start2, end2]] = sortedPairs;

  return start1 <= start2 && end1 >= end2;
}

function isOverlapped(pair) {
  const sortedPairs = sortTuples(pair);

  const [[start1, end1], [start2, end2]] = sortedPairs;

  if (start1 <= start2 && end1 >= end2) {
    return true;
  } else {
    return start1 <= end2 && end1 >= start2;
  }
}

async function partTwo(fileName) {
  const pairs = await getPairs(fileName);
  let count = 0;
  for (let pair of pairs) {
    if (isOverlapped(pair)) {
      count += 1;
    }
  }
  console.log(count);
}

//partOne("input_04_small.txt");
partOne("input_04.txt");
partTwo("input_04.txt");
