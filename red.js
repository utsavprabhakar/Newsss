/**
 * 1. this code uses risk comment + section name as a boundary. Please keep covid update at the top since its
 *    text wont have a 'risk comment' string.
 *
 * 2. Format of covid update should be as follows
 *    Coronavirus Update
 *    Heading
 *    National coronavirusUpdate line
 *    International coronavirus update line
 *
 * 3.
 */

const fs = require("fs");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = new JSDOM("").window;
global.document = document;

let lines;
let newsList = [];

const HEADING = "heading";
const INTRO = "intro";
const RISKCOMMENT = "riskComment";

const COVID = "Coronavirus Update";
const NATIONAL = "National";
const NORTH = "North";
const SOUTH = "South";
const EAST = "East";
const WEST = "West";
const INTERNATIONAL = "International";

// // jQuery
// $.getScript('/path/to/imported/script.js', function()
// {
//     // script is now loaded and executed.
//     // put your dependent JS here.
// });

class News {
  #heading;
  #intro;
  #riskComment;
  #section;
  #sectionNumber;
  #newsNumber;

  constructor() {}

  get heading() {
    return this.#heading;
  }

  get intro() {
    return this.#intro;
  }

  get riskComment() {
    return this.#riskComment;
  }

  get sectionNumber() {
    return this.#sectionNumber;
  }

  get newsNumber() {
    return this.#newsNumber;
  }

  get section() {
    return this.#section;
  }

  set heading(heading) {
    this.#heading = heading;
  }

  set intro(intro) {
    this.#intro = intro;
  }

  set riskComment(riskComment) {
    this.#riskComment = riskComment;
  }

  set sectionNumber(sectionNumber) {
    this.#sectionNumber = sectionNumber;
  }

  set newsNumber(newsNumber) {
    this.#newsNumber = newsNumber;
  }

  set section(section) {
    this.#section = section;
  }
}

fs.readFile("./input.txt", "utf8", function (err, data) {
  deleteFileIfExists();

  if (err) {
    return console.log(err);
  }
  const splitLines = (str) => str.split(/\r?\n/);
  lines = splitLines(data)
    .map((line) => {
      return line.trim();
    })
    .filter((line) => line !== "");

  parseInputFile();
  let finalHtmlString = "";

  for (var i = 0; i < newsList.length; i++) {
    finalHtmlString =
      finalHtmlString +
      createHtml(
        newsList[i].section,
        newsList[i].heading,
        newsList[i].intro,
        newsList[i].riskComment,
        newsList[i].sectionNumber,
        newsList[i].newsNumber
      );
  }

  const finalData = getHeaderHtml() + finalHtmlString + getFooterHtml();
  writeFile(process(finalData));
  // console.log(getHeaderHtml() + finalHtmlString + getFooterHtml());
});

function parseInputFile() {
  let sectionNumber = -1;
  let newsNumber = 0;
  let displacementNumber = 0;
  let currentSection;

  for (let lineNumber in lines) {
    let line = lines[lineNumber];

    // if line == section, all counters return to 0, ++section  continue
    // if prev line == section || prev line == risk comment, make new object, displacement = 0;
    // if line == risk comment, newsCounter++
    // displacement ++;

    if (isSection(line)) {
      currentSection = getSection(line);
      sectionNumber++;
      //reset counters
      newsNumber = 0;
      displacementNumber = 0;
      continue;
    }

    //prevline == risk comment || section indicates new object needs to be made for the data, older object is complete.
    // not creating obj in isSection(see above) && riskcomment(see below) checks since this can lead to two objects made if a section is ending
    let prevLine = lines[lineNumber - 1];
    if (isSection(prevLine) || isRiskComment(prevLine)) {
      let newNewsObj = new News();
      newsList.push(newNewsObj);
      displacementNumber = 0;
    }

    let currentNewsObject = newsList[newsList.length - 1];
    let newsFieldName = getNewsFieldNameFromDisplacement(displacementNumber);
    populateRequiredFieldInObject(
      newsFieldName,
      currentNewsObject,
      getContentFromLine(line, newsFieldName)
    );

    // set the counters in the object for executing html creation logic later on
    currentNewsObject.sectionNumber = sectionNumber;
    currentNewsObject.newsNumber = newsNumber;
    currentNewsObject.section = currentSection;

    // For sections having >1 news,
    if (isRiskComment(line)) {
      newsNumber++;
    }
    displacementNumber++;
  }
}

function getNewsFieldNameFromDisplacement(displacement) {
  if (displacement === 0) {
    return HEADING;
  } else if (displacement === 1) {
    return INTRO;
  } else if (displacement === 2) {
    return RISKCOMMENT;
  } else {
    // TODO error handling if displacement is some other value
  }
}

function populateRequiredFieldInObject(
  newsFieldName,
  currentNewsObject,
  lineContent
) {
  if (newsFieldName === HEADING) {
    currentNewsObject.heading = lineContent;
  }

  if (newsFieldName === INTRO) {
    currentNewsObject.intro = lineContent;
  }

  if (newsFieldName === RISKCOMMENT) {
    currentNewsObject.riskComment = lineContent;
  }
}

function getContentFromLine(line, newsFieldName) {
  if (newsFieldName === HEADING || newsFieldName === INTRO) {
    return line;
  }

  let riskCommentOption1 = "risk comment:";
  let riskCommentOption2 = "risk comment :";

  if (line.toLowerCase().indexOf(riskCommentOption1) !== -1) {
    return line.substring(
      line.toLowerCase().indexOf(riskCommentOption1) + riskCommentOption1.length
    );
  }

  if (line.toLowerCase().indexOf(riskCommentOption2) !== -1) {
    return line.substring(
      line.toLowerCase().indexOf(riskCommentOption2) + riskCommentOption2.length
    );
  }

  //TODO error if no risk
  return line;
}

function createHtml(section, heading, intro, risk, sectionNumber, newsNumber) {
  // factory type method. Selecting template based on sectionNumber and newsNumber

  if (section === COVID) {
    return getCovidHTML(section, heading, intro, risk);
  } else {
    return getNonCovidHtmlBasedOnNewsNumber(
      section,
      heading,
      intro,
      risk,
      newsNumber
    );
  }
}

function getCovidHTML(section, heading, intro, risk) {
  return (
    "<tr> <td class='top_news'> <h3><span><b>" +
    section +
    "</b></span></h3> <div class='first_news_div'> <h3 class='first_news_h3'>" +
    heading +
    "</h3> <p class='p_intro'><span style='color:#b91c12 !important;font-size:20px !important'><b>India: </b></span>" +
    intro +
    "</p> </div> </td> </tr> <tr> <td class='td_others'> <div style='border-right:3px solid #b91c12 !important;border-left:3px solid #555555 !important;padding-left:20px !important;padding-right:20px !important;'> <p class='para'><span style='color:#b91c12 !important;font-size:20px !important'><b>International: </b></span>" +
    risk +
    "</p> </div> </td> </tr>"
  );
}

function getNonCovidHtmlBasedOnNewsNumber(
  section,
  heading,
  intro,
  risk,
  newsNumber
) {
  if (newsNumber === 0) {
    return (
      "<tr><td class='td_states'><h3><span><b>" +
      section +
      "</b></span></h3><div class='first_news_div'><h3 class='first_news_h3'>" +
      heading +
      "</h3><p class='p_intro'>" +
      intro +
      "</p></div></td></tr><tr><td class='td_others'><div style='border-right:3px solid #b91c12 !important;border-left:3px solid #555555 !important;padding-left:20px !important;padding-right:20px !important;'><p  class = 'para'><span style='color:#b91c12 !important;font-size:20px !important'><b>Risk Comment:</b></span> " +
      risk +
      "</p></div></td></tr>"
    );
  } else {
    return (
      "<tr> <td class='td_others'> <div class='second_news_div'>" +
      "<h3 class='second_news_h3'>" +
      heading +
      "</h3><p class='p_intro'>" +
      intro +
      "</p> </div> </td> </tr> <tr> <td class='td_others'> <div style='border-right:3px solid #b91c12 !important;border-left:3px solid #555555 !important;padding-left:20px !important;padding-right:20px !important;'> <p class='para'><span style='color:#b91c12 !important;font-size:20px !important'><b>Risk Comment:</b></span>" +
      risk +
      "</p> </div> </td> </tr>"
    );
  }
}

function getHeadingList() {
  let headings = [COVID, NATIONAL, NORTH, SOUTH, EAST, WEST, INTERNATIONAL].map(
    (item) => {
      return item.toLowerCase(); //Data can be in any case, hence compare in lower case only
    }
  );
  return headings;
}

// TODO
function preliminaryValidation() {
  // 1. check if all headings are proper syntax, callout if some heading is missing (north, south etc) or some weird heading present
  // 2. check if risk comment is present at displacement 3 for all -> can be a case when heading/intro are of two lines
  // 3. validate coronavirus section (stuff like coronavirus update, india, global should not be present)
}

function isSection(line) {
  return getHeadingList().includes(line.toLowerCase());
}

function getSection(line) {
  return line.charAt(0).toUpperCase() + line.slice(1);
}

function isRiskComment(line) {
  return line.toLowerCase().includes("risk comment");
}

function getHeaderHtml() {
  return (
    "<div>" +
    "<table align='center' cellspacing='10px' cellpadding='0'>" +
    "<tr>" +
    "<td><img src='http://kcom.work/sis-emailer4/01.jpg' style='display:block' width='900'></td>" +
    "</tr>"
  );
}

function getFooterHtml() {
  return (
    "<tr> <td><img src='http://kcom.work/sis-emailer4/02.jpg' style='display:block;margin-top:30px" +
    "!important' width='900'> </td> </tr> </table> </div> <style> table { width: 750px !important; border-collapse:" +
    "collapse !important; border: 1px solid #e8e8e8 !important } h3 span { color: #b91c12 !important; background: #cfcdcd" +
    "!important; font-family: 'calibri'; font-size: 30px !important; padding-left: 25px; padding-right: 25px; padding-top:" +
    "3px; padding-bottom: 3px; margin-bottom: 5px !important; margin-bottom: 0px; } .top_news { padding-left: 45px !important;" +
    "padding-right: 45px !important; padding-top: 50px !important } .first_news_div { border-left: 3px solid #b91c12 !important;" +
    "border-right: 3px solid #555555 !important; padding-left: 20px !important; padding-right: 20px !important; padding-top: 0px !important }" +
    ".second_news_div { border-left: 3px solid #b91c12 !important; border-right: 3px solid #555555 !important; padding-left: 20px !important;" +
    "padding-right: 20px !important; } .first_news_h3 { font-family: 'calibri'; font-size: 20px !important; color: #b91c12 !important; margin-bottom:" +
    "7px; } .second_news_h3 { font-family: 'calibri'; font-size: 20px !important; color: #b91c12 !important; margin-bottom: 7px" +
    "!important; margin-top: 7px !important; } .td_states { padding-left: 45px !important; padding-right: 45px !important; padding-top:" +
    "10px !important } .td_others { padding-left: 45px !important; padding-right: 45px !important; } .p_intro { font-family: 'calibri';" +
    "font-size: 16px; color: #333333 !important; margin-bottom: 15px !important; margin-top: 7px !important; text-align: justify !important;" +
    "} .para { font-family: 'calibri'; font-size: 16px; color: #333333 !important; margin-top: 7px !important; margin-bottom: 15px !important;" +
    "text-align: justify !important; } </style>"
  );
}

function writeFile(data) {
  fs.writeFile("./sis.html", data, (err) => {
    // In case of a error throw err.
    if (err) throw err;
  });
}

function process(str) {
  var div = document.createElement("div");
  div.innerHTML = str.trim();

  return format(div, 0).innerHTML;
}

function format(node, level) {
  var indentBefore = new Array(level++ + 1).join("  "),
    indentAfter = new Array(level - 1).join("  "),
    textNode;

  for (var i = 0; i < node.children.length; i++) {
    textNode = document.createTextNode("\n" + indentBefore);
    node.insertBefore(textNode, node.children[i]);

    format(node.children[i], level);

    if (node.lastElementChild == node.children[i]) {
      textNode = document.createTextNode("\n" + indentAfter);
      node.appendChild(textNode);
    }
  }

  return node;
}

function deleteFileIfExists() {
  try {
    fs.unlinkSync("./sis.html");

    console.log("File is deleted.");
  } catch (error) {
    console.log(error);
  }
}
