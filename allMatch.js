const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const baseUrl = "https://www.espncricinfo.com";
const { getPlayerScores } = require("./scores.js");

function allMatchesHtmlLoad(html) {
  let $ = cheerio.load(html);

  fs.existsSync("ipl") ? null : fs.mkdirSync("ipl");

  $(".ds-p-4").each((i, match) => {
    if (i < 60) {
      let matchLink = $(match).find("a").attr("href");
      allMatchesInfo(baseUrl + matchLink);
    }
  });
}

function allMatchesInfo(matchLink) {
  axios
    .get(matchLink)
    .then((response) => {
      allMatchesInfoHtmlLoad(response.data);
    })
    .catch((error) => {
      console.error(error);
    });
}

function allMatchesInfoHtmlLoad(html) {
  let $ = cheerio.load(html);

  let summary = $(".ds-text-tight-m.ds-font-regular.ds-text-typo-mid3").text();
  let parts = summary.split(",");

  let venue = parts[1].trim();
  let date = parts[2].trim();

  let teamsArr = $(
    ".ci-team-score.ds-flex.ds-justify-between.ds-items-center.ds-text-typo.ds-mb-2>div>a"
  );

  let team1 = $(teamsArr[0]).text();
  let team2 = $(teamsArr[1]).text();

  fs.existsSync(`ipl/${team1}`) ? null : fs.mkdirSync(`ipl/${team1}`);
  fs.existsSync(`ipl/${team2}`) ? null : fs.mkdirSync(`ipl/${team2}`);

  getPlayerScores(html, venue, date, team1, team2);
}

module.exports = {
  allMatchesHtmlLoad,
};
