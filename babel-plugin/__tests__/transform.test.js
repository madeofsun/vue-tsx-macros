const fs = require("node:fs");
const path = require("node:path");

const babel = require("@babel/core");
const plugin = require("../index.js");

describe("examples", () => {
  test.each(loadSamples())("%s", (_, code) => {
    expect(transform(code)).toMatchSnapshot();
  });
});

function loadSamples() {
  const dir = path.resolve(__dirname, "..", "..", "examples");
  return fs
    .readdirSync(dir)
    .filter((fileName) => fileName.endsWith(".ts") || fileName.endsWith(".tsx"))
    .map((fileName) => {
      return [
        fileName,
        fs.readFileSync(path.resolve(dir, fileName)).toString(),
      ];
    });
}

/**
 * @param {string} code
 * @returns {string}
 */
function transform(code) {
  return (
    babel.transformSync(code, {
      plugins: [["@babel/plugin-syntax-typescript", { isTSX: true }], plugin],
    })?.code || ""
  );
}
