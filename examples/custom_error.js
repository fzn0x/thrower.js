import thrower from "thrower.js";

function CustomError(message) {
  this.name = "CustomError";
  this.message = message;
  this.stack = new Error().stack;
}

CustomError.prototype = Error.prototype;

thrower(new CustomError("Error Example"));
