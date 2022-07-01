const url = require("node:url");

const baseUri = url.pathToFileURL(__dirname).toString();

const interfaceUri = process.env.NWJS_START_URL
  ? process.env.NWJS_START_URL.trim()
  : `${baseUri}/build/`;

nw.Window.open(interfaceUri);
