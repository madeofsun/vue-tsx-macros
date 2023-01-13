const fs = require("node:fs");
const path = require("node:path");
const transformWithPlugin = require("../helpers/transform-with-plugin");

describe("examples", () => {
  test.each(loadSamples())("%s", (_, code) => {
    expect(transformWithPlugin(code, {})).toMatchSnapshot();
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
