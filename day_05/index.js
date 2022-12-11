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

async function partOne(fileName, /**  @type string[][] */ crates) {
  const movements = await getInput(fileName);

  for (let move of movements) {
    const [, count, , from, , to] = move.split(" ");

    const fromCrate = crates[from - 1];
    const toCrate = crates[to - 1];
    if (!fromCrate) {
      console.log(move);
      console.log(crates);
      return;
    }
    const pickedCrates = fromCrate.splice(fromCrate.length - count, count);
    pickedCrates.reverse();
    toCrate.push(...pickedCrates);
    console.log(move);
    console.log(crates);
  }

  for (let crate of crates) {
    console.log(crate.at(-1));
  }
}

async function partTwo(fileName, /**  @type string[][] */ crates) {
  const movements = await getInput(fileName);

  for (let move of movements) {
    const [, count, , from, , to] = move.split(" ");

    const fromCrate = crates[from - 1];
    const toCrate = crates[to - 1];
    if (!fromCrate) {
      console.log(move);
      console.log(crates);
      return;
    }
    const pickedCrates = fromCrate.splice(fromCrate.length - count, count);
    // pickedCrates.reverse();
    toCrate.push(...pickedCrates);
    console.log(move);
    console.log(crates);
  }

  for (let crate of crates) {
    console.log(crate.at(-1));
  }
}
function parseCrates(/** @type string */ cratesInput) {
  const lines = cratesInput
    .split("\n")
    .map((line) =>
      line.split(",").map((line) => line.replaceAll(/\[|\]/g, ""))
    );
  const crates = [];
  for (line of lines.reverse()) {
    for (let i = 0; i < line.length; i++) {
      const item = line[i].trim();
      if (item) {
        crates[i] ??= [];
        crates[i].push(item);
      }
    }
  }

  return crates;
}

const CRATES = {
  small: [["Z", "N"], ["M", "C", "D"], ["P"], []],
};

// partOne("input_05_small.txt", CRATES.small);

// CRATES["large"] = parseCrates(`
// [W],[V],[] ,[P],[] ,[] ,   ,[] ,[]
// [B],[T],[] ,[C],[B],[] ,[G],[] ,[]
// [G],[S],[] ,[V],[H],[N],[T],[] ,[]
// [Z],[B],[W],[J],[D],[M],[S],[] ,[]
// [R],[C],[N],[N],[F],[W],[C],[] ,[W]
// [D],[F],[S],[M],[L],[T],[L],[Z],[Z]
// [C],[W],[B],[G],[S],[V],[F],[D],[N]
// [V],[G],[C],[Q],[T],[J],[P],[B],[M]
// `);

CRATES["large"] = [
  ["V", "C", "D", "R", "Z", "G", "B", "W"],
  ["G", "W", "F", "C", "B", "S", "T", "V"],
  ["C", "B", "S", "N", "W"],
  ["Q", "G", "M", "N", "J", "V", "C", "P"],
  ["T", "S", "L", "F", "D", "H", "B"],
  ["J", "V", "T", "W", "M", "N"],
  ["P", "F", "L", "C", "S", "T", "G"],
  ["B", "D", "Z"],
  ["M", "N", "Z", "W"],
];

// partOne("input_05.moves.txt", CRATES.large);
partTwo("input_05.moves.txt", CRATES.large);
