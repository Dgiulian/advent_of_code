const fs = require("fs");

const fileSystem = { "/": {} };
const stack = [fileSystem];
let currentDirectory = fileSystem;
let currentDirectoryName = "";

// const st = {
//   "/": {
//     gqlg: {
//       cfrdsjf: 187654,
//       ntvmgbw: 100589,
//       "zcmfcjhf.tzw": 46922,
//     },
//     hchrwstr: {},
//     lswlpt: {},
//     mzsnhlf: 189381,
//     plmdrbn: {},
//     rjwmjd: {},
//     stqq: {},
//   },
// };

const pt = {
  "/": {
    a: {
      e: {
        i: 584,
      },
      f: 29116,
      g: 2557,
      "h.lst": 62596,
    },
    "b.txt": 14848514,
    "c.dat": 8504156,
    d: {
      j: 4060174,
      "d.log": 8033020,
      "d.ext": 5626152,
      k: 7214296,
    },
  },
};

async function partOne(fileName) {
  const fileBuffer = await fs.promises.readFile(fileName);
  const file = fileBuffer.toString();
  const input = file.split("\n").filter((line) => line);

  for (let command of input) {
    if (command.startsWith("$ cd ")) {
      // Get the directory name
      let nextDirectory = command.replace("$ cd ", "");

      if (nextDirectory === "..") {
        // Navigate to the previous directory
        stack.pop();
        currentDirectory = stack[stack.length - 1];
      } else {
        // Navigate to the next directory
        currentDirectory = currentDirectory[nextDirectory];

        stack.push(currentDirectory);
      }
    } else if (command.startsWith("$ ls")) {
      /* List directory entries */
    } else if (command.startsWith("dir ")) {
      /* Navigate to new Directory */
      const [, dirName] = command.split(" ");

      currentDirectory[dirName] ??= {};
    } else if (command.match(/(\d+) (.+)/)) {
      const [, size, name] = command.match(/(\d+) (.*)/);
      currentDirectory ??= {};
      currentDirectory[name] = parseInt(size);
    } else {
      throw new Error("Command not handled", command);
    }
  }

  calculateDirectorySize(fileSystem["/"]);

  getCandidateDirectorySum(fileSystem["/"]);
  const fileSystemSum = fileSystem["/"].size;
  const directorySizes = getDirectoriesSizes(fileSystem["/"]);
  directorySizes.sort((a, b) => (a < b ? -1 : 1));
  const freeSpace = 70000000 - fileSystemSum;
  console.log({ freeSpace, fileSystemSum });

  for (let size of directorySizes) {
    if (freeSpace + size > 30000000) {
      console.log(size);
      return;
    }
  }

  // console.log(JSON.stringify(fileSystem, null, 2));
}

function getCandidateDirectorySum(directory) {
  let sum = 0;
  for (let [key, value] of Object.entries(directory)) {
    if (key === "size" && value < 100000) {
      sum += value;
    } else {
      if (typeof value === "object") {
        sum += getCandidateDirectorySum(value);
      }
    }
  }
  return sum;
}

function getDirectoriesSizes(directory) {
  const sizes = [];
  for (let [key, value] of Object.entries(directory)) {
    if (key === "size") {
      sizes.push(value);
    } else {
      if (typeof value === "object") {
        sizes.push(...getDirectoriesSizes(value, sizes));
      }
    }
  }
  return sizes;
}

function calculateDirectorySize(directory) {
  let dirSize = 0;
  for (let [key, value] of Object.entries(directory)) {
    if (key === "size") continue;
    if (typeof value === "object") {
      dirSize += calculateDirectorySize(value);
    } else {
      dirSize += value;
    }
  }
  directory["size"] = dirSize;
  return dirSize;
}

partOne("input_07.txt");
