/* eslint-disable @typescript-eslint/no-var-requires */
const { version } = require("./package.json");

const config = {
  productName: "Sideline Sounds",
  appId: "com.robwrowe.sideline-sounds",
  buildVersion: version,
  directories: {
    output: "dist/",
  },
  mac: {
    target: "dmg",
  },
};

module.exports = config;
