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

function parseMonkeys(lines, divideBy) {
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
      const items = getNumbers(line);
      monkeys[monkeyNumber]["items"] = [];
      for (let el of items) {
        const statuses = {};
        divideBy.forEach((toDivide) => {
          statuses[toDivide] = Number(el) % toDivide;
        });
        monkeys[monkeyNumber]["items"].push({
          // raw: el,
          raw: BigInt(el),
          statuses,
        });
      }
    } else if (line.match(/Operation:/gi)) {
      // monkeys[monkeyNumber]["operation"] = getOperation(line);
      monkeys[monkeyNumber]["operation"] = getOperationSol(line);
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
/**  LOG_LEVEL = 'DEBUG' | 'INFO' | 'RESULT';*/

const [DEBUG, INFO, RESULT] = [0, 1, 2];

const LOG_LEVEL = DEBUG;

function log(level, text) {
  if (level >= LOG_LEVEL) {
    console.log(text);
  }
}

function getDividedBy(lines) {
  const dividedBy = [];
  for (let line of lines) {
    if (line.match(/Test: divisible by/gi)) {
      const [divisor] = getNumbers(line);
      dividedBy.push(divisor);
    }
  }
  return dividedBy;
}

async function partTwo(fileName) {
  const lines = await getInput(fileName);
  const divisibleBy = getDividedBy(lines);
  const monkeys = parseMonkeys(lines, divisibleBy);


  // for (let i = 0; i < monkeys.length; i++) {
  //   const monkey = monkeys[i];
  //   console.log(monkey, monkey.items)
  // }
  // log(DEBUG, JSON.stringify(monkeys, null, 2));
  log(DEBUG, "");

  for (let round = 1; round <= 2; round++) {
    for (let i = 0; i < monkeys.length; i++) {
      const monkey = monkeys[i];
      log(0, `Monkey ${i}`);
      const monkeyItems = monkey.items.map((item) => ({ ...item }));
      monkeyItems.forEach((item) => {
        monkey.items.splice(0, 1);
        monkey.inspectionCount += 1;
        log(
          DEBUG,
          `  Monkey inspects an item with a worry level of ${item.raw}`
        );

        console.log(item);
        let newItem = monkey.operation(item);
        // newItem = Math.floor(newItem / 3);
        // log(
        //   DEBUG,
        //   `Monkey gets bored with item. Worry level is divided by 3 to ${newItem}.`
        // );

        let newMonkeyId = monkey["test"];
        if (newItem.statuses[monkey.test] === 0) {
          log(DEBUG, `Current worry level is not divisible by ${monkey.test}.`);
          newMonkeyId = monkey["true"];
        } else {
          log(DEBUG, `Current worry level is divisible by ${monkey.test}.`);
          newMonkeyId = monkey["false"];
        }
        monkeys[newMonkeyId].items.push(newItem);
        log(
          DEBUG,
          `Item with worry level ${newItem.raw} is thrown to monkey ${newMonkeyId}.`
        );
        log(DEBUG, "");
      });
    }
    log(DEBUG, "");
    log(INFO, "");
    log(INFO, `Round ${round}:`);
    for (let i = 0; i < monkeys.length; i++) {
      log(DEBUG, `Monkey ${i}: ${monkeys[i].items}:`);
    }

    for (let i = 0; i < monkeys.length; i++) {
      log(
        INFO,
        `Monkey ${i} inspected items ${monkeys[i].inspectionCount} times`
      );
    }
  }
  // monkeys.sort((a, b) => b.inspectionCount - a.inspectionCount);
  for (let i = 0; i < monkeys.length; i++) {
    log(
      RESULT,
      `Monkey ${i} inspected items ${monkeys[i].inspectionCount} times`
    );
  }
  log(
    RESULT,
    `Part 2 Result:  ${monkeys[0].inspectionCount * monkeys[1].inspectionCount}`
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
  return ({ raw, statuses }) => {
    Object.keys(statuses).forEach((key) => {
      let newValue;
      const operand = operands[1].match(/old/gi)
        ? statuses[key]
        : Number(operands[1]);
      const isByItself = operands[1].match(/old/gi);

      switch (operator) {
        case "+": {
          newValue = statuses[key] + operand;
          break;
        }
        case "-": {
          newValue = statuses[key] - operand;
          break;
        }
        case "*": {
          newValue = statuses[key] * operand;

          break;
        }
        default:
          throw new Error(`Operator ${operator} not handled`);
      }
      if (newValue >= Number(key)) {
        newValue -= Number(key) * Math.floor(newValue / Number(key));
      }
      statuses[key] = newValue;
      log(
        DEBUG,
        `    Worry level ${statuses[key]} is ${operator} by ${operand} to ${newValue}. ${key}`
      );
    });

    return { raw, statuses }; // eval(operands[0] + operator + operands[1]);
  };
}
const getOperationSol = (line) => {
  const tokens = line.replace("  Operation: new = old ", "").split(" ");
  const isMultiply = tokens[0] === "*";
  const isByItself = tokens[1] === "old";
  return ({ raw, statuses }) => {
    console.log(line);

    Object.keys(statuses).forEach((key) => {
      let newNum;
      if (isMultiply) {
        newNum =
          statuses[key] * (isByItself ? statuses[key] : Number(tokens[1]));
      } else {
        newNum = statuses[key] + Number(tokens[1]);
      }
      if (newNum >= Number(key)) {
        newNum -= Number(key) * Math.floor(newNum / Number(key));
      }
      statuses[key] = newNum;
    });
    return { raw, statuses };
  };
};

// partOne("input_11_small.txt");
// partOne("input_11.txt");
// partTwo("input_11_small.txt");
partTwo("input_11.txt");
