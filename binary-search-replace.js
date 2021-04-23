/*
  script to perform multiple search and replace on a file and print out changes made

  Rule file should be a JSON file with array like this:

[
  {
    "find": "some text",
    "replace": "replacement text"
  },
  {
    "find": "more \" text",
    "replace": "replaced ' text"
  }
]
*/

const fs = require("fs");
const print = console.log;

const readRules = (ruleFile) => {
  let rules = [];
  try {
    const rulesString = fs.readFileSync(ruleFile, "utf8");
    rules = JSON.parse(rulesString);
  } catch (e) {}

  if (rules.length === 0) return "Error, could not read rules";

  return rules;
};

const processRules = (inputContent, rules) => {
  if (!Array.isArray(rules)) return null;
  if (typeof inputContent !== "string") return null;

  let totalChanges = 0;
  let newContent = inputContent;
  rules.forEach((rule) => {
    const findHex = Buffer.from(rule.find).toString('hex');
    const replaceHex = Buffer.from(rule.replace).toString('hex');

    const replacer = new RegExp(findHex, "g");

    const foundMatches = (newContent.match(replacer) || []).length;
    totalChanges += foundMatches;
    print(`${foundMatches} ${rule.find} -> ${rule.replace}`);

    newContent = newContent.replace(replacer, replaceHex);
  });

  print(`TOTAL CHANGES: ${totalChanges}`);

  return newContent;
};

const replaceFile = (inputFile, rulesFile) => {
  const rules = readRules(rulesFile);
  if (!Array.isArray(rules)) return print("Could not read rules file");

  let inputContent = null;
  try {
    inputContent = fs.readFileSync(inputFile);
  } catch (e) {}

  if (inputContent === null) return print("Could not read input file");

  const newContent = processRules(inputContent.toString('hex'), rules);
  if (newContent === null) return print("Error processing file");

  const newBuffer = Buffer.from(newContent, 'hex');
  try {
    fs.writeFileSync("new_" + inputFile, newBuffer);
  } catch (e) {
    return print("Error saving file");
  }
};

const showUsage = () => {
  print(`\nUsage: node search_replace.js <input_file> <rule_json_file>\n\n`);
};

if (process.argv.length <= 2) return showUsage();

replaceFile(process.argv[2], process.argv[3]);
