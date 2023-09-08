const fs = require("fs");
const cheerio = require("cheerio");

const xlsx = require("xlsx");

function getPlayerScores(html, venue, date, team1, team2) {
  let $ = cheerio.load(html);

  let table = $(".ci-scorecard-table");

  let team1Players = $(table[0]).find("tbody>tr:not(.ds-hidden)");
  let team2Players = $(table[1]).find("tbody>tr:not(.ds-hidden)");

  let data = [];

  team1Players.each(function () {
    if ($(this).hasClass("ds-text-tight-s")) return false;
    let playerName = $(this).find("a").attr("title");

    let filePath = `ipl/${team1}/${playerName}.xlsx`;

    // Find the <td> element with the specified class and get its text content
    let summary = $(this).find(
      ".ds-w-0.ds-whitespace-nowrap.ds-min-w-max.ds-text-right"
    );

    summary.each(function (index) {
      let value = $(this).text();
      data[index] = value;
    });

    const newRow = {
      Venue: venue,
      Date: date,
      "Opponent Team": team1,
      Runs: data[0],
      "Ball Faced": data[1],
      Fours: data[3],
      Sixes: data[4],
      "Strike Rate": data[5],
    };

    createExcel(filePath, newRow);
  });

  //same process for team 2
  team2Players.each(function () {
    if ($(this).hasClass("ds-text-tight-s")) return false;
    let playerName = $(this).find("a").attr("title");

    let filePath = `ipl/${team2}/${playerName}.xlsx`;

    // Find the <td> element with the specified class and get its text content
    let summary = $(this).find(
      ".ds-w-0.ds-whitespace-nowrap.ds-min-w-max.ds-text-right"
    );

    summary.each(function (index) {
      let value = $(this).text();
      data[index] = value;
    });

    const newRow = {
      Venue: venue,
      Date: date,
      "Opponent Team": team1,
      Runs: data[0],
      "Ball Faced": data[1],
      Fours: data[3],
      Sixes: data[4],
      "Strike Rate": data[5],
    };

    createExcel(filePath, newRow);
  });
}

function createExcel(filePath, newRow) {
  const headings = [
    "Venue",
    "Date",
    "Opponent Team",
    "Runs",
    "Ball Faced",
    "Fours",
    "Sixes",
    "Strike Rate",
  ];

  if (!fs.existsSync(filePath)) {
    // If the file doesn't exist, create a new Excel file and add the player name

    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.json_to_sheet([newRow], {
      header: headings,
    });

    xlsx.utils.book_append_sheet(workbook, worksheet, "Sheet 1");
    xlsx.writeFile(workbook, filePath);
  } else {
    //   If the file exists, load it
    const workbook = xlsx.readFile(filePath);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    xlsx.utils.sheet_add_json(worksheet, [newRow], {
      skipHeader: true,
      origin: -1,
    });

    // Save the updated workbook
    xlsx.writeFile(workbook, filePath);
  }
}

module.exports = {
  getPlayerScores,
};
