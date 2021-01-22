"use strict";

const path = require("path");

const markdownit = require("markdown-it");
const generate = require("markdown-it-testgen");

const custom_parse = require("..");

describe("markdown-it-custom", function () {
  const md = markdownit().use(custom_parse, {
    content(name, item) {
      return `<custom name="${name}">${item}</custom>`;
    },
    content3(name, item, id) {
      return `<custom-three name="${name}" id="${id}">${item}</custom-three>`;
    },
  });

  generate(path.join(__dirname, "fixtures/default.txt"), { header: true }, md);
});
