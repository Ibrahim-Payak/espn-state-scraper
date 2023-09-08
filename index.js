const url =
  "https://www.espncricinfo.com/series/indian-premier-league-2023-1345038";
const baseUrl = "https://www.espncricinfo.com";

const axios = require("axios");
const cheerio = require("cheerio");
const { allMatchesHtmlLoad } = require("./allMatch.js");

axios
  .get(url)
  .then((response) => {
    htmlLoad(response.data);
  })
  .catch((error) => {
    console.error(error);
  });

function htmlLoad(html) {
  let $ = cheerio.load(html);

  let linkArr = $(".ds-border-t.ds-border-line.ds-text-center.ds-py-2>a");
  let link = $(linkArr[0]).attr("href");
  link = baseUrl + link;
  allMatches(link);
}

function allMatches(link) {
  axios
    .get(link)
    .then((response) => {
      allMatchesHtmlLoad(response.data);
    })
    .catch((error) => {
      console.error(error);
    });
}
