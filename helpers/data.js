const News = require("../models/news");

// Sort the stories with descending order.
exports.getTopStories = async () => {
  const news = await News.find({});
  return news.sort(this.compare);
};

// Returns all the stories
exports.getAllStories = async () => {
  return await News.find({});
};

// Searching a term
// will be replaced with elasticsearch later
exports.searchStories = async (key) => {
  const term = key.toLowerCase();
  const news = await News.find({}).lean();
  let found = [];
  // Checking individual stories
  news.some((title) => {
    // Splitting words
    let titleArray = title.title.split(" ");
    for (let index = 0; index < titleArray.length; index++) {
      const element = titleArray[index];
      // Replacing special characters
      const replaced_element = element
        .replace(/[^a-zA-Z0-9 ]/g, "")
        .toLowerCase();
      // Checking match
      if (replaced_element === term) {
        found.push(title);
        break;
      }
    }
  });
  if (found && found.length != 0) {
    return found;
  } else {
    return { msg: "Keyword not found" };
  }
};

exports.getHigherScore = async (score) => {
  return await News.find({ score: { $gt: score } });
};

// Function to sort stories by descending order
exports.compare = async (a, b) => {
  let comparison = 0;
  if (a.score > b.score) comparison = -1;
  else if (a.score < b.score) comparison = 1;
  return comparison;
};
