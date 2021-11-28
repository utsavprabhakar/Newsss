const fs = require("fs");
const jsdom = require("jsdom");
const { type } = require("os");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = new JSDOM("").window;
global.document = document;

function readFile() {
  fs.readFile("./input.txt", "utf8", function (err, data) {
    if (err) {
      return console.log(err);
    }

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

    writeFile(data);
  });
}

function writeFile(data) {
  fs.writeFile("./slv.html", data, (err) => {
    // In case of a error throw err.
    if (err) throw err;
  });
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

deleteFileIfExists;
readFile();
