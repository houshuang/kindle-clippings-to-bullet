import fs from "fs";
import os from "os";
import lodash from "lodash";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

const nth = function(d) {
  if (d > 3 && d < 21) return "th";
  switch (d % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

const getRoamDate = dateString => {
  const d = new Date(dateString);
  const year = d.getFullYear();
  const date = d.getDate();
  const month = months[d.getMonth()];
  const nthStr = nth(date);
  return `${month} ${date}${nthStr}, ${year}`;
};

const clippingsFile = process.argv[2];
const titleSearch = process.argv[3];
const clippingsRaw = fs.readFileSync(clippingsFile, "utf-8");

const clippings = clippingsRaw.split("==========").map(x => x.trim());
let clipStr = "";
let retainTitle = "";
let firstDate = undefined;
let lastDate = undefined;
const getDate = meta => {
  const dateMatch = meta.match(/Added on (.+)\r/);
  if (dateMatch.length > 1) {
    return dateMatch[1];
  }
};

const titles = [];
clippings.forEach(clip => {
  const [title, meta, ...rest] = clip.split("\n");
  titles.push(title);
  if (title.match(titleSearch)) {
    retainTitle = title;
    if (!firstDate) {
      firstDate = getDate(meta);
    }
    lastDate = getDate(meta);

    let pageStr = "";
    if (meta.includes("page")) {
      const m = meta.match(/page (\d+) /);
      if (m.length > 1) {
        pageStr = ` (p. ${m[1]})`;
      }
    }

    const noteStr = meta.includes("Note") ? " - ^^" : "- ";
    clipStr += `    ${noteStr}${rest.join("").trim()}${noteStr} ${pageStr}\n`;
  }
});

if (titleSearch === "listTitles") {
  console.log([...new Set(titles)].map((x => `- ${x}`)).join("\n"));
  process.exit(0);
}

let dateStr;
if (firstDate && lastDate && firstDate !== lastDate) {
  dateStr = `  - Read from [[${getRoamDate(firstDate)}]] to [[${getRoamDate(
    lastDate
  )}]]\n`;
} else if (firstDate) {
  dateStr = `  - Read on [[${getRoamDate(firstDate)}]]\n`;
}

console.log(`- ${retainTitle}\n${dateStr}  - Clippings:\n${clipStr}`);
