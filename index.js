"use strict";

const renderer = require("./lib/renderer");
const tokenizer = require("./lib/tokenizer");

module.exports = function custom_parse_plugin(md, options) {
  md.renderer.rules.custom_parse = renderer(options);
  md.core.ruler.push("custom_parse", tokenizer(md, options));
};
