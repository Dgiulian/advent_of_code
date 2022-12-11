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

function parseMonkeys(lines) {
  const monkeys = [];
  let monkeyNumber = 0;
  for (let line of lines) {
    console.log(line);
    if (line.startsWith("Monkey")) {
      [monkeyNumber] = getNumbers(line);
      monkeys[monkeyNumber] = {
        inspectionCount: 0,
      };
    } else if (line.startsWith("  Starting items:")) {
      monkeys[monkeyNumber]["items"] = getNumbers(line);
    } else if (line.match(/Operation:/gi)) {
      monkeys[monkeyNumber]["operation"] = getOperation(line);
    } else if (line.match(/Test:/gi)) {
      [monkeys[monkeyNumber]["test"]] = getNumbers(line);
    } else if (line.match(/true/gi)) {
      [monkeys[monkeyNumber]["true"]] = getNumbers(line);
    } else if (line.match(/false/gi)) {
      [monkeys[monkeyNumber]["false"]] = getNumbers(line);
    }
  }
  return monkeys;
}
async function partOne(fileName) {
  const lines = await getInput(fileName);
  const monkeys = parseMonkeys(lines);
  console.log(monkeys);
  console.log("");
  for (let round = 1; round <= 20; round++) {
    for (let i = 0; i < monkeys.length; i++) {
      const monkey = monkeys[i];
      console.log(`Monkey ${i}`);
      const monkeyItems = [...monkey.items];
      monkeyItems.forEach((item) => {
        monkey.items.splice(0, 1);
        monkey.inspectionCount += 1;
        // monkey.items = monkey.items.filter((it) => it === item);
        console.log(`  Monkey inspects an item with a worry level of ${item}`);
        let newItem = monkey.operation(item);
        newItem = Math.floor(newItem / 3);
        console.log(
          `Monkey gets bored with item. Worry level is divided by 3 to ${newItem}.`
        );

        let newMonkeyId = monkey["test"];
        if (newItem % monkey.test === 0) {
          console.log(
            `Current worry level is not divisible by ${monkey.test}.`
          );
          newMonkeyId = monkey["true"];
        } else {
          console.log(`Current worry level is divisible by ${monkey.test}.`);
          newMonkeyId = monkey["false"];
        }
        monkeys[newMonkeyId].items.push(newItem);
        console.log(
          `Item with worry level ${newItem} is thrown to monkey ${newMonkeyId}.`
        );
        console.log("");
      });
    }
    console.log("");
    console.log("");
    console.log(`Round ${round}:`);
    for (let i = 0; i < monkeys.length; i++) {
      console.log(`Monkey ${i}: ${monkeys[i].items}:`);
    }
  }
  monkeys.sort((a, b) => b.inspectionCount - a.inspectionCount);
  for (let i = 0; i < monkeys.length; i++) {
    console.log(
      `Monkey ${i} inspected items ${monkeys[i].inspectionCount} times`
    );
  }
  console.log(
    `Part 1 Result:  ${monkeys[0].inspectionCount * monkeys[1].inspectionCount}`
  );
}

function getNumbers(str) {
  // Use a regular expression to match all sequences of one or more digits in the string
  const matches = str.match(/\d+/g);

  // Convert the matched sequences to numbers using the Number constructor
  return matches ? matches.map(Number) : [];
}

function getOperation(inputString) {
  const matches = inputString.match(/[a-zA-Z0-9]+\s*([+-/*])\s*[a-zA-Z0-9]+/);
  // console.log(matches); // Output: ["old + 7", "+"]
  const [operation, operator] = matches;
  const operands = operation.split(/\s*[+-/*]\s*/);
  // const result = eval(operands[0] + operator + operands[1]);
  //  console.log(result); // Output: 14
  return (old) => {
    const newValue = eval(operands[0] + operator + operands[1]);
    console.log(
      `    Worry level is ${operator} by ${operands[1]} to ${newValue}.`
    );
    return newValue;
  };
}

/**  LOG_LEVEL = 'DEBUG' | 'INFO' | 'RESULT';*/

const [DEBUG, INFO, RESULT] = [0, 1, 2];

const LOG_LEVEL = INFO;

function log(level, text) {
  if (level >= LOG_LEVEL) {
    console.log(text);
  }
}

partOne("input_11_small.txt");
// partOne("input_11.txt");
