const News = require("../models/news");

// Sort the stories with descending order.
exports.getTopStories = async () => {
  let news = await News.find({});
  return news.sort((a, b) => {
    return b.score - a.score;
  });
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

exports.prepareStories = (stories) => {
  return stories
    .map((story, index) => {
      const domain = story.url ? new URL(story.url).hostname : null;
      return {
        ...story,
        index: index + 1,
        domain,
      };
    })
    .filter((story) => {
      return story.url ? story : false;
    });
};
