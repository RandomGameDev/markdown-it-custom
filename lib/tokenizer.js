"use strict";

const parseRE = /@\((\w+)\)\[(.+?)\]/;

module.exports = function create_token(md, options) {
  const arrayReplaceAt = md.utils.arrayReplaceAt;

  function splitTextToken(text, level, Token) {
    let token;
    let last_pos = 0;
    const nodes = [];

    text.replace(
      RegExp(parseRE, "g"),
      function (match, p1, p2, offset, string) {
        // Add new tokens to pending list
        if (offset > last_pos) {
          token = new Token("text", "", 0);
          token.content = text.slice(last_pos, offset);
          nodes.push(token);
        }

        token = new Token("custom_parse", "", 0);
        token.markup = "custom-parse";
        token.info = { tag: p1, arg: p2 };
        nodes.push(token);

        last_pos = offset + match.length;
      }
    );

    if (last_pos < text.length) {
      token = new Token("text", "", 0);
      token.content = text.slice(last_pos);
      nodes.push(token);
    }

    return nodes;
  }

  return function token_replace(state, a, b, silent) {
    let i;
    let j;
    let l;
    let tokens;
    let token;
    const blockTokens = state.tokens;
    let autolinkLevel = 0;

    for (j = 0, l = blockTokens.length; j < l; j++) {
      if (blockTokens[j].type !== "inline") {
        continue;
      }

      tokens = blockTokens[j].children;

      // We scan from the end, to keep position when new tags added.
      // Use reversed logic in links start/end match
      for (i = tokens.length - 1; i >= 0; i--) {
        token = tokens[i];

        if (token.type === "link_open" || token.type === "link_close") {
          if (token.info === "auto") {
            autolinkLevel -= token.nesting;
          }
        }

        if (
          token.type === "text" &&
          autolinkLevel === 0 &&
          RegExp(parseRE).test(token.content)
        ) {
          // replace current node
          blockTokens[j].children = tokens = arrayReplaceAt(
            tokens,
            i,
            splitTextToken(token.content, token.level, state.Token)
          );
        }
      }
    }
  };
};
