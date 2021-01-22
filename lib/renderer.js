"use strict";

module.exports = function renderer(options) {
  return function render(tokens, idx) {
    const { tag, arg } = tokens[idx].info;
    const args = arg.split("::");
    return options[tag](...args);
  };
};
