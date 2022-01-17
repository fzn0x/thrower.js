import { Console } from "console";
import { Transform } from "stream";

var yellow = "\u001b[33m";
var red = "\u001b[31m";
var clear = "\u001b[39m";

function consoleTable(input) {
  const ts = new Transform({
    transform(chunk, _, cb) {
      cb(null, chunk);
    },
  });
  const logger = new Console({ stdout: ts });

  logger.table(input);

  const table = (ts.read() || "").toString();
  let result = "";
  for (let row of table.split(/[\r\n]+/)) {
    let r = row.replace(/[^┬]*┬/, "┌");
    r = r.replace(/^├─*┼/, "├");
    r = r.replace(/│[^│]*/, "");
    r = r.replace(/^└─*┴/, "└");
    r = r.replace(/'/g, " ");
    result += `${r}\n`;
  }
  console.log(result);
}

// Get trace result only
function getTraceOnly(stackTrace) {
  if (typeof stackTrace !== "string") {
    return;
  }

  const stack = stackTrace.split("\n");
  stack.splice(0, 1);

  return stack.map((value, i) => {
    return {
      number: i + 1, // number of trace
      trace: value, // trace result
      call: i === 0, // where throw called
      source: i > 0, // source of throw
    };
  });
}

function InvalidInstance(message) {
  this.name = "InvalidInstance";
  this.message = message;
}

function stylesError(error) {
  if (!error) error = {};

  if (error.hasOwnProperty("name")) {
    console.log(red, `Getting error named "${error.name}"`, clear);
  }

  if (error.hasOwnProperty("message")) {
    console.log(yellow, `Error message: "${error.message}"`, clear);
  }

  if (error.hasOwnProperty("stack")) {
    consoleTable(getTraceOnly(error.stack));
  }
}

export default function (error) {
  console.time("Throw time");
  if (error instanceof Error) {
    stylesError(error);
    console.timeEnd("Throw time");
    return error;
  }

  const invalidInstanceError = new InvalidInstance(
    `${error} is not instance of ${Error}`
  );
  stylesError(invalidInstanceError);
  console.timeEnd("Throw time");
}
