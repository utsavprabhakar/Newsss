const fs = require("fs");
const fsPromise = require("fs").promises;
const jsdom = require("jsdom");
const { type } = require("os");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = new JSDOM("").window;
let textToHtml = require("./service");
global.document = document;

async function readFile() {
  return await fsPromise.readFile("./input.txt", "utf8");
}

function changeRedToBlue(data) {
  data = data.replace(/#b91c12/g, "#38B3FF");
  data = data.replace(/<b>East<\/b>/g, "<b>East and North East</b>");
  data = data.replace(
    /http:\/\/kcom.work\/sis-emailer4\/01.jpg/g,
    "http://kcom.work/slv-images/01.jpg"
  );
  data = data.replace(
    /http:\/\/kcom.work\/sis-emailer4\/02.jpg/g,
    "http://kcom.work/slv-images/footer.png"
  );

  return data;
}

async function writeFile(data) {
  return await fsPromise.writeFile("./slv.html", data);
}

function deleteFileIfExists() {
  try {
    console.log("asd");
    fs.unlinkSync("./slv.html");

    console.log("File is deleted.");
  } catch (error) {
    console.log(error);
  }
}

async function copyRedHtmlToInput(src, dest) {
  return await fsPromise.copyFile(src, dest);
}

async function main() {
  await textToHtml.main();
  await copyRedHtmlToInput("sis.html", "input.txt");
  let inputData = await readFile();
  inputData = changeRedToBlue(inputData);
  writeFile(inputData);
}

main();
