const fs = require("fs");
const lodash = require("lodash");

const getOperation = (line) => {
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
    console.log({ raw, statuses });
    return { raw, statuses };
  };
};

const monkeParser2 = (str, divideBy) => {
  const lines = str.split("\n");

  const testDivisbleBy = Number(lines[3].replace("  Test: divisible by ", ""));

  const items = lines[1]
    .replace("Starting items: ", "")
    .split(", ")
    .map((el) => {
      const statuses = {};
      divideBy.forEach((toDivide) => {
        statuses[toDivide] = Number(el) % toDivide;
      });
      return { raw: BigInt(el), statuses };
    });
  console.log(items);
  const operation = getOperation(lines[2]);

  const targetTrue = Number(
    lines[4].replace("    If true: throw to monkey ", "")
  );
  const targetFalse = Number(
    lines[5].replace("    If false: throw to monkey ", "")
  );

  return {
    items,
    operation,
    targetFalse,
    targetTrue,
    lookedAtItems: 0,
    testDivisbleBy,
  };
};

const processMonkes2 = (monkeArray, iterations) => {
  monkeArray = lodash.cloneDeep(monkeArray);
  for (let i = 0; i < iterations; i++) {
    monkeArray.forEach((monke) => {
      monke.items.forEach((item) => {
        monke.lookedAtItems++;
        item = monke.operation(item);
        console.log(item);

        if (item.statuses[monke.testDivisbleBy] === 0) {
          monkeArray[monke.targetTrue].items.push(item);
        } else {
          monkeArray[monke.targetFalse].items.push(item);
        }
      });

      monke.items = [];
    });
  }
  return monkeArray;
};

const second = () => {
  const allMonkes = fs.readFileSync("input_11.txt").toString().split("\n\n");

  const divideBy = allMonkes.map((el) => {
    const lines = el.split("\n");
    return Number(lines[3].replace("  Test: divisible by ", ""));
  });

  const mapped = allMonkes.map((el) => monkeParser2(el, divideBy));

  const results = processMonkes2(mapped, 10000);
  const scores = results.map((el) => el.lookedAtItems);
  //console.log(scores);
  scores.sort((a, b) => b - a);
  return scores[0] * scores[1];
};

const main = () => {
  // console.log("first", first());
  console.log("second", second());
};

main();
